import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API } from "../../src/api";
import { C, FF, SHADOW } from "../../src/theme";

export default function Quiz() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [story, setStory] = useState<any>(null);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [q, s, me] = await Promise.all([
          API.get(`/stories/${id}/quiz`),
          API.get(`/stories/${id}`),
          API.get("/me"),
        ]);
        setQuestions(q.data);
        setStory(s.data);
        setLang((me.data.language as any) || "en");
      } finally { setLoading(false); }
    })();
  }, [id]);

  const submitNow = async (allAnswers: number[]) => {
    try {
      const { data } = await API.post(`/quizzes/${id}/submit`, { answers: allAnswers });
      setResult(data);
    } catch {}
  };

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
  };

  const next = () => {
    if (picked === null) return;
    const newAns = [...answers, picked];
    setAnswers(newAns);
    setPicked(null);
    if (idx + 1 >= questions.length) {
      submitNow(newAns);
    } else {
      setIdx(idx + 1);
    }
  };

  if (loading || !questions.length) {
    return (
      <View style={[styles.c, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator color={C.saffron} size="large" />
      </View>
    );
  }

  if (result) {
    const great = result.percent >= 80;
    return (
      <SafeAreaView style={styles.c} edges={["top", "bottom"]}>
        <View style={styles.resultBox} testID="quiz-result">
          <Text style={{ fontSize: 60 }}>{great ? "🏆" : "🌟"}</Text>
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
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.homeBtnTxt}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="more-stories"
            style={[styles.homeBtn, { backgroundColor: C.gold, marginTop: 10 }]}
            onPress={() => router.replace("/(tabs)/library")}
          >
            <Text style={[styles.homeBtnTxt, { color: C.navy }]}>Read More Stories</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const q = questions[idx];
  const opts = lang === "hi" ? q.options_hi : q.options_en;
  const qText = lang === "hi" ? q.q_hi : q.q_en;

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <View style={styles.topBar}>
        <TouchableOpacity testID="quiz-back" onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={C.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{story?.name} Quiz</Text>
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

        {opts.map((o: string, i: number) => {
          const active = picked === i;
          return (
            <TouchableOpacity
              key={i}
              testID={`opt-${i}`}
              activeOpacity={0.85}
              onPress={() => onPick(i)}
              style={[styles.opt, active && styles.optActive]}
            >
              <View style={[styles.optBullet, active && styles.optBulletActive]}>
                <Text style={[styles.optBulletTxt, active && { color: C.white }]}>
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text style={[styles.optTxt, active && { color: C.white }]}>{o}</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          testID="quiz-next"
          style={[styles.nextBtn, picked === null && { opacity: 0.4 }]}
          onPress={next}
          disabled={picked === null}
        >
          <Text style={styles.nextTxt}>
            {idx + 1 >= questions.length ? "Finish Quiz 🎯" : "Next →"}
          </Text>
        </TouchableOpacity>
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
  headerTitle: { fontSize: 16, fontFamily: FF.heading, color: C.navy },
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
  optBullet: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: C.cream,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", justifyContent: "center",
  },
  optBulletActive: { backgroundColor: C.navy },
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
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, ...SHADOW, alignSelf: "stretch", alignItems: "center",
  },
  homeBtnTxt: { color: C.white, fontFamily: FF.heading, fontSize: 16 },
});
