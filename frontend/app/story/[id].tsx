import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { API } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

export default function StoryReader() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [story, setStory] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [speaking, setSpeaking] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [s, me] = await Promise.all([API.get(`/stories/${id}`), API.get("/me")]);
        setStory(s.data);
        setUser(me.data);
        setLang((me.data.language as any) || "en");
      } catch {}
    })();
    return () => { Speech.stop(); };
  }, [id]);

  const toggleSpeak = () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      return;
    }
    const text = lang === "hi" ? story.story_hi : story.story_en;
    setSpeaking(true);
    Speech.speak(text, {
      language: lang === "hi" ? "hi-IN" : "en-IN",
      rate: 0.9,
      pitch: 1.0,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const finishStory = async () => {
    try {
      Speech.stop();
      await API.post("/stories/complete", { story_id: id });
      setCompleted(true);
    } catch {}
  };

  if (!story) {
    return (
      <View style={[styles.c, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator color={C.saffron} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <View style={styles.topBar}>
        <TouchableOpacity testID="back-btn" onPress={() => { Speech.stop(); router.back(); }} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={C.navy} />
        </TouchableOpacity>
        <View style={styles.langSwitch}>
          <TouchableOpacity
            testID="story-lang-en"
            style={[styles.langBtn, lang === "en" && styles.langActive]}
            onPress={() => { Speech.stop(); setSpeaking(false); setLang("en"); }}
          >
            <Text style={[styles.langTxt, lang === "en" && { color: C.white }]}>EN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="story-lang-hi"
            style={[styles.langBtn, lang === "hi" && styles.langActive]}
            onPress={() => { Speech.stop(); setSpeaking(false); setLang("hi"); }}
          >
            <Text style={[styles.langTxt, lang === "hi" && { color: C.white }]}>हिं</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }} testID="story-scroll">
        <View style={[styles.heroBlock, { backgroundColor: story.color }]}>
          <Text style={styles.heroEra}>{story.era}</Text>
          <Text style={styles.heroName}>{story.name}</Text>
          <Text style={styles.heroTitle}>{lang === "hi" ? story.title_hi : story.title_en}</Text>

          <TouchableOpacity testID="tts-btn" style={styles.ttsBtn} onPress={toggleSpeak}>
            <Ionicons name={speaking ? "stop" : "play"} size={20} color={C.navy} />
            <Text style={styles.ttsTxt}>{speaking ? "Stop Reading" : "Listen Aloud"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.body} testID="story-body">
          {lang === "hi" ? story.story_hi : story.story_en}
        </Text>

        {!completed ? (
          <TouchableOpacity testID="finish-btn" style={styles.finishBtn} onPress={finishStory}>
            <Ionicons name="checkmark-circle" size={22} color={C.white} />
            <Text style={styles.finishTxt}>I Finished Reading! +20 XP</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.celebrate} testID="celebrate-box">
            <Text style={{ fontSize: 44 }}>🎉</Text>
            <Text style={styles.celTitle}>Wonderful!</Text>
            <Text style={styles.celSub}>You earned 20 XP. Now test your memory!</Text>
            <TouchableOpacity
              testID="quiz-cta"
              style={styles.quizCta}
              onPress={() => router.replace(`/quiz/${id}` as any)}
            >
              <Text style={styles.quizCtaTxt}>Take the Quiz 🎯</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  topBar: {
    flexDirection: "row", justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 8,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: C.white,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", justifyContent: "center",
  },
  langSwitch: {
    flexDirection: "row", borderRadius: 999, borderWidth: 2, borderColor: C.navy,
    backgroundColor: C.white, overflow: "hidden",
  },
  langBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  langActive: { backgroundColor: C.saffron },
  langTxt: { fontWeight: "900", color: C.navy, fontSize: 13 },
  heroBlock: {
    borderRadius: 24, padding: 22, borderWidth: 2, borderColor: C.navy,
    ...SHADOW, marginBottom: 18,
  },
  heroEra: { color: C.gold, fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  heroName: { color: C.gold, fontSize: 14, fontWeight: "900", letterSpacing: 1, marginTop: 4 },
  heroTitle: { color: C.white, fontSize: 24, fontWeight: "900", lineHeight: 30, marginTop: 6 },
  ttsBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: C.gold, paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 999, marginTop: 16, alignSelf: "flex-start",
    borderWidth: 2, borderColor: C.navy,
  },
  ttsTxt: { color: C.navy, fontWeight: "900", fontSize: 14 },
  body: {
    fontSize: 17, lineHeight: 28, color: C.text, fontWeight: "500",
    backgroundColor: C.white, padding: 20, borderRadius: 20,
    borderWidth: 2, borderColor: C.navy, ...SHADOW,
  },
  finishBtn: {
    flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8,
    backgroundColor: C.green, padding: 18, borderRadius: 999,
    borderWidth: 2, borderColor: C.navy, marginTop: 22, ...SHADOW,
  },
  finishTxt: { color: C.white, fontWeight: "900", fontSize: 16 },
  celebrate: {
    backgroundColor: C.white, borderRadius: 24, padding: 24, alignItems: "center",
    borderWidth: 2, borderColor: C.navy, marginTop: 22, ...SHADOW,
  },
  celTitle: { fontSize: 26, fontWeight: "900", color: C.navy, marginTop: 4 },
  celSub: { fontSize: 14, color: C.textSecondary, fontWeight: "600", textAlign: "center", marginTop: 4 },
  quizCta: {
    backgroundColor: C.saffron, paddingHorizontal: 20, paddingVertical: 14,
    borderRadius: 999, marginTop: 16, borderWidth: 2, borderColor: C.navy,
  },
  quizCtaTxt: { color: C.white, fontWeight: "900", fontSize: 16 },
});
