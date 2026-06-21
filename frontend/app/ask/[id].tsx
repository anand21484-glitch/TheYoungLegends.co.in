// Ask the Hero — interactive, voice-first character companion.
// Per-hero conversation: tap one of 4 pre-cached question buttons →
// the hero "speaks" via expo-speech and shows the answer in a speech bubble.
// A "Coming soon" mic button is shown for older kids.
// Pre-cached answers work fully offline; if no Q&A is bundled for this hero,
// a friendly fallback is shown.

import { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert,
  Dimensions, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence,
  withSpring, FadeIn, FadeInDown, FadeInUp, Easing,
} from "react-native-reanimated";
import { HERO_QA, PORTRAITS, storyById } from "../../src/data";
import { C, SHADOW } from "../../src/theme";

const { width: SW } = Dimensions.get("window");

// 4-color rotation for question buttons (one color per question).
const Q_COLORS = ["#FF6B35", "#1A8FE3", "#7C5AC2", "#1FAE6F"];

const FALLBACK_QA = (heroName: string) => [
  {
    id: "fb_q1",
    question: "Why were you so brave?",
    answer: `I loved my country more than I loved myself. Bravery comes when you believe in something truly good!`,
    badge: "Courage Unlocked! 🔥",
  },
  {
    id: "fb_q2",
    question: "What can I learn from you?",
    answer: `Always stand up for what is right, and never give up on your dreams. India needs young hearts like yours!`,
    badge: "Lesson Earned! ⭐",
  },
  {
    id: "fb_q3",
    question: "What were you like as a kid?",
    answer: `I was curious, kind and full of dreams — just like you. Every great hero starts as a child with big ideas!`,
    badge: "Young Hero! 👦",
  },
  {
    id: "fb_q4",
    question: "Tell me one fun fact!",
    answer: `India has many heroes whose stories shaped our freedom. Keep learning, and one day you'll be a hero too!`,
    badge: "Fun Fact Found! 🇮🇳",
  },
];

