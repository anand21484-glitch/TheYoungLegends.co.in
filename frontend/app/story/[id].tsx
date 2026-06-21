import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { API } from "../../src/api";
import { C, SHADOW } from "../../src/theme";
import { Monument } from "../../src/components/Monument";
import { FloatingDecor } from "../../src/components/FloatingDecor";
import { FloatingMonuments } from "../../src/components/FloatingMonuments";
import { HeroPortrait } from "../../src/components/HeroPortrait";


export default function StoryReader() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [story, setStory] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<"en" | "hi">("en");
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
  }, [id]);

  const finishStory = async () => {
    try {
      await API.post("/stories/complete", { story_id: id });
      setCompleted(true);
      // Auto-trigger battle cry screen for heroes that have one
      const HEROES_WITH_CRY = new Set([
        "bhagat-singh", "rani-lakshmibai", "subhas-bose", "mahatma-gandhi",
        "tilak", "chandrashekhar-azad", "lala-lajpat-rai", "birsa-munda",
        "rani-gaidinliu", "kunwar-singh", "ram-prasad-bismil", "kittur-chennamma",
        "kattabomman", "matangini-hazra", "sarojini-naidu",
      ]);
      if (HEROES_WITH_CRY.has(String(id))) {
        // Give the celebration a moment, then route to battle cry
        setTimeout(() => {
          router.push(`/battlecry/${id}?from=story` as any);
        }, 1800);
      }
    } catch {}
  };

  const switchLang = (newLang: "en" | "hi") => {
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
          <TouchableOpacity testID="back-btn" onPress={() => router.back()} style={styles.backBtn}>
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
            <>
              <TouchableOpacity testID="finish-btn" style={styles.finishBtn} onPress={finishStory}>
                <Ionicons name="checkmark-circle" size={22} color={C.white} />
                <Text style={styles.finishTxt}>
                  {lang === "hi" ? "मैंने पढ़ लिया! +20 XP" : "I Finished Reading! +20 XP"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="ask-hero-btn"
                style={styles.askBtn}
                onPress={() => router.push(`/ask/${id}` as any)}
              >
                <View style={styles.askGlow} />
                <Ionicons name="chatbubbles" size={22} color={C.white} />
                <Text style={styles.askTxt}>
                  {lang === "hi" ? "मुझसे पूछो!" : "Ask Me!"}
                </Text>
                <Text style={styles.askEmoji}>💬</Text>
              </TouchableOpacity>
            </>
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
              <TouchableOpacity
                testID="ask-hero-btn-done"
                style={styles.askBtn}
                onPress={() => router.push(`/ask/${id}` as any)}
              >
                <View style={styles.askGlow} />
                <Ionicons name="chatbubbles" size={22} color={C.white} />
                <Text style={styles.askTxt}>
                  {lang === "hi" ? "मुझसे पूछो!" : "Ask Me Anything!"}
                </Text>
                <Text style={styles.askEmoji}>💬</Text>
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
  askBtn: {
    flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10,
    backgroundColor: "#FF9933", height: 56, borderRadius: 28,
    borderWidth: 3, borderColor: "#FFD700", marginTop: 12,
    position: "relative", overflow: "hidden", ...SHADOW,
  },
  askGlow: {
    position: "absolute", left: -50, right: -50, top: -50, bottom: -50,
    backgroundColor: "#FFD93D55",
  },
  askTxt: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", letterSpacing: 0.4 },
  askEmoji: { fontSize: 20 },
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
