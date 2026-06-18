import { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator,
  Dimensions, Alert, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn, FadeInUp, ZoomIn, FadeOut,
  useSharedValue, useAnimatedStyle, withSequence, withTiming, withRepeat,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, PORTRAITS } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;
const { width: SW } = Dimensions.get("window");

type Puzzle = {
  id: string; name: string; title_en: string; title_hi: string;
  color: string; era: string; grid: number; xp_reward: number;
  portrait_url: string; solved: boolean;
};

const TUTORIAL_KEY = "jigsaw_tutorial_seen_v1";
const bestTimeKey = (id: string) => `jigsaw_best_${id}`;

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeShuffledNotSolved(n: number): number[] {
  // Ensure the shuffle isn't already solved
  for (let tries = 0; tries < 20; tries++) {
    const s = shuffleArray(Array.from({ length: n }, (_, i) => i));
    if (s.some((v, i) => v !== i)) return s;
  }
  // Fallback rotate
  return Array.from({ length: n }, (_, i) => (i + 1) % n);
}

function fmtTime(ms: number) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Cross-platform safe haptic helpers (no-op on web)
const hapticTap = () => {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};
const hapticSwap = () => {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
};
const hapticWin = () => {
  if (Platform.OS === "web") return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
};

export default function JigsawPlay() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [board, setBoard] = useState<number[]>([]); // board[i] = original piece index sitting at slot i
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reward, setReward] = useState<{ xp: number; badge?: string } | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalTimeMs, setFinalTimeMs] = useState<number | null>(null);
  const [bestTimeMs, setBestTimeMs] = useState<number | null>(null);
  const [newRecord, setNewRecord] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<any>(null);
  const peekTimerRef = useRef<any>(null);
  const tutorialTimerRef = useRef<any>(null);

  // Load puzzle, tutorial flag, best time
  useEffect(() => {
    (async () => {
      try {
        const r = await API.get("/jigsaw");
        const p = (r.data as Puzzle[]).find((x) => x.id === id);
        if (!p) {
          Alert.alert("Not found", "Puzzle missing");
          router.back();
          return;
        }
        setPuzzle(p);
        setBoard(makeShuffledNotSolved(p.grid * p.grid));
        // Load best time for this puzzle
        try {
          const bt = await AsyncStorage.getItem(bestTimeKey(p.id));
          if (bt) setBestTimeMs(parseInt(bt, 10));
        } catch {}
        // Tutorial — show once for new users
        try {
          const seen = await AsyncStorage.getItem(TUTORIAL_KEY);
          if (!seen) {
            setShowTutorial(true);
            tutorialTimerRef.current = setTimeout(() => setShowTutorial(false), 5000);
          }
        } catch {}
        // Auto-peek the goal for 2.5s when puzzle opens
        setShowPreview(true);
        peekTimerRef.current = setTimeout(() => setShowPreview(false), 2500);
        // Start timer
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
          if (startTimeRef.current) {
            setElapsedMs(Date.now() - startTimeRef.current);
          }
        }, 250);
      } catch (e: any) {
        // (offline: no auth)
}
    })();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
      if (tutorialTimerRef.current) clearTimeout(tutorialTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const grid = puzzle?.grid || 3;
  const boardPadding = 16;
  const containerWidth = Math.min(SW - 36, 360);
  const pieceSize = Math.floor((containerWidth - boardPadding * 2 - (grid - 1) * 4) / grid);
  const boardSize = pieceSize * grid + boardPadding * 2 + (grid - 1) * 4;

  const stopTimerAndRecord = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const final = startTimeRef.current ? Date.now() - startTimeRef.current : elapsedMs;
    setFinalTimeMs(final);
    // Best time check
    try {
      if (puzzle) {
        const prev = bestTimeMs;
        if (prev == null || final < prev) {
          await AsyncStorage.setItem(bestTimeKey(puzzle.id), String(final));
          setBestTimeMs(final);
          setNewRecord(true);
        }
      }
    } catch {}
  };

  const onTap = (slotIndex: number) => {
    if (completed) return;
    // Dismiss tutorial on first interaction
    if (showTutorial) {
      setShowTutorial(false);
      if (tutorialTimerRef.current) clearTimeout(tutorialTimerRef.current);
      AsyncStorage.setItem(TUTORIAL_KEY, "1").catch(() => {});
    }
    if (selected === null) {
      setSelected(slotIndex);
      hapticTap();
      return;
    }
    if (selected === slotIndex) {
      setSelected(null);
      hapticTap();
      return;
    }
    // Swap pieces between selected and slotIndex
    const next = [...board];
    [next[selected], next[slotIndex]] = [next[slotIndex], next[selected]];
    setBoard(next);
    setMoves((m) => m + 1);
    setSelected(null);
    hapticSwap();
    // Check completion
    if (next.every((v, i) => v === i)) {
      setCompleted(true);
      hapticWin();
      stopTimerAndRecord();
      submitComplete();
    }
  };

  const submitComplete = async () => {
    try {
      const r = await API.post(`/jigsaw/${id}/complete`);
      setReward({ xp: r.data.xp_awarded, badge: r.data.badge_awarded });
    } catch {
      // graceful: still show celebration locally
      setReward({ xp: puzzle?.xp_reward || 30 });
    }
  };

  const reshuffle = () => {
    if (!puzzle) return;
    setBoard(makeShuffledNotSolved(puzzle.grid * puzzle.grid));
    setSelected(null);
    setMoves(0);
    setCompleted(false);
    setReward(null);
    setFinalTimeMs(null);
    setNewRecord(false);
    setElapsedMs(0);
    startTimeRef.current = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) setElapsedMs(Date.now() - startTimeRef.current);
    }, 250);
    // brief peek again
    setShowPreview(true);
    if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
    peekTimerRef.current = setTimeout(() => setShowPreview(false), 1800);
    hapticTap();
  };

  if (!puzzle) {
    return (
      <SafeAreaView style={[styles.c, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={C.saffron} />
      </SafeAreaView>
    );
  }

  // ---------- Celebration screen ----------
  if (reward && completed) {
    return (
      <SafeAreaView style={[styles.c, { backgroundColor: puzzle.color }]} edges={["top", "bottom"]}>
        {/* Confetti burst */}
        <ConfettiBurst color={puzzle.color} />
        <View style={styles.celebrateBox}>
          <Animated.View entering={ZoomIn.duration(450)}>
            <Image source={PORTRAITS[puzzle.id] || ({ uri: `${BASE}${puzzle.portrait_url}` } as any)} style={styles.celebrateImg} />
          </Animated.View>
          <Animated.Text entering={FadeInUp.delay(200)} style={styles.celTitle}>
            Puzzle Solved! 🎉
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(350)} style={styles.celSub}>
            {puzzle.name}
          </Animated.Text>
          <Animated.View entering={FadeInUp.delay(500)} style={styles.rewardRow}>
            <View style={styles.rewardChip}>
              <Ionicons name="star" size={18} color={C.navy} />
              <Text style={styles.rewardTxt}>+{reward.xp} XP</Text>
            </View>
            <View style={styles.rewardChip}>
              <Ionicons name="time" size={18} color={C.navy} />
              <Text style={styles.rewardTxt}>{fmtTime(finalTimeMs || elapsedMs)}</Text>
            </View>
            <View style={styles.rewardChip}>
              <Ionicons name="swap-horizontal" size={18} color={C.navy} />
              <Text style={styles.rewardTxt}>{moves} moves</Text>
            </View>
            {reward.badge && (
              <View style={[styles.rewardChip, { backgroundColor: C.white }]}>
                <Ionicons name="ribbon" size={18} color={C.maroon} />
                <Text style={styles.rewardTxt}>New Badge!</Text>
              </View>
            )}
          </Animated.View>
          {newRecord && (
            <Animated.View entering={FadeInUp.delay(700)} style={styles.recordChip}>
              <Ionicons name="trophy" size={18} color={C.gold} />
              <Text style={styles.recordTxt}>🏆 New Personal Best!</Text>
            </Animated.View>
          )}
          {!newRecord && bestTimeMs != null && (
            <Animated.Text entering={FadeInUp.delay(700)} style={styles.bestSub}>
              Personal best: {fmtTime(bestTimeMs)}
            </Animated.Text>
          )}
          <TouchableOpacity
            style={styles.doneBtn}
            activeOpacity={0.85}
            onPress={() => router.replace("/jigsaw" as any)}
          >
            <Text style={styles.doneBtnTxt}>Back to Puzzles</Text>
            <Ionicons name="arrow-forward" size={18} color={C.navy} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: "transparent", borderColor: C.white }]}
            activeOpacity={0.85}
            onPress={reshuffle}
          >
            <Text style={[styles.doneBtnTxt, { color: C.white }]}>Play Again</Text>
            <Ionicons name="refresh" size={18} color={C.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ---------- Play screen ----------
  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: puzzle.color }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="jigsaw-back">
          <Ionicons name="arrow-back" size={24} color={C.white} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{puzzle.name}</Text>
          <View style={styles.statRow}>
            <View style={styles.statChip}>
              <Ionicons name="time-outline" size={12} color={C.white} />
              <Text style={styles.statTxt}>{fmtTime(elapsedMs)}</Text>
            </View>
            <View style={styles.statChip}>
              <Ionicons name="swap-horizontal" size={12} color={C.white} />
              <Text style={styles.statTxt}>{moves}</Text>
            </View>
            {bestTimeMs != null && (
              <View style={styles.statChip}>
                <Ionicons name="trophy-outline" size={12} color={C.gold} />
                <Text style={styles.statTxt}>{fmtTime(bestTimeMs)}</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          testID="toggle-preview"
          onPress={() => { setShowPreview(!showPreview); hapticTap(); }}
          style={styles.previewBtn}
        >
          <Ionicons name={showPreview ? "eye-off" : "eye"} size={20} color={C.white} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, alignItems: "center" }} testID="puzzle-scroll">
        <Text style={styles.tip}>
          Tap two pieces to swap them. Restore the portrait! 🧩
        </Text>

        {showPreview && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.previewBox}
          >
            <Image source={PORTRAITS[puzzle.id] || ({ uri: `${BASE}${puzzle.portrait_url}` } as any)} style={styles.previewImg} />
            <Text style={styles.previewLabel}>🎯 Goal: match this picture</Text>
          </Animated.View>
        )}

        <Animated.View
          entering={FadeIn}
          style={[
            styles.boardWrap,
            { width: boardSize, height: boardSize, padding: boardPadding, backgroundColor: puzzle.color },
          ]}
        >
          {/* Ghost preview behind the board */}
          <Image
            source={PORTRAITS[puzzle.id] || ({ uri: `${BASE}${puzzle.portrait_url}` } as any)}
            style={{
              position: "absolute",
              left: boardPadding, top: boardPadding,
              width: pieceSize * grid + (grid - 1) * 4,
              height: pieceSize * grid + (grid - 1) * 4,
              opacity: 0.18,
              borderRadius: 8,
            }}
          />
          {board.map((pieceIdx, slot) => (
            <Piece
              key={slot}
              slot={slot}
              pieceIdx={pieceIdx}
              grid={grid}
              pieceSize={pieceSize}
              selected={selected === slot}
              correct={pieceIdx === slot}
              portraitAsset={PORTRAITS[puzzle.id]} portraitUri={`${BASE}${puzzle.portrait_url}`}
              onTap={() => onTap(slot)}
            />
          ))}
        </Animated.View>

        <View style={styles.toolbar}>
          <TouchableOpacity testID="reshuffle-btn" style={styles.toolBtn} onPress={reshuffle}>
            <Ionicons name="shuffle" size={18} color={C.navy} />
            <Text style={styles.toolTxt}>Shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="preview-btn"
            style={styles.toolBtn}
            onPress={() => { setShowPreview(!showPreview); hapticTap(); }}
          >
            <Ionicons name={showPreview ? "eye-off" : "eye"} size={18} color={C.navy} />
            <Text style={styles.toolTxt}>{showPreview ? "Hide" : "Peek"} Goal</Text>
          </TouchableOpacity>
        </View>

        {/* Progress indicator */}
        <View style={styles.progressWrap}>
          <Text style={styles.progressLabel}>
            {board.filter((v, i) => v === i).length} of {grid * grid} pieces in place
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(board.filter((v, i) => v === i).length / (grid * grid)) * 100}%`,
                  backgroundColor: puzzle.color,
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>

      {/* First-time tutorial overlay */}
      {showTutorial && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.tutorialOverlay}
          pointerEvents="box-none"
        >
          <View style={styles.tutorialCard}>
            <Text style={styles.tutorialEmoji}>🧩</Text>
            <Text style={styles.tutorialTitle}>How to Play</Text>
            <View style={styles.tutorialStep}>
              <Text style={styles.tutorialNum}>1.</Text>
              <Text style={styles.tutorialTxt}>Tap a piece to <Text style={{ fontWeight: "900" }}>pick</Text> it (gold border)</Text>
            </View>
            <View style={styles.tutorialStep}>
              <Text style={styles.tutorialNum}>2.</Text>
              <Text style={styles.tutorialTxt}>Tap another to <Text style={{ fontWeight: "900" }}>swap</Text> them</Text>
            </View>
            <View style={styles.tutorialStep}>
              <Text style={styles.tutorialNum}>3.</Text>
              <Text style={styles.tutorialTxt}>Green border = piece is in the <Text style={{ fontWeight: "900" }}>right spot!</Text></Text>
            </View>
            <TouchableOpacity
              style={styles.tutorialBtn}
              onPress={() => {
                setShowTutorial(false);
                if (tutorialTimerRef.current) clearTimeout(tutorialTimerRef.current);
                AsyncStorage.setItem(TUTORIAL_KEY, "1").catch(() => {});
              }}
            >
              <Text style={styles.tutorialBtnTxt}>Got it! Let's play 🚀</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

// ---------- Piece with pulse on becoming correct ----------
function Piece({
  slot, pieceIdx, grid, pieceSize, selected, correct, portraitUri, onTap,
}: {
  slot: number; pieceIdx: number; grid: number; pieceSize: number;
  selected: boolean; correct: boolean; portraitUri: string; onTap: () => void;
}) {
  const row = Math.floor(pieceIdx / grid);
  const col = pieceIdx % grid;
  const slotRow = Math.floor(slot / grid);
  const slotCol = slot % grid;
  const left = slotCol * (pieceSize + 4);
  const top = slotRow * (pieceSize + 4);

  // Pulse when piece becomes correct
  const scale = useSharedValue(1);
  const prevCorrect = useRef(correct);
  useEffect(() => {
    if (correct && !prevCorrect.current) {
      scale.value = withSequence(
        withTiming(1.12, { duration: 140 }),
        withTiming(1, { duration: 200 }),
      );
    }
    prevCorrect.current = correct;
  }, [correct, scale]);
  // Subtle pulse for selected
  useEffect(() => {
    if (selected) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 320 }),
          withTiming(1, { duration: 320 }),
        ),
        -1,
        true,
      );
    } else if (!correct) {
      scale.value = withTiming(1, { duration: 160 });
    }
  }, [selected, correct, scale]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left, top,
          width: pieceSize, height: pieceSize,
          borderColor: selected ? C.gold : (correct ? C.green : "#FFFFFFAA"),
          borderWidth: selected ? 4 : (correct ? 3 : 1),
          shadowOpacity: selected ? 0.5 : 0.2,
          zIndex: selected ? 5 : 1,
        },
        animStyle,
      ]}
    >
      <TouchableOpacity
        testID={`piece-${slot}`}
        activeOpacity={0.85}
        onPress={onTap}
        style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: 6 }}
      >
        <Image
          source={{ uri: portraitUri }}
          style={{
            width: pieceSize * grid,
            height: pieceSize * grid,
            marginLeft: -col * pieceSize,
            marginTop: -row * pieceSize,
          }}
        />
        {correct && (
          <View style={styles.correctTick}>
            <Ionicons name="checkmark" size={14} color={C.white} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ---------- Confetti / burst emojis ----------
function ConfettiBurst({ color }: { color: string }) {
  const items = ["🎉", "✨", "⭐", "🎊", "🏆", "💫", "🎉", "✨"];
  return (
    <View pointerEvents="none" style={styles.confettiWrap}>
      {items.map((e, i) => (
        <ConfettiItem key={i} emoji={e} index={i} total={items.length} />
      ))}
      <View style={[styles.confettiGlow, { backgroundColor: color }]} />
    </View>
  );
}

function ConfettiItem({ emoji, index, total }: { emoji: string; index: number; total: number }) {
  const ty = useSharedValue(-30);
  const tx = useSharedValue(0);
  const rot = useSharedValue(0);
  const opacity = useSharedValue(0);
  useEffect(() => {
    const dx = (index - (total - 1) / 2) * 38;
    const delay = index * 70;
    opacity.value = withTiming(1, { duration: 80 });
    tx.value = withTiming(dx, { duration: 1200 });
    ty.value = withTiming(360 + (index % 3) * 30, { duration: 1600 });
    rot.value = withTiming(540, { duration: 1600 });
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 400 });
    }, 1300 + delay);
  }, [opacity, tx, ty, rot, index, total]);
  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${rot.value}deg` },
    ],
  }));
  return (
    <Animated.Text style={[styles.confettiEmoji, animStyle]}>{emoji}</Animated.Text>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  header: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 2, borderBottomColor: C.navy,
  },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: "900", color: C.white },
  statRow: { flexDirection: "row", gap: 6, marginTop: 4, flexWrap: "wrap" },
  statChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#00000033", paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999,
  },
  statTxt: { color: C.white, fontWeight: "900", fontSize: 11 },
  previewBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#FFFFFF22", justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: C.white,
  },
  tip: {
    color: C.navy, fontWeight: "700", fontSize: 13,
    textAlign: "center", marginBottom: 14,
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: C.white, borderRadius: 14, borderWidth: 1.5, borderColor: C.navy,
  },
  previewBox: { alignItems: "center", marginBottom: 12 },
  previewImg: {
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 3, borderColor: C.gold,
  },
  previewLabel: { fontSize: 12, fontWeight: "900", color: C.navy, marginTop: 6 },
  boardWrap: {
    position: "relative",
    borderRadius: 18,
    borderWidth: 3, borderColor: C.navy,
    ...SHADOW,
  },
  piece: {
    position: "absolute",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    backgroundColor: "#0002",
  },
  correctTick: {
    position: "absolute", right: 4, top: 4,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: C.green, justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: C.white,
  },
  toolbar: { flexDirection: "row", gap: 12, marginTop: 16 },
  toolBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: C.white, borderRadius: 999,
    borderWidth: 2, borderColor: C.navy,
  },
  toolTxt: { fontWeight: "900", color: C.navy, fontSize: 13 },
  progressWrap: { width: "100%", maxWidth: 360, marginTop: 16 },
  progressLabel: { fontSize: 12, fontWeight: "800", color: C.navy, textAlign: "center", marginBottom: 6 },
  progressBar: {
    height: 10, backgroundColor: "#0002", borderRadius: 5,
    overflow: "hidden", borderWidth: 1.5, borderColor: C.navy,
  },
  progressFill: { height: "100%", borderRadius: 4 },
  // Celebration
  celebrateBox: { flex: 1, padding: 24, justifyContent: "center", alignItems: "center" },
  celebrateImg: {
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 4, borderColor: C.gold,
  },
  celTitle: { fontSize: 30, fontWeight: "900", color: C.white, marginTop: 18, textAlign: "center" },
  celSub: { fontSize: 16, fontWeight: "700", color: "#FFFFFFDD", marginTop: 6, textAlign: "center" },
  rewardRow: { flexDirection: "row", gap: 8, marginTop: 22, flexWrap: "wrap", justifyContent: "center" },
  rewardChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.gold, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy,
  },
  rewardTxt: { color: C.navy, fontWeight: "900", fontSize: 13 },
  recordChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.navy, paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 999, borderWidth: 2, borderColor: C.gold, marginTop: 14,
  },
  recordTxt: { color: C.gold, fontWeight: "900", fontSize: 13 },
  bestSub: { color: "#FFFFFFCC", fontWeight: "700", fontSize: 12, marginTop: 12 },
  doneBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: C.white, paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, marginTop: 18,
  },
  doneBtnTxt: { color: C.navy, fontWeight: "900", fontSize: 14 },
  // Confetti
  confettiWrap: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center", justifyContent: "flex-start", paddingTop: 80,
    zIndex: 10,
  },
  confettiEmoji: { position: "absolute", fontSize: 28 },
  confettiGlow: {
    position: "absolute", top: 100, width: 200, height: 200, borderRadius: 100,
    opacity: 0.25,
  },
  // Tutorial overlay
  tutorialOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "#0007",
    justifyContent: "center", alignItems: "center",
    padding: 24, zIndex: 100,
  },
  tutorialCard: {
    backgroundColor: C.white, padding: 24, borderRadius: 24,
    borderWidth: 3, borderColor: C.navy, alignItems: "center",
    maxWidth: 340, width: "100%", ...SHADOW,
  },
  tutorialEmoji: { fontSize: 44, marginBottom: 6 },
  tutorialTitle: { fontSize: 22, fontWeight: "900", color: C.navy, marginBottom: 14 },
  tutorialStep: { flexDirection: "row", gap: 8, alignSelf: "stretch", marginBottom: 10 },
  tutorialNum: { fontSize: 16, fontWeight: "900", color: C.saffron, width: 22 },
  tutorialTxt: { fontSize: 14, color: C.navy, flex: 1, lineHeight: 20 },
  tutorialBtn: {
    backgroundColor: C.saffron, paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, marginTop: 12,
  },
  tutorialBtnTxt: { color: C.white, fontWeight: "900", fontSize: 14 },
});
