import { useEffect, useMemo, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator,
  Dimensions, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp, ZoomIn } from "react-native-reanimated";
import { API } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;
const { width: SW } = Dimensions.get("window");

type Puzzle = {
  id: string; name: string; title_en: string; title_hi: string;
  color: string; era: string; grid: number; xp_reward: number;
  portrait_url: string; solved: boolean;
};

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
  const arr = Array.from({ length: n }, (_, i) => (i + 1) % n);
  return arr;
}

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
      } catch (e: any) {
        if (e?.response?.status === 401) router.replace("/auth");
      }
    })();
  }, [id]);

  const grid = puzzle?.grid || 3;
  const total = grid * grid;
  const boardPadding = 16;
  const containerWidth = Math.min(SW - 36, 360);
  const pieceSize = Math.floor((containerWidth - boardPadding * 2 - (grid - 1) * 4) / grid);
  const boardSize = pieceSize * grid + boardPadding * 2 + (grid - 1) * 4;

  const onTap = (slotIndex: number) => {
    if (completed) return;
    if (selected === null) {
      setSelected(slotIndex);
      return;
    }
    if (selected === slotIndex) {
      setSelected(null);
      return;
    }
    // Swap pieces between selected and slotIndex
    const next = [...board];
    [next[selected], next[slotIndex]] = [next[slotIndex], next[selected]];
    setBoard(next);
    setMoves((m) => m + 1);
    setSelected(null);
    // Check completion
    if (next.every((v, i) => v === i)) {
      setCompleted(true);
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
  };

  if (!puzzle) {
    return (
      <SafeAreaView style={[styles.c, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={C.saffron} />
      </SafeAreaView>
    );
  }

  if (reward && completed) {
    return (
      <SafeAreaView style={[styles.c, { backgroundColor: puzzle.color }]} edges={["top", "bottom"]}>
        <View style={styles.celebrateBox}>
          <Animated.View entering={ZoomIn.duration(450)}>
            <Image source={{ uri: `${BASE}${puzzle.portrait_url}` }} style={styles.celebrateImg} />
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
              <Ionicons name="trophy" size={18} color={C.navy} />
              <Text style={styles.rewardTxt}>{moves} moves</Text>
            </View>
            {reward.badge && (
              <View style={[styles.rewardChip, { backgroundColor: C.white }]}>
                <Ionicons name="ribbon" size={18} color={C.maroon} />
                <Text style={styles.rewardTxt}>New Badge!</Text>
              </View>
            )}
          </Animated.View>
          <TouchableOpacity
            style={styles.doneBtn}
            activeOpacity={0.85}
            onPress={() => router.replace("/jigsaw")}
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

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: puzzle.color }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="jigsaw-back">
          <Ionicons name="arrow-back" size={24} color={C.white} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{puzzle.name}</Text>
          <Text style={styles.headerSub}>Moves: {moves}</Text>
        </View>
        <TouchableOpacity
          testID="toggle-preview"
          onPress={() => setShowPreview(!showPreview)}
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
          <View style={styles.previewBox}>
            <Image source={{ uri: `${BASE}${puzzle.portrait_url}` }} style={styles.previewImg} />
            <Text style={styles.previewLabel}>Goal: match this picture</Text>
          </View>
        )}

        <Animated.View
          entering={FadeIn}
          style={[
            styles.boardWrap,
            { width: boardSize, height: boardSize, padding: boardPadding, backgroundColor: puzzle.color },
          ]}
        >
          {/* Ghost preview behind board */}
          <Image
            source={{ uri: `${BASE}${puzzle.portrait_url}` }}
            style={{
              position: "absolute",
              left: boardPadding, top: boardPadding,
              width: pieceSize * grid + (grid - 1) * 4,
              height: pieceSize * grid + (grid - 1) * 4,
              opacity: 0.18,
              borderRadius: 8,
            }}
          />
          {board.map((pieceIdx, slot) => {
            const row = Math.floor(pieceIdx / grid);
            const col = pieceIdx % grid;
            const slotRow = Math.floor(slot / grid);
            const slotCol = slot % grid;
            const left = slotCol * (pieceSize + 4);
            const top = slotRow * (pieceSize + 4);
            const isSelected = selected === slot;
            const isCorrect = pieceIdx === slot;
            return (
              <TouchableOpacity
                key={slot}
                testID={`piece-${slot}`}
                activeOpacity={0.85}
                onPress={() => onTap(slot)}
                style={[
                  styles.piece,
                  {
                    left, top,
                    width: pieceSize, height: pieceSize,
                    borderColor: isSelected ? C.gold : (isCorrect ? C.green : "#FFFFFFAA"),
                    borderWidth: isSelected ? 4 : (isCorrect ? 3 : 1),
                    shadowOpacity: isSelected ? 0.5 : 0.2,
                  },
                ]}
              >
                <Image
                  source={{ uri: `${BASE}${puzzle.portrait_url}` }}
                  style={{
                    width: pieceSize * grid,
                    height: pieceSize * grid,
                    marginLeft: -col * pieceSize,
                    marginTop: -row * pieceSize,
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        <View style={styles.toolbar}>
          <TouchableOpacity testID="reshuffle-btn" style={styles.toolBtn} onPress={reshuffle}>
            <Ionicons name="shuffle" size={18} color={C.navy} />
            <Text style={styles.toolTxt}>Shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="preview-btn"
            style={styles.toolBtn}
            onPress={() => setShowPreview(!showPreview)}
          >
            <Ionicons name={showPreview ? "eye-off" : "eye"} size={18} color={C.navy} />
            <Text style={styles.toolTxt}>{showPreview ? "Hide" : "Show"} Preview</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  headerSub: { fontSize: 12, color: "#FFFFFFDD", fontWeight: "700", marginTop: 2 },
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
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 3, borderColor: C.gold,
  },
  previewLabel: { fontSize: 11, fontWeight: "800", color: C.navy, marginTop: 4 },
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
  },
  toolbar: { flexDirection: "row", gap: 12, marginTop: 16 },
  toolBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: C.white, borderRadius: 999,
    borderWidth: 2, borderColor: C.navy,
  },
  toolTxt: { fontWeight: "900", color: C.navy, fontSize: 13 },
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
  doneBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: C.white, paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, marginTop: 18,
  },
  doneBtnTxt: { color: C.navy, fontWeight: "900", fontSize: 14 },
});