export default function AskTheHero() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const story = storyById(String(id));
  const qa = HERO_QA[String(id)];
  const heroName = qa?.name || story?.name || story?.title_en || "the Hero";
  const heroColor = story?.color || "#FF6B35";
  const portraitAsset = PORTRAITS[String(id)];

  const questions = (qa?.questions?.length ? qa.questions : FALLBACK_QA(heroName)).slice(0, 4);

  const [active, setActive] = useState<any>(null);   // currently shown Q&A
  const [showBadge, setShowBadge] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Idle animation — gentle breathing
  const breathe = useSharedValue(0);
  const nod = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    return () => {
      try { Speech.stop(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 + breathe.value * 0.03 },
      { rotate: `${nod.value * 4}deg` },
    ],
  }));

  // ----- Tap a question button -----
  const ask = (q: any) => {
    try { Speech.stop(); } catch {}
    setActive(q);
    setShowBadge(false);

    // Nod animation when asked
    nod.value = withSequence(
      withTiming(0.5, { duration: 180 }),
      withTiming(-0.4, { duration: 180 }),
      withTiming(0.3, { duration: 180 }),
      withTiming(0, { duration: 180 }),
    );

    // Speak the answer
    setSpeaking(true);
    try {
      Speech.speak(q.answer, {
        language: "en-IN",
        rate: Platform.OS === "ios" ? 0.45 : 0.85,
        pitch: 1.05,
        onDone: () => {
          setSpeaking(false);
          setShowBadge(true);
        },
        onStopped: () => setSpeaking(false),
        onError: () => {
          setSpeaking(false);
          setShowBadge(true);
        },
      });
    } catch {
      setSpeaking(false);
      setShowBadge(true);
    }
  };

  const replay = () => active && ask(active);

  const showMicComingSoon = () => {
    Alert.alert(
      "Coming soon! 🎤",
      `Soon you'll be able to ask ${heroName} your own questions out loud. For now, tap one of the colorful question buttons!`,
    );
  };

  return (
    <SafeAreaView style={[styles.c, { backgroundColor: heroColor + "33" }]} edges={["top"]}>
      {/* Soft regional backdrop */}
      <View pointerEvents="none" style={[styles.bgGlow, { backgroundColor: heroColor + "55" }]} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} testID="ask-back">
          <Ionicons name="close" size={26} color={C.navy} />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.titleSmall}>Ask the Hero</Text>
          <Text style={styles.titleBig} numberOfLines={1}>{heroName}</Text>
        </View>
        <TouchableOpacity onPress={replay} disabled={!active} style={[styles.iconBtn, !active && { opacity: 0.3 }]}>
          <Ionicons name="refresh" size={22} color={C.navy} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {/* Hero portrait + speech bubble */}
        <View style={styles.heroArea}>
          <Animated.View entering={FadeInDown.duration(500)} style={[styles.bubble]}>
            <Text style={styles.bubbleTxt}>
              {active ? active.answer : `Ask me anything, young friend!`}
            </Text>
            {speaking && (
              <View style={styles.speakingRow}>
                <View style={[styles.dot, { animationDelay: "0ms" } as any]} />
                <View style={[styles.dot, { animationDelay: "200ms" } as any]} />
                <View style={[styles.dot, { animationDelay: "400ms" } as any]} />
              </View>
            )}
            <View style={[styles.bubbleTail, { borderTopColor: C.white }]} />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(600)}
            style={[styles.portraitCircle, { borderColor: heroColor }, heroStyle]}
          >
            {portraitAsset ? (
              <Image source={portraitAsset} style={styles.portrait} resizeMode="cover" />
            ) : (
              <View style={[styles.portraitFallback, { backgroundColor: heroColor }]}>
                <Text style={styles.portraitInitials}>
                  {heroName.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()}
                </Text>
              </View>
            )}
          </Animated.View>
        </View>

        {/* Fun-fact badge popup */}
        {showBadge && active?.badge && (
          <Animated.View entering={FadeIn.duration(400)} style={styles.factBadge}>
            <Text style={styles.factTxt}>You learned something new! {active.badge}</Text>
          </Animated.View>
        )}

        {/* Question buttons */}
        <Text style={styles.askPrompt}>Tap a question 👇</Text>
        <View style={styles.questionGrid}>
          {questions.map((q: any, idx: number) => {
            const color = Q_COLORS[idx % Q_COLORS.length];
            const isActive = active?.id === q.id;
            return (
              <Animated.View
                key={q.id}
                entering={FadeInUp.delay(120 + idx * 90).duration(450)}
                style={styles.qWrap}
              >
                <TouchableOpacity
                  testID={`ask-q-${idx}`}
                  activeOpacity={0.85}
                  onPress={() => ask(q)}
                  style={[
                    styles.qBtn,
                    { backgroundColor: color, borderColor: isActive ? C.gold : C.navy },
                    isActive && styles.qBtnActive,
                  ]}
                >
                  <Text style={styles.qBtnTxt}>{q.question}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Mic button — Coming soon */}
        <TouchableOpacity
          onPress={showMicComingSoon}
          testID="ask-mic"
          style={styles.micBtn}
          activeOpacity={0.85}
        >
          <View style={styles.micCircle}>
            <Ionicons name="mic" size={22} color={C.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.micTitle}>Ask your own question</Text>
            <Text style={styles.micSub}>Coming soon — for older kids 🎤</Text>
          </View>
          <Ionicons name="lock-closed" size={18} color={C.textMuted} />
        </TouchableOpacity>

        {qa ? null : (
          <Text style={styles.fallbackNote}>
            ✨ Showing friendly general answers — special questions for {heroName} are on their way!
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---- styles ----
const styles = StyleSheet.create({
  c: { flex: 1 },
  bgGlow: {
    position: "absolute",
    top: -100,
    left: -100,
    right: -100,
    height: 360,
    borderBottomLeftRadius: 400,
    borderBottomRightRadius: 400,
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.white,
    borderWidth: 2,
    borderColor: C.navy,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW,
  },
  titleWrap: { flex: 1, alignItems: "center" },
  titleSmall: { fontSize: 11, fontWeight: "700", color: C.navy + "99", letterSpacing: 1 },
  titleBig: { fontSize: 18, fontWeight: "900", color: C.navy, marginTop: 2 },

  heroArea: {
    alignItems: "center",
    marginTop: 8,
    minHeight: 280,
  },
  bubble: {
    backgroundColor: C.white,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    maxWidth: SW - 60,
    minHeight: 60,
    borderWidth: 2,
    borderColor: C.navy,
    marginBottom: 18,
    ...SHADOW,
  },
  bubbleTxt: {
    fontSize: 18,
    lineHeight: 26,
    color: C.navy,
    fontWeight: "700",
    textAlign: "center",
  },
  bubbleTail: {
    position: "absolute",
    bottom: -16,
    alignSelf: "center",
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  speakingRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: C.navy + "AA",
  },
  portraitCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: "hidden",
    borderWidth: 4,
    backgroundColor: C.gold,
    ...SHADOW,
  },
  portrait: { width: "100%", height: "100%" },
  portraitFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  portraitInitials: { fontSize: 48, fontWeight: "900", color: C.white },

  factBadge: {
    marginTop: 16,
    backgroundColor: "#FFE9A3",
    borderColor: "#FFB300",
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  factTxt: { fontSize: 14, fontWeight: "800", color: "#7A5300", textAlign: "center" },

  askPrompt: {
    fontSize: 14,
    fontWeight: "800",
    color: C.navy,
    textAlign: "center",
    marginTop: 22,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  questionGrid: { gap: 10 },
  qWrap: { width: "100%" },
  qBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 2,
    minHeight: 56,
    justifyContent: "center",
    ...SHADOW,
  },
  qBtnActive: { transform: [{ scale: 0.98 }] },
  qBtnTxt: {
    fontSize: 16,
    fontWeight: "800",
    color: C.white,
    lineHeight: 22,
    textAlign: "center",
  },

  micBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 18,
    padding: 14,
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: C.navy + "55",
    ...SHADOW,
  },
  micCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.navy,
    alignItems: "center", justifyContent: "center",
  },
  micTitle: { fontSize: 14, fontWeight: "800", color: C.navy },
  micSub: { fontSize: 11, fontWeight: "600", color: C.textMuted, marginTop: 2 },

  fallbackNote: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 18,
    paddingHorizontal: 12,
  },
});
