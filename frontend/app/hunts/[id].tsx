import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp, ZoomIn } from "react-native-reanimated";
import { API, getStoredUser } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

type Hero = { id: string; name: string; color: string; era?: string; tagline_en?: string; tagline_hi?: string };
type Clue = {
  id: string; clue_en: string; clue_hi: string;
  options: Hero[]; hint_en: string; hint_hi: string;
};
type Hunt = {
  id: string; title_en: string; title_hi: string; tagline_en: string; tagline_hi: string;
  icon: string; color: string; badge_id: string; xp_reward: number;
  clues: Clue[]; solved_clues: string[]; completed: boolean;
};

export default function HuntDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [hunt, setHunt] = useState<Hunt | null>(null);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [tappedId, setTappedId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [celebration, setCelebration] = useState<{ xp: number; badge?: string } | null>(null);

  const load = async () => {
    try {
      const u = await getStoredUser();
      if (u?.language) setLang(u.language);
      const r = await API.get(`/hunts/${id}`);
      setHunt(r.data);
      // Resume at first un-solved clue
      const solved = new Set(r.data.solved_clues || []);
      const startIdx = r.data.clues.findIndex((c: Clue) => !solved.has(c.id));
      setIdx(startIdx === -1 ? 0 : startIdx);
    } catch (e: any) {
      // (offline: no auth)
}
  };
  useEffect(() => { load(); }, [id]);

  if (!hunt) {
    return (
      <SafeAreaView style={[styles.c, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={C.saffron} />
      </SafeAreaView>
    );
  }

  const total = hunt.clues.length;
  const clue = hunt.clues[idx];
  const solvedSet = new Set(hunt.solved_clues);
  const solvedCount = hunt.clues.filter((c) => solvedSet.has(c.id)).length;

  const onTap = async (heroId: string) => {
    if (submitting || feedback) return;
    setTappedId(heroId);
    setSubmitting(true);
    try {
      const r = await API.post(`/hunts/${hunt.id}/answer`, { clue_id: clue.id, answer_id: heroId });
      if (r.data.correct) {
        setFeedback("correct");
        setTimeout(() => {
          setFeedback(null); setTappedId(null); setShowHint(false);
          setHunt({ ...hunt, solved_clues: r.data.solved_clues, completed: r.data.completed });
          if (r.data.just_completed) {
            setCelebration({ xp: r.data.xp_awarded, badge: r.data.badge_awarded });
          } else if (idx + 1 < total) {
            setIdx(idx + 1);
          }
        }, 1100);
      } else {
        setFeedback("wrong");
        setTimeout(() => { setFeedback(null); setTappedId(null); }, 900);
      }
    } catch (e: any) {
      Alert.alert("Oops", e?.response?.data?.detail || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (celebration) {
    return (
      <SafeAreaView style={[styles.c, { backgroundColor: hunt.color }]} edges={["top", "bottom"]}>
        <View style={styles.celebrateBox}>
          <Animated.View entering={ZoomIn.duration(450)}>
            <View style={[styles.bigBadge, { backgroundColor: C.gold }]}>
              <Ionicons name="trophy" size={64} color={C.navy} />
            </View>
          </Animated.View>
          <Animated.Text entering={FadeInUp.delay(200)} style={styles.celebrateTitle}>
            Hunt Solved! 🎉
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(350)} style={styles.celebrateSub}>
            {lang === "hi" ? hunt.title_hi : hunt.title_en}
          </Animated.Text>
          <Animated.View entering={FadeInUp.delay(500)} style={styles.rewardRow}>
            <View style={styles.rewardChip}>
              <Ionicons name="star" size={18} color={C.navy} />
              <Text style={styles.rewardChipTxt}>+{celebration.xp} XP</Text>
            </View>
            {celebration.badge && (
              <View style={[styles.rewardChip, { backgroundColor: C.white }]}>
                <Ionicons name="ribbon" size={18} color={C.maroon} />
                <Text style={styles.rewardChipTxt}>New Badge!</Text>
              </View>
            )}
          </Animated.View>
          <TouchableOpacity
            testID="hunt-done-btn"
            style={styles.doneBtn}
            activeOpacity={0.85}
            onPress={() => router.replace("/hunts")}
          >
            <Text style={styles.doneBtnTxt}>Back to Hunts</Text>
            <Ionicons name="arrow-forward" size={18} color={C.navy} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: hunt.color }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="hunt-back">
          <Ionicons name="arrow-back" size={24} color={C.white} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {lang === "hi" ? hunt.title_hi : hunt.title_en}
          </Text>
          <Text style={styles.headerSub}>
            Clue {idx + 1} of {total} • {solvedCount} solved
          </Text>
        </View>
        <View style={styles.huntIconWrap}>
          <Ionicons name={hunt.icon as any} size={22} color={hunt.color} />
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((idx) / total) * 100}%`, backgroundColor: hunt.color }]} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }} testID="hunt-scroll">
        <Animated.View entering={FadeIn} key={clue.id} style={[styles.clueCard, { borderColor: hunt.color }]}>
          <View style={[styles.clueHeader, { backgroundColor: hunt.color }]}>
            <Ionicons name="search" size={18} color={C.white} />
            <Text style={styles.clueHeaderTxt}>WHO AM I?</Text>
          </View>
          <Text style={styles.clueText}>
            {lang === "hi" ? clue.clue_hi : clue.clue_en}
          </Text>
          {showHint && (
            <View style={styles.hintBox}>
              <Ionicons name="bulb" size={16} color={C.saffron} />
              <Text style={styles.hintTxt}>{lang === "hi" ? clue.hint_hi : clue.hint_en}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.hintBtn}
            onPress={() => setShowHint(!showHint)}
            testID="hunt-hint-btn"
          >
            <Ionicons name={showHint ? "eye-off" : "bulb-outline"} size={14} color={C.saffron} />
            <Text style={styles.hintBtnTxt}>{showHint ? "Hide hint" : "Need a hint?"}</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.heroesLabel}>Tap the right hero 👇</Text>
        <View style={styles.heroGrid}>
          {clue.options.map((hero, i) => {
            const isTapped = tappedId === hero.id;
            const isCorrect = feedback === "correct" && isTapped;
            const isWrong = feedback === "wrong" && isTapped;
            return (
              <Animated.View entering={FadeInUp.delay(i * 80)} key={hero.id} style={styles.heroWrap}>
                <TouchableOpacity
                  testID={`hunt-hero-${hero.id}`}
                  activeOpacity={0.85}
                  disabled={!!feedback || submitting}
                  onPress={() => onTap(hero.id)}
                  style={[
                    styles.heroCard,
                    { backgroundColor: hero.color },
                    isCorrect && { borderColor: C.green, borderWidth: 4 },
                    isWrong && { borderColor: C.red, borderWidth: 4, opacity: 0.8 },
                  ]}
                >
                  <View style={styles.heroAvatar}>
                    <Text style={styles.heroInitials}>
                      {hero.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </Text>
                  </View>
                  <Text style={styles.heroName} numberOfLines={2}>{hero.name}</Text>
                  {hero.era ? <Text style={styles.heroEra} numberOfLines={1}>{hero.era}</Text> : null}
                  {isCorrect && (
                    <View style={styles.checkOverlay}>
                      <Ionicons name="checkmark-circle" size={56} color={C.green} />
                    </View>
                  )}
                  {isWrong && (
                    <View style={styles.checkOverlay}>
                      <Ionicons name="close-circle" size={56} color={C.red} />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {feedback === "wrong" && (
          <Animated.View entering={FadeIn} style={styles.wrongPill}>
            <Ionicons name="refresh" size={16} color={C.red} />
            <Text style={styles.wrongTxt}>Hmm, not quite. Try again!</Text>
          </Animated.View>
        )}
        {feedback === "correct" && (
          <Animated.View entering={FadeIn} style={styles.rightPill}>
            <Ionicons name="checkmark-circle" size={18} color={C.green} />
            <Text style={styles.rightTxt}>Correct! +5 XP 🇮🇳</Text>
          </Animated.View>
        )}
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
  huntIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: C.white,
    justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: C.navy,
  },
  progressBar: { height: 6, backgroundColor: "#0001" },
  progressFill: { height: "100%" },
  clueCard: {
    backgroundColor: C.white, borderRadius: 24, borderWidth: 2,
    overflow: "hidden", marginBottom: 18, ...SHADOW,
  },
  clueHeader: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  clueHeaderTxt: { color: C.white, fontWeight: "900", letterSpacing: 1, fontSize: 12 },
  clueText: { fontSize: 16, lineHeight: 24, color: C.text, fontWeight: "600", padding: 18, paddingBottom: 6 },
  hintBox: {
    flexDirection: "row", gap: 8, alignItems: "flex-start",
    backgroundColor: "#FFF8E1", padding: 12, marginHorizontal: 12, borderRadius: 14,
    borderWidth: 1, borderColor: C.gold, marginTop: 6,
  },
  hintTxt: { flex: 1, fontSize: 13, color: C.text, fontWeight: "600", lineHeight: 18 },
  hintBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 12,
  },
  hintBtnTxt: { fontSize: 12, color: C.saffron, fontWeight: "900" },
  heroesLabel: { fontSize: 14, fontWeight: "900", color: C.navy, marginBottom: 10 },
  heroGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  heroWrap: { width: "47%" },
  heroCard: {
    borderRadius: 20, padding: 14, borderWidth: 2, borderColor: C.navy,
    alignItems: "center", minHeight: 150, ...SHADOW,
  },
  heroAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: C.white, justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: C.navy, marginBottom: 8,
  },
  heroInitials: { fontSize: 22, fontWeight: "900", color: C.navy },
  heroName: { color: C.white, fontWeight: "900", textAlign: "center", fontSize: 13 },
  heroEra: { color: "#FFFFFFCC", fontSize: 11, fontWeight: "700", marginTop: 2 },
  checkOverlay: {
    position: "absolute", inset: 0, justifyContent: "center", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.4)", borderRadius: 18,
  },
  wrongPill: {
    flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "center",
    backgroundColor: "#FFE5E5", paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 999, borderWidth: 2, borderColor: C.red, marginTop: 16,
  },
  wrongTxt: { color: C.red, fontWeight: "900", fontSize: 13 },
  rightPill: {
    flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "center",
    backgroundColor: "#E8F8E8", paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 999, borderWidth: 2, borderColor: C.green, marginTop: 16,
  },
  rightTxt: { color: C.green, fontWeight: "900", fontSize: 13 },
  // Celebration
  celebrateBox: { flex: 1, padding: 24, justifyContent: "center", alignItems: "center" },
  bigBadge: {
    width: 140, height: 140, borderRadius: 70,
    justifyContent: "center", alignItems: "center",
    borderWidth: 4, borderColor: C.navy, marginBottom: 28, ...SHADOW,
  },
  celebrateTitle: { fontSize: 32, fontWeight: "900", color: C.white, textAlign: "center" },
  celebrateSub: { fontSize: 16, fontWeight: "700", color: "#FFFFFFDD", marginTop: 8, textAlign: "center" },
  rewardRow: { flexDirection: "row", gap: 12, marginTop: 28 },
  rewardChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.gold, paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy,
  },
  rewardChipTxt: { color: C.navy, fontWeight: "900", fontSize: 14 },
  doneBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: C.white, paddingHorizontal: 22, paddingVertical: 14,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, marginTop: 32,
  },
  doneBtnTxt: { color: C.navy, fontWeight: "900", fontSize: 15 },
});
