import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { API } from "../../src/api";
import { C, SHADOW } from "../../src/theme";
import { Monument } from "../../src/components/Monument";
import { FloatingDecor } from "../../src/components/FloatingDecor";
import { FloatingMonuments } from "../../src/components/FloatingMonuments";
import { HeroPortrait } from "../../src/components/HeroPortrait";

type Mode = "idle" | "story" | "lessons";

// --- Peppy / expressive TTS modulation (module scope) ----------------
type Chunk = { text: string; pitch: number; rate: number; pauseAfterMs: number };

function chunkAndModulate(rawText: string): Chunk[] {
  const sentenceRegex = /([^.!?।]+[.!?।]+|[^.!?।]+$)/g;
  const sentences: string[] = (rawText.match(sentenceRegex) || [rawText])
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.map<Chunk>((s) => {
    const lastChar = s.trim().slice(-1);
    const hasQuote = /["“”'‘’]/.test(s);
    const hasEmphasis = /[!]/.test(s);
    const hasQuestion = /[?]/.test(s);
    const isNumbered = /^\d+\./.test(s.trim());
    // Base warm storyteller tone
    let pitch = 1.18;
    let rate = 0.92;
    let pauseAfterMs = 280;
    if (hasEmphasis || lastChar === "!") {
      pitch = 1.32; rate = 1.0; pauseAfterMs = 420;
    } else if (hasQuestion || lastChar === "?") {
      pitch = 1.28; rate = 0.92; pauseAfterMs = 380;
    } else if (hasQuote) {
      pitch = 1.42; rate = 0.9; pauseAfterMs = 300;
    } else if (isNumbered) {
      pitch = 1.22; rate = 0.95; pauseAfterMs = 480;
    } else if (s.length < 30) {
      pitch = 1.24; rate = 0.95; pauseAfterMs = 320;
    } else if (s.length > 110) {
      pitch = 1.12; rate = 0.88; pauseAfterMs = 320;
    }
    const variation = ((s.charCodeAt(0) || 1) % 5 - 2) * 0.02;
    pitch = Math.max(0.85, Math.min(1.7, pitch + variation));
    return { text: s, pitch, rate, pauseAfterMs };
  });
}

let _speakQueueCancelled = false;
function speakWithModulation(text: string, lang: "en" | "hi", onAllDone: () => void) {
  _speakQueueCancelled = false;
  const chunks = chunkAndModulate(text);
  let idx = 0;
  const language = lang === "hi" ? "hi-IN" : "en-IN";
  const next = () => {
    if (_speakQueueCancelled) { onAllDone(); return; }
    if (idx >= chunks.length) { onAllDone(); return; }
    const c = chunks[idx++];
    Speech.speak(c.text, {
      language, pitch: c.pitch, rate: c.rate,
      onDone: () => {
        if (_speakQueueCancelled) { onAllDone(); return; }
        setTimeout(next, c.pauseAfterMs);
      },
      onStopped: () => { onAllDone(); },
      onError: () => setTimeout(next, 80),
    });
  };
  next();
}

function cancelSpeech() {
  _speakQueueCancelled = true;
  Speech.stop();
}
// -----------------------------------------------------------------

export default function StoryReader() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [story, setStory] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [speakMode, setSpeakMode] = useState<Mode>("idle");
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

  const speak = (mode: "story" | "lessons") => {
    if (speakMode === mode) {
      cancelSpeech();
      setSpeakMode("idle");
      return;
    }
    cancelSpeech();
    let text = "";
    if (mode === "story") {
      text = lang === "hi" ? story.story_hi : story.story_en;
    } else {
      const lessons = lang === "hi" ? story.lessons_hi : story.lessons_en;
      const intro = lang === "hi" ? "मैंने क्या सीखा! " : "What I learned today! ";
      text = intro + lessons.map((l: string, i: number) => `${i + 1}. ${l}`).join(" ... ");
    }
    setSpeakMode(mode);
    speakWithModulation(text, lang, () => setSpeakMode("idle"));
  };

  const finishStory = async () => {
    try {
      cancelSpeech();
      setSpeakMode("idle");
      await API.post("/stories/complete", { story_id: id });
      setCompleted(true);
    } catch {}
  };

  const switchLang = (newLang: "en" | "hi") => {
    cancelSpeech();
    setSpeakMode("idle");
    setLang(newLang);
  };

  if (!story) {
    return (
      <View style={[styles.c, { alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator color={C.saffron} size="large" />
      </View>
    );
  }

  const lessons: string[] = lang === "hi" ? story.lessons_hi : story.lessons_en;

  return (
    <View style={[styles.c, { backgroundColor: lightTint(story.color) }]}>
      {/* Animated decoration background — lotus + sparkles */}
      <FloatingDecor />
      {/* Drifting Indian monuments behind the content */}
      <FloatingMonuments />

      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={styles.topBar}>
          <TouchableOpacity testID="back-btn" onPress={() => { Speech.stop(); router.back(); }} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color={C.navy} />
          </TouchableOpacity>
          <View style={styles.langSwitch}>
            <TouchableOpacity
              testID="story-lang-en"
              style={[styles.langBtn, lang === "en" && styles.langActive]}
              onPress={() => switchLang("en")}
            >
              <Text style={[styles.langTxt, lang === "en" && { color: C.white }]}>EN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="story-lang-hi"
              style={[styles.langBtn, lang === "hi" && styles.langActive]}
              onPress={() => switchLang("hi")}
            >
              <Text style={[styles.langTxt, lang === "hi" && { color: C.white }]}>हिं</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }} testID="story-scroll">
          {/* Animated monument silhouette */}
          <Animated.View entering={FadeIn.duration(700)} style={styles.monumentWrap}>
            <Monument monumentKey={story.monument || "red_fort"} />
          </Animated.View>

          {/* Hero block with portrait */}
          <Animated.View entering={FadeInUp.duration(500)} style={[styles.heroBlock, { backgroundColor: story.color }]}>
            <View style={styles.portraitWrap}>
              <HeroPortrait storyId={story.id} name={story.name} color={story.color} size={140} />
            </View>
            <Text style={styles.heroEra}>{story.era}</Text>
            <Text style={styles.heroName}>{story.name}</Text>
            <Text style={styles.heroTitle}>{lang === "hi" ? story.title_hi : story.title_en}</Text>

            <TouchableOpacity testID="tts-btn" style={styles.ttsBtn} onPress={() => speak("story")}>
              <Ionicons name={speakMode === "story" ? "stop" : "play"} size={20} color={C.navy} />
              <Text style={styles.ttsTxt}>
                {speakMode === "story"
                  ? (lang === "hi" ? "रोकें" : "Stop Reading")
                  : (lang === "hi" ? "सुनें" : "Listen Aloud")}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(500)}>
            <Text style={styles.body} testID="story-body">
              {lang === "hi" ? story.story_hi : story.story_en}
            </Text>
          </Animated.View>

          {/* Inline What I Learned card */}
          {lessons && lessons.length > 0 && (
            <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.lessonsCard} testID="lessons-card">
              <View style={styles.lessonsHeader}>
                <View style={styles.lessonsTitleRow}>
                  <Ionicons name="bulb" size={22} color={C.saffron} />
                  <Text style={styles.lessonsTitle}>
                    {lang === "hi" ? "मैंने क्या सीखा" : "What I Learned"}
                  </Text>
                </View>
                <TouchableOpacity
                  testID="lessons-tts-btn"
                  style={[styles.miniPlay, speakMode === "lessons" && { backgroundColor: C.green }]}
                  onPress={() => speak("lessons")}
                >
                  <Ionicons
                    name={speakMode === "lessons" ? "stop" : "play"}
                    size={16}
                    color={C.white}
                  />
                  <Text style={styles.miniPlayTxt}>
                    {speakMode === "lessons"
                      ? (lang === "hi" ? "रोकें" : "Stop")
                      : (lang === "hi" ? "सुनें" : "Listen")}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.lessonsSubtitle}>
                {lang === "hi"
                  ? "रोज़मर्रा की ज़िंदगी में अपनाओ"
                  : "Bring these into your daily life"}
              </Text>
              {lessons.map((l, i) => (
                <View key={i} style={styles.lessonRow} testID={`lesson-${i}`}>
                  <View style={styles.lessonNum}>
                    <Text style={styles.lessonNumTxt}>{i + 1}</Text>
                  </View>
                  <Text style={styles.lessonTxt}>{l}</Text>
                </View>
              ))}
            </Animated.View>
          )}

          {!completed ? (
            <TouchableOpacity testID="finish-btn" style={styles.finishBtn} onPress={finishStory}>
              <Ionicons name="checkmark-circle" size={22} color={C.white} />
              <Text style={styles.finishTxt}>
                {lang === "hi" ? "मैंने पढ़ लिया! +20 XP" : "I Finished Reading! +20 XP"}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.celebrate} testID="celebrate-box">
                <Text style={{ fontSize: 44 }}>🎉</Text>
                <Text style={styles.celTitle}>
                  {lang === "hi" ? "बहुत बढ़िया!" : "Wonderful!"}
                </Text>
                <Text style={styles.celSub}>
                  {lang === "hi"
                    ? "तुमने 20 XP कमाए। याद रखो अपनी सीखें — अब क्विज़ का समय!"
                    : "You earned 20 XP. Keep these lessons close — now test your memory!"}
                </Text>
              </View>

              {/* Highlighted lessons recap */}
              <View style={styles.recapCard} testID="recap-card">
                <Text style={styles.recapTitle}>
                  ✨ {lang === "hi" ? "आज की मेरी प्रेरणाएँ" : "My Takeaways Today"}
                </Text>
                {lessons.slice(0, 3).map((l, i) => (
                  <View key={i} style={styles.recapRow}>
                    <Ionicons name="sparkles" size={14} color={C.gold} style={{ marginTop: 4 }} />
                    <Text style={styles.recapTxt}>{l}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                testID="quiz-cta"
                style={styles.quizCta}
                onPress={() => router.replace(`/quiz/${id}` as any)}
              >
                <Text style={styles.quizCtaTxt}>
                  {lang === "hi" ? "क्विज़ खेलें 🎯" : "Take the Quiz 🎯"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Lighten a hex color by mixing with white (returns a soft kid-friendly tint)
function lightTint(hex: string): string {
  try {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    // mix 85% white + 15% color
    const mix = (c: number) => Math.round(c * 0.18 + 255 * 0.82);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  } catch {
    return "#FFF8E7";
  }
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  monumentWrap: {
    height: 140,
    marginHorizontal: -18,
    marginTop: -8,
    marginBottom: 8,
    overflow: "hidden",
    borderRadius: 0,
  },
  portraitWrap: {
    alignSelf: "center",
    marginTop: -10,
    marginBottom: 14,
  },
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
  lessonsCard: {
    backgroundColor: "#FFF8E7",
    borderRadius: 20, padding: 18, marginTop: 18,
    borderWidth: 2, borderColor: C.navy, ...SHADOW,
  },
  lessonsHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  lessonsTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  lessonsTitle: { fontSize: 18, fontWeight: "900", color: C.navy },
  lessonsSubtitle: { fontSize: 12, color: C.textSecondary, fontWeight: "700", marginTop: 4, marginBottom: 12 },
  miniPlay: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: C.saffron, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy,
  },
  miniPlayTxt: { color: C.white, fontWeight: "900", fontSize: 12 },
  lessonRow: {
    flexDirection: "row", gap: 12, marginTop: 12,
    backgroundColor: C.white, padding: 12, borderRadius: 14,
    borderWidth: 1, borderColor: "#E5C97A",
  },
  lessonNum: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: C.saffron,
    alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: C.navy,
  },
  lessonNumTxt: { color: C.white, fontWeight: "900", fontSize: 13 },
  lessonTxt: { flex: 1, fontSize: 14, color: C.text, lineHeight: 20, fontWeight: "600" },
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
  celSub: { fontSize: 14, color: C.textSecondary, fontWeight: "600", textAlign: "center", marginTop: 4, lineHeight: 20 },
  recapCard: {
    backgroundColor: C.navy, borderRadius: 20, padding: 18, marginTop: 14,
    borderWidth: 2, borderColor: C.navy, ...SHADOW,
  },
  recapTitle: { color: C.gold, fontSize: 15, fontWeight: "900", marginBottom: 10, letterSpacing: 0.5 },
  recapRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  recapTxt: { flex: 1, color: C.white, fontSize: 13, fontWeight: "600", lineHeight: 19 },
  quizCta: {
    backgroundColor: C.saffron, padding: 18, borderRadius: 999, alignItems: "center",
    marginTop: 14, borderWidth: 2, borderColor: C.navy, ...SHADOW,
  },
  quizCtaTxt: { color: C.white, fontWeight: "900", fontSize: 16 },
});
