import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API } from "../../src/api";
import { C, FF, SHADOW } from "../../src/theme";

const MAX_QUESTIONS = 4;

type Question = {
  q_en: string; q_hi: string;
  options_en: string[]; options_hi: string[];
  answer: number;
};

export default function Quiz() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [storyName, setStoryName] = useState("");
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number; percent: number; xp_awarded: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // q.data is { story_id, questions: [...] } — must access .questions
        const [q, s, me] = await Promise.all([
          API.get(`/stories/${id}/quiz`),
          API.get(`/stories/${id}`),
          API.get("/me"),
        ]);
        const rawQs: Question[] = (q.data as any).questions || [];
        setQuestions(rawQs.slice(0, MAX_QUESTIONS));
        setStoryName((s.data as any)?.name || "");
        setLang(((me.data as any)?.language) || "en");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onPick = (i: number) => {
    if (revealed) return;
    setPicked(i);
    setRevealed(true);
  };

  const next = () => {
    if (picked === null) return;
    const newAns = [...answers, picked];
    setAnswers(newAns);

    if (idx + 1 >= questions.length) {
      // Compute result entirely locally — no network needed
      let score = 0;
      questions.forEach((q, i) => {
        if (Number(newAns[i]) === Number(q.answer)) score += 1;
      });
      const total = questions.length;
      setResult({
        correct: score,
        total,
        percent: Math.round((score / total) * 100),
        xp_awarded: score * 5,
      });
      // Persist to local store in background (fire-and-forget)
      API.post(`/quizzes/${id}/submit`, { answers: newAns }).catch(() => {});
    } else {
      setIdx(idx + 1);
      setPicked(null);
      setRevealed(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.c, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator color={C.saffron} size="large" />
      </View>
    );
  }

  // ── No questions fallback ─────────────────────────────────────────────────
  if (!questions.length) {
    return (
      <SafeAreaView style={[styles.c, { alignItems: "center", justifyContent: "center", padding: 24 }]} edges={["top"]}>
        <Text style={{ fontSize: 40 }}>📚</Text>
        <Text style={{ fontSize: 18, fontWeight: "900", color: C.navy, marginTop: 12, textAlign: "center" }}>
          Quiz not available yet for this hero
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 18, backgroundColor: C.saffron, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 999, borderWidth: 2, borderColor: C.navy }}
        >
          <Text style={{ color: C.white, fontWeight: "900", fontSize: 15 }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Results screen ────────────────────────────────────────────────────────
  if (result) {
    const great = result.percent >= 75;
    return (
      <SafeAreaView style={styles.c} edges={["top", "bottom"]}>
        <View style={styles.resultBox} testID="quiz-result">
          <Text style={{ fontSize: 64 }}>{great ? "🏆" : "🌟"}</Text>
          <Text style={styles.resultTitle}>{great ? "Brilliant!" : "Good Try!"}</Text>
          <Text style={styles.resultScore}>
            {result.correct} / {result.total} correct
          </Text>
          <View style={styles.percentBig}>
            <Text style={styles.percentBigTxt}>{result.percent}%</Text>
          </View>
          <Text style={styles.resultXp}>+{result.xp_awarded} XP earned 🎉</Text>
          <TouchableOpacity
            testID="back-home"
            style={styles.homeBtn}
            onPress={() => router.replace("/(tabs)" as any)}
          >
            <Text style={styles.homeBtnTxt}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="more-stories"
            style={[styles.homeBtn, { backgroundColor: C.gold, marginTop: 10 }]}
            onPress={() => router.replace("/(tabs)/library" as any)}
          >
            <Text style={[styles.homeBtnTxt, { color: C.navy }]}>Read More Stories</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Active question ───────────────────────────────────────────────────────
  const q = questions[idx];
  const opts: string[] = (lang === "hi" ? q.options_hi : q.options_en);
  const qText = lang === "hi" ? q.q_hi : q.q_en;
  const correctIdx = Number(q.answer);

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <View style={styles.topBar}>
        <TouchableOpacity testID="quiz-back" onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={C.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{storyName} Quiz</Text>
        <View style={{ width: 42 }} />
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${((idx + 1) / questions.length) * 100}%` }]} />
        </View>
        <Text style={styles.progressTxt}>
          Question {idx + 1} of {questions.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
        <View style={styles.qCard}>
          <Text style={styles.qText} testID="quiz-question">{qText}</Text>
        </View>

        {opts.map((o, i) => {
          const isChosen = picked === i;
          const isCorrect = revealed && i === correctIdx;
          const isWrong = revealed && isChosen && i !== correctIdx;

          return (
            <TouchableOpacity
              key={i}
              testID={`opt-${i}`}
              activeOpacity={revealed ? 1 : 0.8}
              onPress={() => onPick(i)}
              disabled={revealed}
              style={[
                styles.opt,
                isCorrect && styles.optCorrect,
                isWrong && styles.optWrong,
                isChosen && !revealed && styles.optActive,
              ]}
            >
              <View style={[
                styles.optBullet,
                isCorrect && styles.optBulletCorrect,
                isWrong && styles.optBulletWrong,
                isChosen && !revealed && styles.optBulletActive,
              ]}>
                <Text style={[
                  styles.optBulletTxt,
                  (isCorrect || isWrong || isChosen) && { color: C.white },
                ]}>
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text style={[
                styles.optTxt,
                (isCorrect || isWrong) && { color: C.white, fontWeight: "900" },
              ]}>
                {o}
              </Text>
              {isCorrect && <Ionicons name="checkmark-circle" size={22} color={C.white} />}
              {isWrong && <Ionicons name="close-circle" size={22} color={C.white} />}
            </TouchableOpacity>
          );
        })}

        {revealed && (
          <TouchableOpacity
            testID="quiz-next"
            style={styles.nextBtn}
            onPress={next}
          >
            <Text style={styles.nextTxt}>
              {idx + 1 >= questions.length ? "See Results 🎯" : "Next Question →"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  topBar: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 8,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: C.white,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontFamily: FF.heading, color: C.navy, flex: 1, textAlign: "center" },
  progressWrap: { paddingHorizontal: 18, marginBottom: 8 },
  progressBg: {
    height: 14, backgroundColor: C.white, borderRadius: 999,
    borderWidth: 2, borderColor: C.navy, overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: C.saffron },
  progressTxt: { fontSize: 12, color: C.textMuted, fontWeight: "800", marginTop: 6, textAlign: "center" },
  qCard: {
    backgroundColor: C.navy, borderRadius: 24, padding: 22, marginBottom: 18,
    borderWidth: 2, borderColor: C.navy, ...SHADOW,
  },
  qText: { fontSize: 19, fontFamily: FF.bodyBold, color: C.white, lineHeight: 26 },
  opt: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: C.white, padding: 14, borderRadius: 18,
    borderWidth: 2, borderColor: C.navy, marginBottom: 10, ...SHADOW,
  },
  optActive: { backgroundColor: C.saffron },
  optCorrect: { backgroundColor: "#22C55E", borderColor: "#15803D" },
  optWrong: { backgroundColor: "#EF4444", borderColor: "#B91C1C" },
  optBullet: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: C.cream,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", justifyContent: "center",
  },
  optBulletActive: { backgroundColor: C.navy },
  optBulletCorrect: { backgroundColor: "#15803D", borderColor: "#14532D" },
  optBulletWrong: { backgroundColor: "#B91C1C", borderColor: "#7F1D1D" },
  optBulletTxt: { fontWeight: "900", color: C.navy, fontSize: 14 },
  optTxt: { flex: 1, fontSize: 15, fontWeight: "700", color: C.navy },
  nextBtn: {
    backgroundColor: C.green, padding: 18, borderRadius: 999, alignItems: "center",
    borderWidth: 2, borderColor: C.navy, marginTop: 14, ...SHADOW,
  },
  nextTxt: { color: C.white, fontFamily: FF.heading, fontSize: 16 },
  resultBox: {
    flex: 1, alignItems: "center", justifyContent: "center", padding: 28,
  },
  resultTitle: { fontSize: 36, fontFamily: FF.heading, color: C.navy, marginTop: 8 },
  resultScore: { fontSize: 18, color: C.textSecondary, fontFamily: FF.bodyBold, marginTop: 4 },
  percentBig: {
    backgroundColor: C.gold, paddingHorizontal: 30, paddingVertical: 16,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, marginTop: 16, ...SHADOW,
  },
  percentBigTxt: { fontSize: 36, fontFamily: FF.heading, color: C.navy },
  resultXp: { fontSize: 16, fontFamily: FF.bodyBold, color: C.green, marginTop: 14 },
  homeBtn: {
    marginTop: 22, backgroundColor: C.saffron, paddingHorizontal: 28, paddingVertical: 14,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, ...SHADOW,
    alignSelf: "stretch", alignItems: "center",
  },
  homeBtnTxt: { color: C.white, fontFamily: FF.heading, fontSize: 16 },
});
