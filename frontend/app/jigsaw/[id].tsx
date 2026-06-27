import { useEffect, useRef, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ScrollView,
  ActivityIndicator, Dimensions, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn, FadeInUp, ZoomIn,
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, PORTRAITS } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

const { width: SW } = Dimensions.get("window");
const GRID = 3;
const PIECE_GAP = 3;
const PIECE_SIZE = Math.floor((Math.min(SW - 40, 330) - PIECE_GAP * 2) / GRID);
const PUZZLE_SIZE = PIECE_SIZE * GRID + PIECE_GAP * 2;
const HEADER_H = 68;
const TUTORIAL_KEY = "jigsaw_tutorial_v4";
const MAX_PEEKS = 3;
const bestKey = (id: string) => `jigsaw_best_${id}`;

function fmtTime(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

function shuffleNotSolved(n: number): number[] {
  for (let t = 0; t < 20; t++) {
    const a = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (a.some((v, i) => v !== i)) return a;
  }
  return Array.from({ length: n }, (_, i) => (i + 1) % n);
}

const haptic = (type: "tap" | "snap" | "win") => {
  if (Platform.OS === "web") return;
  switch (type) {
    case "tap": Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); break;
    case "snap": Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}); break;
    case "win": Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); break;
  }
};

type Puzzle = {
  id: string; name: string; color: string; era: string;
  grid: number; xp_reward: number; solved: boolean;
};

