import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator,
  Dimensions, Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn, FadeInUp, ZoomIn,
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, PORTRAITS } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

const { width: SW, height: SH } = Dimensions.get("window");
const GRID = 3;
const GAP = 3;
const BOARD_PAD = 10;
const HEADER_H = 68;
const TUTORIAL_KEY = "jigsaw_tutorial_v3";
const bestKey = (id: string) => `jigsaw_best_${id}`;

function fmtTime(ms: number) {
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`;
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

const haptic = (type: "tap" | "snap" | "wrong" | "win") => {
  if (Platform.OS === "web") return;
  switch (type) {
    case "tap": Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); break;
    case "snap": Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {}); break;
    case "wrong": Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {}); break;
    case "win": Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); break;
  }
};

type Puzzle = {
  id: string; name: string; color: string; era: string;
  grid: number; xp_reward: number; solved: boolean;
};

// ─── DraggablePiece ──────────────────────────────────────────────────────────
function DraggablePiece({
  pieceIdx, portrait, PS, homeX, homeY,
  slotCenterFn, snapRadius, onPlaced, onWrong, onFirstMove, isPlaced, puzzle,
}: {
  pieceIdx: number; portrait: any; PS: number;
  homeX: number; homeY: number;
  slotCenterFn: (s: number) => { x: number; y: number };
  snapRadius: number;
  onPlaced: (pieceIdx: number, slotIdx: number) => void;
  onWrong: () => void;
  onFirstMove: () => void;
  isPlaced: boolean;
  puzzle: Puzzle;
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const sc = useSharedValue(1);
  const zi = useSharedValue(isPlaced ? 2 : 1);

  const pan = useMemo(() =>
    Gesture.Pan()
      .enabled(!isPlaced)
      .minDistance(3)
      .onStart(() => {
        sc.value = withTiming(1.12, { duration: 100 });
        zi.value = 100;
        runOnJS(onFirstMove)();
      })
      .onUpdate((e) => {
        tx.value = e.translationX;
        ty.value = e.translationY;
      })
      .onEnd((e) => {
        sc.value = withTiming(1, { duration: 150 });
        zi.value = isPlaced ? 2 : 1;

        const centerX = homeX + PS / 2 + e.translationX;
        const centerY = homeY + PS / 2 + e.translationY;

        let bestSlot = -1;
        let bestDist = snapRadius;
        for (let s = 0; s < GRID * GRID; s++) {
          const c = slotCenterFn(s);
          const d = Math.hypot(centerX - c.x, centerY - c.y);
          if (d < bestDist) { bestDist = d; bestSlot = s; }
        }

        if (bestSlot === pieceIdx) {
          // Correct — snap to board slot
          const c = slotCenterFn(bestSlot);
          tx.value = withSpring(c.x - PS / 2 - homeX, { damping: 20, stiffness: 200 });
          ty.value = withSpring(c.y - PS / 2 - homeY, { damping: 20, stiffness: 200 });
          zi.value = 2;
          runOnJS(onPlaced)(pieceIdx, bestSlot);
        } else {
          // Wrong or miss — bounce back home
          tx.value = withSpring(0, { damping: 18, stiffness: 180 });
          ty.value = withSpring(0, { damping: 18, stiffness: 180 });
          if (bestSlot !== -1) runOnJS(onWrong)();
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPlaced, homeX, homeY, PS, snapRadius, pieceIdx]
  );

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: sc.value },
    ],
    zIndex: zi.value,
    elevation: zi.value > 2 ? 20 : zi.value,
  }));

  const col = pieceIdx % GRID;
  const row = Math.floor(pieceIdx / GRID);

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          st.piece,
          {
            left: homeX, top: homeY,
            width: PS, height: PS,
            borderColor: isPlaced ? C.green : "#FFFFFFAA",
            borderWidth: isPlaced ? 3 : 1.5,
          },
          animStyle,
        ]}
      >
        <View style={{ width: PS, height: PS, overflow: "hidden", borderRadius: 5 }}>
          {portrait ? (
            <Image
              source={portrait}
              style={{
                width: PS * GRID,
                height: PS * GRID,
                marginLeft: -col * PS,
                marginTop: -row * PS,
              }}
            />
          ) : (
            <View style={{
              width: PS, height: PS, backgroundColor: puzzle.color + "CC",
              alignItems: "center", justifyContent: "center",
            }}>
              <Text style={{ fontSize: PS * 0.35, fontWeight: "900", color: C.white }}>
                {pieceIdx + 1}
              </Text>
            </View>
          )}
        </View>
        {isPlaced && (
          <View style={st.correctTick}>
            <Ionicons name="checkmark" size={11} color={C.white} />
          </View>
        )}
      </Animated.View>
    </GestureDetector>
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
  const insets = useSafeAreaInsets();

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [trayOrder, setTrayOrder] = useState<number[]>([]);
  // placedAt[pieceIdx] = slotIdx when correctly placed, else null
  const [placedAt, setPlacedAt] = useState<(number | null)[]>(Array(9).fill(null));
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalMs, setFinalMs] = useState<number | null>(null);
  const [bestMs, setBestMs] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState(false);
  const [reward, setReward] = useState<{ xp: number } | null>(null);
  const [moves, setMoves] = useState(0);

  const startRef = useRef<number | null>(null);
  const timerRef = useRef<any>(null);
  const hintRef = useRef<any>(null);
  const elapsedRef = useRef(0);
  // Keep a ref so onPiecePlaced closure always has current elapsed
  useEffect(() => { elapsedRef.current = elapsedMs; }, [elapsedMs]);

  // ── Layout math ─────────────────────────────────────────────────────────────
  const gameH = SH - insets.top - HEADER_H - insets.bottom;
  const BOARD_SIZE = Math.min(SW - 32, Math.floor(gameH * 0.47));
  const PS = Math.floor((BOARD_SIZE - BOARD_PAD * 2 - GAP * (GRID - 1)) / GRID);

  const BOARD_X = (SW - BOARD_SIZE) / 2;
  const BOARD_Y = 8;
  const TRAY_LABEL_Y = BOARD_Y + BOARD_SIZE + 10;
  const TRAY_W = PS * GRID + GAP * (GRID - 1);
  const TRAY_X = (SW - TRAY_W) / 2;
  const TRAY_Y = TRAY_LABEL_Y + 22;

  const slotCenterFn = useCallback((s: number) => ({
    x: BOARD_X + BOARD_PAD + (s % GRID) * (PS + GAP) + PS / 2,
    y: BOARD_Y + BOARD_PAD + Math.floor(s / GRID) * (PS + GAP) + PS / 2,
  }), [BOARD_X, BOARD_Y, PS]);

  const trayPos = useCallback((trayIdx: number) => ({
    x: TRAY_X + (trayIdx % GRID) * (PS + GAP),
    y: TRAY_Y + Math.floor(trayIdx / GRID) * (PS + GAP),
  }), [TRAY_X, TRAY_Y, PS]);

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const r = await API.get("/jigsaw");
        const p = (r.data as Puzzle[]).find((x) => x.id === id);
        if (!p) { router.back(); return; }
        setPuzzle(p);
        startNewGame();
        try {
          const bt = await AsyncStorage.getItem(bestKey(p.id));
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
      if (hintRef.current) clearTimeout(hintRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const startNewGame = useCallback(() => {
    setTrayOrder(shuffleNotSolved(9));
    setPlacedAt(Array(9).fill(null));
    setCompleted(false);
    setReward(null);
    setFinalMs(null);
    setNewRecord(false);
    setElapsedMs(0);
    setMoves(0);
    setShowHint(false);
    startRef.current = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (startRef.current) setElapsedMs(Date.now() - startRef.current);
    }, 300);
  }, []);

  const onPiecePlaced = useCallback((pieceIdx: number, slotIdx: number) => {
    haptic("snap");
    setMoves((m) => m + 1);
    setPlacedAt((prev) => {
      const next = [...prev];
      next[pieceIdx] = slotIdx;
      if (next.every((v, i) => v === i)) {
        const f = startRef.current ? Date.now() - startRef.current : elapsedRef.current;
        if (timerRef.current) clearInterval(timerRef.current);
        setFinalMs(f);
        setCompleted(true);
        haptic("win");
        AsyncStorage.getItem(bestKey(id as string)).then((bt) => {
          const prev2 = bt ? parseInt(bt) : null;
          if (prev2 == null || f < prev2) {
            AsyncStorage.setItem(bestKey(id as string), String(f));
            setNewRecord(true);
          }
        });
        API.post(`/jigsaw/${id}/complete`)
          .then((r2) => setReward({ xp: r2.data.xp_awarded || 30 }))
          .catch(() => setReward({ xp: 30 }));
      }
      return next;
    });
  }, [id]);

  const onWrong = useCallback(() => { haptic("wrong"); }, []);

  const dismissTutorial = useCallback(() => {
    setShowTutorial(false);
    AsyncStorage.setItem(TUTORIAL_KEY, "1").catch(() => {});
  }, []);

  const showHintFor2s = useCallback(() => {
    setShowHint(true);
    haptic("tap");
    if (hintRef.current) clearTimeout(hintRef.current);
    hintRef.current = setTimeout(() => setShowHint(false), 2000);
  }, []);

  if (!puzzle) {
    return (
      <SafeAreaView style={[st.c, { justifyContent: "center", alignItems: "center" }]} edges={["top"]}>
        <ActivityIndicator size="large" color={C.saffron} />
      </SafeAreaView>
    );
  }

  const portrait = PORTRAITS[puzzle.id];
  const placedCount = placedAt.filter((v, i) => v === i).length;

  // ── Celebration ─────────────────────────────────────────────────────────────
  if (completed && reward) {
    return (
      <SafeAreaView style={[st.c, { backgroundColor: puzzle.color }]} edges={["top", "bottom"]}>
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
            onPress={startNewGame}>
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
      {/* Header */}
      <View style={[st.header, { backgroundColor: puzzle.color }]}>
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
        <TouchableOpacity style={st.hintBtn} onPress={showHintFor2s} testID="hint-btn">
          <Ionicons name="eye" size={18} color={C.white} />
          <Text style={st.hintTxt}>Hint</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[st.hintBtn, { marginLeft: 4, paddingHorizontal: 8 }]}
          onPress={startNewGame} testID="reshuffle-btn">
          <Ionicons name="shuffle" size={18} color={C.white} />
        </TouchableOpacity>
      </View>

      {/* Game area — all children absolutely positioned */}
      <View style={{ flex: 1 }} testID="puzzle-area">
        {/* Board */}
        <View style={[st.board, {
          left: BOARD_X, top: BOARD_Y,
          width: BOARD_SIZE, height: BOARD_SIZE,
          backgroundColor: puzzle.color,
        }]}>
          {portrait && (
            <Image
              source={portrait}
              style={{
                position: "absolute",
                left: BOARD_PAD, top: BOARD_PAD,
                width: PS * GRID + GAP * (GRID - 1),
                height: PS * GRID + GAP * (GRID - 1),
                opacity: 0.14, borderRadius: 6,
              }}
            />
          )}
          {Array.from({ length: 9 }, (_, i) => {
            const filled = placedAt[i] === i;
            return (
              <View
                key={i}
                style={{
                  position: "absolute",
                  left: BOARD_PAD + (i % GRID) * (PS + GAP),
                  top: BOARD_PAD + Math.floor(i / GRID) * (PS + GAP),
                  width: PS, height: PS,
                  borderRadius: 6, borderWidth: 2,
                  borderColor: filled ? C.green : "#FFFFFF55",
                  backgroundColor: filled ? "#22C55E11" : "#00000020",
                }}
              />
            );
          })}
          {/* Hint overlay */}
          {showHint && portrait && (
            <Animated.View
              entering={FadeIn.duration(120)}
              style={{
                position: "absolute", left: BOARD_PAD, top: BOARD_PAD,
                width: PS * GRID + GAP * (GRID - 1),
                height: PS * GRID + GAP * (GRID - 1),
                borderRadius: 6, overflow: "hidden",
              }}
            >
              <Image source={portrait} style={{ width: "100%", height: "100%" }} />
              <View style={{
                position: "absolute", bottom: 6, right: 8,
                backgroundColor: "#000A", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2,
              }}>
                <Text style={{ color: C.white, fontSize: 11, fontWeight: "900" }}>Hint 👁</Text>
              </View>
            </Animated.View>
          )}
        </View>

        {/* Tray label */}
        <Text style={[st.trayLabel, { left: TRAY_X, top: TRAY_LABEL_Y, width: TRAY_W }]}>
          🧩 Drag pieces to the board above
        </Text>

        {/* All draggable pieces */}
        {trayOrder.map((pieceIdx, tp) => {
          const home = trayPos(tp);
          const isPlaced = placedAt[pieceIdx] === pieceIdx;
          return (
            <DraggablePiece
              key={pieceIdx}
              pieceIdx={pieceIdx}
              portrait={portrait}
              PS={PS}
              homeX={home.x}
              homeY={home.y}
              slotCenterFn={slotCenterFn}
              snapRadius={PS * 0.62}
              onPlaced={onPiecePlaced}
              onWrong={onWrong}
              onFirstMove={dismissTutorial}
              isPlaced={isPlaced}
              puzzle={puzzle}
            />
          );
        })}

        {/* Tutorial overlay */}
        {showTutorial && (
          <Animated.View entering={FadeIn.duration(300)} style={st.tutOverlay} pointerEvents="box-none">
            <View style={st.tutCard}>
              <Text style={st.tutEmoji}>🧩</Text>
              <Text style={st.tutTitle}>How to Play</Text>
              <Text style={st.tutStep}>1. <Text style={{ fontWeight: "900" }}>Drag</Text> a piece from below</Text>
              <Text style={st.tutStep}>2. Drop on the <Text style={{ fontWeight: "900" }}>matching spot</Text> above</Text>
              <Text style={[st.tutStep, { color: C.green }]}>
                3. <Text style={{ fontWeight: "900" }}>Green</Text> border = correct! ✓
              </Text>
              <TouchableOpacity style={st.tutBtn} onPress={dismissTutorial}>
                <Text style={st.tutBtnTxt}>Got it! Let's go 🚀</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  header: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    height: HEADER_H, borderBottomWidth: 2, borderBottomColor: C.navy,
  },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 17, fontWeight: "900", color: C.white },
  statRow: { flexDirection: "row", gap: 6, marginTop: 3, flexWrap: "wrap" },
  statChip: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: "#00000033", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999,
  },
  statTxt: { color: C.white, fontWeight: "900", fontSize: 11 },
  hintBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#FFFFFF22", paddingHorizontal: 10, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: "#FFFFFF55",
  },
  hintTxt: { color: C.white, fontWeight: "900", fontSize: 12 },
  board: {
    position: "absolute",
    borderRadius: 16, borderWidth: 2.5, borderColor: C.navy,
    ...SHADOW,
  },
  piece: {
    position: "absolute",
    borderRadius: 7,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    backgroundColor: "#0003",
  },
  correctTick: {
    position: "absolute", right: 3, top: 3,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: C.green, justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: C.white,
  },
  trayLabel: {
    position: "absolute",
    textAlign: "center", fontSize: 12, fontWeight: "800", color: C.navy,
  },
  // Celebration
  celebrateBox: { flex: 1, padding: 28, justifyContent: "center", alignItems: "center" },
  celebrateImg: {
    width: 150, height: 150, borderRadius: 75,
    borderWidth: 4, borderColor: C.gold,
  },
  celTitle: { fontSize: 28, fontWeight: "900", color: C.white, marginTop: 18, textAlign: "center" },
  celSub: { fontSize: 16, fontWeight: "700", color: "#FFFFFFDD", marginTop: 6, textAlign: "center" },
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
    backgroundColor: C.white, paddingHorizontal: 22, paddingVertical: 13,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, marginTop: 16,
  },
  doneBtnAlt: { backgroundColor: "transparent", borderColor: C.white },
  doneBtnTxt: { color: C.navy, fontWeight: "900", fontSize: 14 },
  confettiWrap: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center", justifyContent: "flex-start", paddingTop: 60,
    zIndex: 20,
  },
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