// ─── Single puzzle piece ─────────────────────────────────────────────────────
function PuzzlePiece({
  correctIdx, portrait, isSelected, isCorrect, onPress,
}: {
  correctIdx: number; portrait: any;
  isSelected: boolean; isCorrect: boolean; onPress: () => void;
}) {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.07 : 1, { damping: 14, stiffness: 280 });
  }, [isSelected, scale]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const cRow = Math.floor(correctIdx / GRID);
  const cCol = correctIdx % GRID;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isCorrect ? 1 : 0.82}
      style={{ zIndex: isSelected ? 10 : 1 }}
    >
      <Animated.View style={[{ width: PIECE_SIZE, height: PIECE_SIZE }, anim]}>
        {/* Image crop */}
        <View style={{ width: PIECE_SIZE, height: PIECE_SIZE, overflow: "hidden", borderRadius: 3 }}>
          {portrait ? (
            <Image
              source={portrait}
              style={{
                width: PIECE_SIZE * GRID,
                height: PIECE_SIZE * GRID,
                position: "absolute",
                top: -cRow * PIECE_SIZE,
                left: -cCol * PIECE_SIZE,
              }}
              resizeMode="cover"
            />
          ) : (
            <View style={[st.pieceFallback]}>
              <Text style={st.pieceFallbackTxt}>{correctIdx + 1}</Text>
            </View>
          )}
        </View>

        {/* Selection / correct border overlay — drawn on top, doesn't affect layout */}
        {(isSelected || isCorrect) && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              borderRadius: 3,
              borderWidth: isSelected ? 3 : 2,
              borderColor: isSelected ? C.saffron : "#22C55E",
            }}
          />
        )}

        {/* Checkmark badge — only for correct pieces */}
        {isCorrect && (
          <View style={st.correctTick} pointerEvents="none">
            <Ionicons name="checkmark" size={11} color={C.white} />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function ConfettiItem({ emoji, index, total }: { emoji: string; index: number; total: number }) {
  const ty = useSharedValue(-20);
  const tx = useSharedValue(0);
  const rot = useSharedValue(0);
  const op = useSharedValue(0);
  useEffect(() => {
    const dx = (index - (total - 1) / 2) * 42;
    op.value = withTiming(1, { duration: 80 });
    tx.value = withTiming(dx, { duration: 1400 });
    ty.value = withTiming(380 + (index % 3) * 28, { duration: 1700 });
    rot.value = withTiming(540, { duration: 1700 });
    setTimeout(() => { op.value = withTiming(0, { duration: 350 }); }, 1350);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const anim = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { rotate: `${rot.value}deg` }],
  }));
  return <Animated.Text style={[st.confetti, anim]}>{emoji}</Animated.Text>;
}
function ConfettiBurst() {
  const items = ["🎉", "✨", "⭐", "🎊", "🏆", "💫", "🎉", "✨", "🌟"];
  return (
    <View pointerEvents="none" style={st.confettiWrap}>
      {items.map((e, i) => <ConfettiItem key={i} emoji={e} index={i} total={items.length} />)}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function JigsawPlay() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  // pieces[displayPos] = correctIdx of the piece shown at that position
  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedPos, setSelectedPos] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [peekVisible, setPeekVisible] = useState(false);
  const [peeksLeft, setPeeksLeft] = useState(MAX_PEEKS);
  const [peekCountdown, setPeekCountdown] = useState(2);
  const [showTutorial, setShowTutorial] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalMs, setFinalMs] = useState<number | null>(null);
  const [bestMs, setBestMs] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState(false);
  const [reward, setReward] = useState<{ xp: number } | null>(null);
  const [moves, setMoves] = useState(0);

  const startRef = useRef<number | null>(null);
  const timerRef = useRef<any>(null);
  const peekTimersRef = useRef<any[]>([]);
  const elapsedRef = useRef(0);
  useEffect(() => { elapsedRef.current = elapsedMs; }, [elapsedMs]);

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const r = await API.get("/jigsaw");
        const p = (r.data as Puzzle[]).find((x) => x.id === id);
        if (!p) { router.back(); return; }
        setPuzzle(p);
        doStartNewGame();
        try {
          const bt = await AsyncStorage.getItem(bestKey(id as string));
          if (bt) setBestMs(parseInt(bt));
        } catch {}
        try {
          const seen = await AsyncStorage.getItem(TUTORIAL_KEY);
          if (!seen) setShowTutorial(true);
        } catch {}
      } catch {}
    })();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      peekTimersRef.current.forEach(clearTimeout);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const doStartNewGame = useCallback(() => {
    setPieces(shuffleNotSolved(9));
    setSelectedPos(null);
    setCompleted(false);
    setReward(null);
    setFinalMs(null);
    setNewRecord(false);
    setElapsedMs(0);
    setMoves(0);
    setPeeksLeft(MAX_PEEKS);
    setPeekVisible(false);
    peekTimersRef.current.forEach(clearTimeout);
    startRef.current = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (startRef.current) setElapsedMs(Date.now() - startRef.current);
    }, 300);
  }, []);

  const handleComplete = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const f = startRef.current ? Date.now() - startRef.current : elapsedRef.current;
    setFinalMs(f);
    setCompleted(true);
    haptic("win");
    try {
      const bt = await AsyncStorage.getItem(bestKey(id as string));
      const prev = bt ? parseInt(bt) : null;
      if (prev == null || f < prev) {
        AsyncStorage.setItem(bestKey(id as string), String(f));
        setNewRecord(true);
      }
    } catch {}
    try {
      const r2 = await API.post(`/jigsaw/${id}/complete`);
      setReward({ xp: r2.data.xp_awarded || 30 });
    } catch {
      setReward({ xp: 30 });
    }
  }, [id]);

  const handleTap = useCallback((pos: number) => {
    if (completed) return;
    if (pieces[pos] === pos) {
      haptic("tap");
      return; // already correct — ignore
    }
    if (selectedPos === null) {
      haptic("tap");
      setSelectedPos(pos);
    } else if (selectedPos === pos) {
      setSelectedPos(null); // deselect
    } else {
      // Swap selectedPos ↔ pos
      haptic("snap");
      const next = [...pieces];
      [next[selectedPos], next[pos]] = [next[pos], next[selectedPos]];
      setPieces(next);
      setSelectedPos(null);
      setMoves((m) => m + 1);
      if (next.every((v, i) => v === i)) {
        setTimeout(handleComplete, 60);
      }
    }
  }, [completed, pieces, selectedPos, handleComplete]);

  const handlePeek = useCallback(() => {
    if (peeksLeft <= 0 || peekVisible || completed) return;
    haptic("tap");
    peekTimersRef.current.forEach(clearTimeout);
    setPeeksLeft((l) => l - 1);
    setPeekVisible(true);
    setPeekCountdown(2);
    peekTimersRef.current = [
      setTimeout(() => setPeekCountdown(1), 1000),
      setTimeout(() => setPeekVisible(false), 2000),
    ];
  }, [peeksLeft, peekVisible, completed]);

  const dismissTutorial = useCallback(() => {
    setShowTutorial(false);
    AsyncStorage.setItem(TUTORIAL_KEY, "1").catch(() => {});
  }, []);

  if (!puzzle || pieces.length === 0) {
    return (
      <SafeAreaView style={[st.c, { justifyContent: "center", alignItems: "center" }]} edges={["top"]}>
        <ActivityIndicator size="large" color={C.saffron} />
      </SafeAreaView>
    );
  }

  const portrait = PORTRAITS[puzzle.id];
  const placedCount = pieces.filter((v, i) => v === i).length;

  // ── Celebration ─────────────────────────────────────────────────────────────
  if (completed && reward) {
    return (
      <SafeAreaView style={[st.c, { backgroundColor: "#FDFBF7" }]} edges={["top", "bottom"]}>
        <ConfettiBurst />
        <View style={st.celebrateBox}>
          <Animated.View entering={ZoomIn.duration(500)}>
            <Image source={portrait} style={st.celebrateImg} />
          </Animated.View>
          <Animated.Text entering={FadeInUp.delay(200)} style={st.celTitle}>
            Puzzle Solved! 🎉
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(350)} style={st.celSub}>
            {puzzle.name}
          </Animated.Text>
          <Animated.View entering={FadeInUp.delay(500)} style={st.rewardRow}>
            <View style={st.rewardChip}>
              <Ionicons name="star" size={18} color={C.navy} />
              <Text style={st.rewardTxt}>+{reward.xp} XP</Text>
            </View>
            <View style={st.rewardChip}>
              <Ionicons name="time" size={18} color={C.navy} />
              <Text style={st.rewardTxt}>{fmtTime(finalMs || elapsedMs)}</Text>
            </View>
            <View style={st.rewardChip}>
              <Ionicons name="swap-horizontal" size={18} color={C.navy} />
              <Text style={st.rewardTxt}>{moves} moves</Text>
            </View>
          </Animated.View>
          {newRecord && (
            <Animated.View entering={FadeInUp.delay(700)} style={st.recordChip}>
              <Ionicons name="trophy" size={18} color={C.gold} />
              <Text style={st.recordTxt}>🏆 New Personal Best!</Text>
            </Animated.View>
          )}
          <TouchableOpacity style={st.doneBtn} activeOpacity={0.85}
            onPress={() => router.replace("/jigsaw" as any)}>
            <Text style={st.doneBtnTxt}>Try Another Hero</Text>
            <Ionicons name="arrow-forward" size={18} color={C.navy} />
          </TouchableOpacity>
          <TouchableOpacity style={[st.doneBtn, st.doneBtnAlt]} activeOpacity={0.85}
            onPress={doStartNewGame}>
            <Text style={[st.doneBtnTxt, { color: C.white }]}>Play Again</Text>
            <Ionicons name="refresh" size={18} color={C.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Game ────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={st.c} edges={["top", "bottom"]}>
      {/* Header — always navy */}
      <View style={st.header}>
        <TouchableOpacity onPress={() => router.back()} style={st.backBtn} testID="jigsaw-back">
          <Ionicons name="arrow-back" size={24} color={C.white} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={st.headerTitle} numberOfLines={1}>{puzzle.name}</Text>
          <View style={st.statRow}>
            <View style={st.statChip}>
              <Ionicons name="time-outline" size={12} color={C.white} />
              <Text style={st.statTxt}>{fmtTime(elapsedMs)}</Text>
            </View>
            <View style={st.statChip}>
              <Ionicons name="checkmark-circle-outline" size={12} color={C.white} />
              <Text style={st.statTxt}>{placedCount}/9</Text>
            </View>
            {bestMs != null && (
              <View style={st.statChip}>
                <Ionicons name="trophy-outline" size={12} color={C.gold} />
                <Text style={st.statTxt}>{fmtTime(bestMs)}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={st.scroll} testID="puzzle-scroll">
        {/* Instruction banner */}
        <View style={st.instructBanner}>
          <Text style={st.instructTxt}>
            {selectedPos !== null
              ? "✨ Now tap another piece to swap!"
              : "🧩 Tap two pieces to swap them"}
          </Text>
        </View>

        {/* Puzzle grid + peek overlay container */}
        <View style={{ position: "relative", width: PUZZLE_SIZE, alignSelf: "center" }}>
          {/* 3×3 grid */}
          <View style={st.grid} testID="puzzle-grid">
            {pieces.map((correctIdx, displayPos) => (
              <PuzzlePiece
                key={displayPos}
                correctIdx={correctIdx}
                portrait={portrait}
                isSelected={selectedPos === displayPos}
                isCorrect={correctIdx === displayPos}
                onPress={() => handleTap(displayPos)}
              />
            ))}
          </View>

          {/* Peek overlay — full portrait with countdown */}
          {peekVisible && portrait && (
            <Animated.View
              entering={FadeIn.duration(120)}
              style={[StyleSheet.absoluteFill, st.peekOverlay]}
              pointerEvents="none"
            >
              <Image source={portrait} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              <View style={st.peekBadge}>
                <Text style={st.peekBadgeTxt}>Memorise it! {peekCountdown}…</Text>
              </View>
            </Animated.View>
          )}
        </View>

        {/* Action buttons */}
        <View style={st.btnRow}>
          <TouchableOpacity style={st.actionBtn} onPress={doStartNewGame} testID="reshuffle-btn">
            <Ionicons name="shuffle" size={18} color={C.navy} />
            <Text style={st.actionBtnTxt}>Shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[st.actionBtn, peeksLeft <= 0 && st.actionBtnDim]}
            onPress={handlePeek}
            disabled={peeksLeft <= 0}
            testID="peek-btn"
          >
            <Ionicons name="eye" size={18} color={peeksLeft > 0 ? C.navy : "#AAA"} />
            <Text style={[st.actionBtnTxt, peeksLeft <= 0 && { color: "#AAA" }]}>
              Peek Goal ({peeksLeft})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={[st.progressWrap, { width: PUZZLE_SIZE }]}>
          <View style={[st.progressFill, { width: `${(placedCount / 9) * 100}%` }]} />
        </View>
        <Text style={st.progressTxt}>{placedCount} of 9 in place</Text>
      </ScrollView>

      {/* Tutorial overlay */}
      {showTutorial && (
        <Animated.View entering={FadeIn.duration(300)} style={st.tutOverlay} pointerEvents="box-none">
          <View style={st.tutCard}>
            <Text style={st.tutEmoji}>🧩</Text>
            <Text style={st.tutTitle}>How to Play</Text>
            <Text style={st.tutStep}>1. <Text style={{ fontWeight: "900" }}>Tap</Text> any piece to select it</Text>
            <Text style={st.tutStep}>2. Tap another piece to <Text style={{ fontWeight: "900" }}>swap</Text> them</Text>
            <Text style={st.tutStep}>3. ✅ when a piece is in the right spot!</Text>
            <TouchableOpacity style={st.tutBtn} onPress={dismissTutorial}>
              <Text style={st.tutBtnTxt}>Got it! Let's go 🚀</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#FDFBF7" },

  // Header — always deep navy
  header: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    height: HEADER_H, backgroundColor: C.navy,
    borderBottomWidth: 2, borderBottomColor: "#000A",
  },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 17, fontWeight: "900", color: C.white },
  statRow: { flexDirection: "row", gap: 6, marginTop: 3, flexWrap: "wrap" },
  statChip: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: "#FFFFFF22", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999,
  },
  statTxt: { color: C.white, fontWeight: "900", fontSize: 11 },

  scroll: { alignItems: "center", paddingTop: 16, paddingBottom: 40, paddingHorizontal: 12 },

  // Instruction
  instructBanner: {
    backgroundColor: "#FFF3D4", paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 999, borderWidth: 1.5, borderColor: C.saffron,
    marginBottom: 14, alignSelf: "center",
  },
  instructTxt: { fontSize: 13, fontWeight: "800", color: C.navy, textAlign: "center" },

  // Puzzle grid — navy background shows through gaps as dividers
  grid: {
    flexDirection: "row", flexWrap: "wrap",
    width: PUZZLE_SIZE, gap: PIECE_GAP,
    backgroundColor: C.navy,
    borderRadius: 10, overflow: "hidden",
    borderWidth: 3, borderColor: C.navy,
    ...SHADOW,
  },

  // Piece internals
  pieceFallback: {
    flex: 1, backgroundColor: "#E8E0D4",
    alignItems: "center", justifyContent: "center",
  },
  pieceFallbackTxt: { fontSize: 22, fontWeight: "900", color: "#555" },
  correctTick: {
    position: "absolute", right: 4, top: 4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: "#22C55E",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: C.white,
  },

  // Peek
  peekOverlay: { borderRadius: 7, overflow: "hidden" },
  peekBadge: {
    position: "absolute", bottom: 10, alignSelf: "center",
    backgroundColor: "#000C", borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 6,
  },
  peekBadgeTxt: { color: C.white, fontSize: 14, fontWeight: "900" },

  // Action buttons
  btnRow: { flexDirection: "row", gap: 12, marginTop: 18, justifyContent: "center" },
  actionBtn: {
    flexDirection: "row", alignItems: "center", gap: 7,
    backgroundColor: C.white, paddingHorizontal: 18, paddingVertical: 12,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, ...SHADOW,
  },
  actionBtnDim: { opacity: 0.45 },
  actionBtnTxt: { color: C.navy, fontWeight: "900", fontSize: 13 },

  // Progress
  progressWrap: {
    height: 8, backgroundColor: "#E8E0D4",
    borderRadius: 4, overflow: "hidden",
    marginTop: 16, borderWidth: 1, borderColor: "#C4B89A",
    alignSelf: "center",
  },
  progressFill: { height: "100%", backgroundColor: C.saffron, borderRadius: 4 },
  progressTxt: { fontSize: 12, fontWeight: "800", color: C.navy, marginTop: 6, textAlign: "center" },

  // Celebration
  celebrateBox: { flex: 1, padding: 28, justifyContent: "center", alignItems: "center" },
  celebrateImg: {
    width: 150, height: 150, borderRadius: 75,
    borderWidth: 4, borderColor: C.gold,
  },
  celTitle: { fontSize: 28, fontWeight: "900", color: C.navy, marginTop: 18, textAlign: "center" },
  celSub: { fontSize: 16, fontWeight: "700", color: "#666", marginTop: 6, textAlign: "center" },
  rewardRow: { flexDirection: "row", gap: 8, marginTop: 20, flexWrap: "wrap", justifyContent: "center" },
  rewardChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.gold, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy,
  },
  rewardTxt: { color: C.navy, fontWeight: "900", fontSize: 13 },
  recordChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.navy, paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 999, borderWidth: 2, borderColor: C.gold, marginTop: 12,
  },
  recordTxt: { color: C.gold, fontWeight: "900", fontSize: 13 },
  doneBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: C.gold, paddingHorizontal: 22, paddingVertical: 13,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, marginTop: 16,
  },
  doneBtnAlt: { backgroundColor: C.navy, borderColor: C.navy },
  doneBtnTxt: { color: C.navy, fontWeight: "900", fontSize: 14 },

  // Confetti
  confettiWrap: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center", justifyContent: "flex-start", paddingTop: 60,
    zIndex: 20, pointerEvents: "none",
  } as any,
  confetti: { position: "absolute", fontSize: 26 },

  // Tutorial
  tutOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "#0008", justifyContent: "center", alignItems: "center",
    padding: 24, zIndex: 200,
  },
  tutCard: {
    backgroundColor: C.white, padding: 24, borderRadius: 24,
    borderWidth: 3, borderColor: C.navy, alignItems: "center",
    maxWidth: 340, width: "100%", ...SHADOW,
  },
  tutEmoji: { fontSize: 44, marginBottom: 6 },
  tutTitle: { fontSize: 22, fontWeight: "900", color: C.navy, marginBottom: 14 },
  tutStep: { fontSize: 14, color: C.navy, marginBottom: 10, textAlign: "center", lineHeight: 20 },
  tutBtn: {
    backgroundColor: C.saffron, paddingHorizontal: 22, paddingVertical: 12,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, marginTop: 8,
  },
  tutBtnTxt: { color: C.white, fontWeight: "900", fontSize: 14 },
});
