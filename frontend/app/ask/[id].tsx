// ===========================================================================
//  Ask the Hero!  —  Bottom-sheet modal, per-hero interactive companion
// ===========================================================================
//   Layout (full screen modal): 35% portrait • 50% question grid • 15% controls
//   Background: deep navy #1A1A3E with floating golden particles + chakra watermark
//   TTS: expo-speech (en-IN, pitch 1.1, rate 0.82) prefixed with "{Hero} says..."
//   Progress: AsyncStorage keys `asked_{heroId}_{qId}` + hero_experts in localStore
//   On 4/4 answered: tricolor confetti + celebration card + Hero Expert badge
// ===========================================================================

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions,
  Platform, Vibration, Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence,
  withSpring, withDelay, FadeIn, FadeOut, ZoomIn, Easing,
} from "react-native-reanimated";
import Svg, { Circle, Line } from "react-native-svg";
import { HERO_QA, PORTRAITS, storyById } from "../../src/data";
import { Local } from "../../src/data/localStore";
import { C } from "../../src/theme";

const { width: SW, height: SH } = Dimensions.get("window");

// ---- Color tokens per spec ----
const COL = {
  bg: "#1A1A3E",
  gold: "#FFD700",
  goldDark: "#FFA500",
  bubbleBg: "#FFFFFF",
  bubbleTxt: "#1A202C",
  subtitle: "#E2E8F0",
  saffron: "#FF9933",
  green: "#138808",
  blue: "#0047AB",
  purple: "#6B21A8",
  white: "#FFFFFF",
  grey: "#6B7280",
  greyMid: "#9CA3AF",
  red: "#DC2626",
};
const Q_COLORS = [COL.saffron, COL.green, COL.blue, COL.purple];

// ---- Fallback (hero not in JSON) ----
const FALLBACK_QA = (heroName: string) => [
  { id: "fb_q1", question: "Why were you so brave?",
    answer: `I loved my country deeply, and that love made me strong! When you love something good, fear melts away.`,
    badge: "Courage Unlocked! 🔥" },
  { id: "fb_q2", question: "What can I learn from you?",
    answer: `Always stand up for what is right, and dream big dreams for India. The future belongs to brave hearts like you!`,
    badge: "Lesson Earned! ⭐" },
  { id: "fb_q3", question: "What were you like as a kid?",
    answer: `I was curious, kind and full of questions — just like you! Every great hero starts as a curious child.`,
    badge: "Young Hero! 👦" },
  { id: "fb_q4", question: "Tell me one fun fact!",
    answer: `India has many wonderful heroes whose stories made our country free. Keep learning — one day you'll be a hero too!`,
    badge: "Fun Fact Found! 🇮🇳" },
];

// =====  Tricolor confetti =====
function Confetti({ visible }: { visible: boolean }) {
  if (!visible) return null;
  const colors = [COL.saffron, COL.white, COL.green, COL.gold];
  const pieces = Array.from({ length: 36 });
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {pieces.map((_, i) => (
        <ConfettiPiece
          key={i}
          color={colors[i % colors.length]}
          delay={i * 25}
          x={Math.random() * SW}
        />
      ))}
    </View>
  );
}
function ConfettiPiece({ color, delay, x }: any) {
  const y = useSharedValue(-20);
  const r = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(delay, withTiming(SH + 30, {
      duration: 2400 + Math.random() * 800, easing: Easing.out(Easing.quad),
    }));
    r.value = withDelay(delay, withTiming(360 * (1 + Math.random()), { duration: 2600 }));
  }, [delay, y, r]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { rotate: `${r.value}deg` }],
  }));
  return (
    <Animated.View
      style={[
        { position: "absolute", left: x, top: 0, width: 10, height: 14, backgroundColor: color, borderRadius: 2 },
        style,
      ]}
    />
  );
}

// =====  Floating golden particles =====
function GoldenParticles() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Particle
          key={i}
          x={(SW / 6) * i + Math.random() * 30}
          delay={i * 700}
          size={4 + Math.random() * 4}
        />
      ))}
    </View>
  );
}
function Particle({ x, delay, size }: any) {
  const y = useSharedValue(SH);
  useEffect(() => {
    y.value = withDelay(delay, withRepeat(
      withTiming(-30, { duration: 9000 + Math.random() * 4000, easing: Easing.linear }),
      -1, false,
    ));
  }, [delay, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Animated.View
      style={[
        { position: "absolute", left: x, width: size, height: size,
          borderRadius: size / 2, backgroundColor: COL.gold, opacity: 0.7 },
        style,
      ]}
    />
  );
}

// =====  Ashoka Chakra watermark =====
function ChakraWatermark() {
  const size = SW * 0.7;
  return (
    <View pointerEvents="none" style={[styles.chakraWrap, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="46" stroke={COL.gold} strokeWidth="2" fill="none" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 360) / 24;
          const rad = (a * Math.PI) / 180;
          const x2 = 50 + Math.cos(rad) * 46;
          const y2 = 50 + Math.sin(rad) * 46;
          return <Line key={i} x1={50} y1={50} x2={x2} y2={y2} stroke={COL.gold} strokeWidth="1" />;
        })}
      </Svg>
    </View>
  );
}

// =====  Main screen =====
export default function AskTheHeroModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const heroId = String(id);
  const router = useRouter();

  const story = storyById(heroId);
  const qa = HERO_QA[heroId];
  const heroName = qa?.name || story?.name || story?.title_en || "the Hero";
  const portraitAsset = PORTRAITS[heroId];
  const questions = (qa?.questions?.length ? qa.questions : FALLBACK_QA(heroName)).slice(0, 4);

  // ---- State ----
  const [active, setActive] = useState<any>(null);
  const [shownAnswer, setShownAnswer] = useState<string>("");
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [showBadge, setShowBadge] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const typeIntervalRef = useRef<any>(null);
  const badgeTimeoutRef = useRef<any>(null);
  const speechStartedAtRef = useRef<number>(0);

  // ---- Animated values ----
  const heroScale = useSharedValue(1);
  const flashOpacity = useSharedValue(0);
  const bubbleScale = useSharedValue(1);

  // ---- Load previously asked questions on mount ----
  useEffect(() => {
    (async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const ourKeys = keys.filter((k) => k.startsWith(`asked_${heroId}_`));
        const ids = ourKeys.map((k) => k.replace(`asked_${heroId}_`, ""));
        setAnswered(new Set(ids));
      } catch {}
    })();
    return () => {
      try { Speech.stop(); } catch {}
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
      if (badgeTimeoutRef.current) clearTimeout(badgeTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroId]);

  // ---- Animated styles ----
  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroScale.value }],
  }));
  const flashStyle = useAnimatedStyle(() => ({ opacity: flashOpacity.value }));
  const bubbleStyle = useAnimatedStyle(() => ({ transform: [{ scale: bubbleScale.value }] }));

  // ---- Typewriter effect ----
  const typewriteAnswer = useCallback((text: string) => {
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    const words = text.split(/\s+/);
    let i = 0;
    setShownAnswer("");
    const delay = Math.max(40, Math.min(120, 1500 / Math.max(1, words.length)));
    typeIntervalRef.current = setInterval(() => {
      i += 1;
      setShownAnswer(words.slice(0, i).join(" "));
      if (i >= words.length) clearInterval(typeIntervalRef.current);
    }, delay);
  }, []);

  // ---- Speak the answer ("Hero says... ans") ----
  const speakAnswer = useCallback((q: any) => {
    try { Speech.stop(); } catch {}
    setSpeaking(true);
    speechStartedAtRef.current = Date.now();
    const intro = `${heroName} says.`;
    Speech.speak(intro, {
      language: "en-IN",
      pitch: 1.1,
      rate: 0.82,
      onDone: () => {
        // 400ms pause then the actual answer
        setTimeout(() => {
          Speech.speak(q.answer, {
            language: "en-IN",
            pitch: 1.1,
            rate: 0.82,
            onDone: () => onSpeechFinished(q),
            onStopped: () => setSpeaking(false),
            onError: () => onSpeechFinished(q),
          });
        }, 400);
      },
      onStopped: () => setSpeaking(false),
      onError: () => {
        // Speech unavailable — still trigger badge + persistence
        onSpeechFinished(q);
      },
    });
  }, [heroName]);

  // ---- After speech finishes (or fails) ----
  const onSpeechFinished = useCallback(async (q: any) => {
    setSpeaking(false);
    setShowBadge(true);
    try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}

    // Persist + check for Hero Expert
    try {
      await AsyncStorage.setItem(`asked_${heroId}_${q.id}`, "true");
      const { becameExpert } = await Local.markAsked(heroId, q.id);
      setAnswered((prev) => new Set([...prev, q.id]));
      if (becameExpert) {
        // Vibrate + confetti + celebration card
        try { Vibration.vibrate([0, 60, 80, 60]); } catch {}
        setTimeout(() => setShowCelebration(true), 800);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("[ask] persist failed", e);
    }

    // Auto-hide badge after 3s
    if (badgeTimeoutRef.current) clearTimeout(badgeTimeoutRef.current);
    badgeTimeoutRef.current = setTimeout(() => setShowBadge(false), 3200);
  }, [heroId]);

  // ---- Tap a question ----
  const ask = (q: any) => {
    if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
    try { Speech.stop(); } catch {}
    setShowBadge(false);
    setActive(q);
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}

    // White flash on button
    flashOpacity.value = withSequence(
      withTiming(0.6, { duration: 100, easing: Easing.linear }),
      withTiming(0, { duration: 300 }),
    );
    // Hero happy bounce
    heroScale.value = withSequence(
      withSpring(1.08, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 6, stiffness: 180 }),
    );
    // Bubble pop
    bubbleScale.value = withSequence(
      withTiming(1.05, { duration: 140 }),
      withTiming(1, { duration: 220 }),
    );

    // Typewriter + speak
    typewriteAnswer(q.answer);
    speakAnswer(q);
  };

  const replay = () => active && ask(active);

  // ---- Render ----
  const expertCount = (qa?.questions || []).filter((q: any) => answered.has(q.id)).length;
  const isExpert = answered.size >= 4 && questions.every((q: any) => answered.has(q.id));

  return (
    <View style={styles.c}>
      <ChakraWatermark />
      <GoldenParticles />

      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        {/* ---- Close button ---- */}
        <View style={styles.headerRow}>
          <View style={{ width: 44 }} />
          <Text style={styles.headerTitle}>Ask the Hero</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeBtn}
            testID="ask-close"
          >
            <Ionicons name="close" size={24} color={COL.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ===== 35% — Hero portrait + speech bubble ===== */}
          <View style={styles.heroBlock}>
            <Animated.View style={[styles.bubble, bubbleStyle]}>
              <Text style={styles.bubbleTxt} numberOfLines={6}>
                {shownAnswer || `Ask me anything, young friend! 🇮🇳`}
              </Text>
              {active && (
                <TouchableOpacity
                  onPress={replay}
                  style={styles.replayInline}
                  testID="ask-replay"
                  accessibilityLabel="Replay answer"
                >
                  <Ionicons
                    name={speaking ? "pause" : "volume-high"}
                    size={18}
                    color={COL.bubbleTxt}
                  />
                </TouchableOpacity>
              )}
              <View style={styles.bubbleTail} />
            </Animated.View>

            <View style={styles.glow} />
            <Animated.View style={[styles.portraitCircle, heroStyle]}>
              {portraitAsset ? (
                <Image source={portraitAsset} style={styles.portrait} resizeMode="cover" />
              ) : (
                <View style={[styles.portraitFallback]}>
                  <Text style={styles.portraitInitials}>
                    {heroName.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()}
                  </Text>
                </View>
              )}
            </Animated.View>

            <Text style={styles.heroName} numberOfLines={2}>{heroName}</Text>
            <Text style={styles.subtitle}>Tap a question to hear my answer!</Text>

            {/* Progress dots */}
            <View style={styles.dotsRow}>
              {questions.map((q: any) => (
                <View
                  key={`dot-${q.id}`}
                  style={[
                    styles.dot,
                    answered.has(q.id) ? styles.dotFull : styles.dotEmpty,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Saffron divider */}
          <View style={styles.divider} />

          {/* ===== 50% — Question grid (2x2) ===== */}
          <View style={styles.qGrid}>
            {questions.map((q: any, idx: number) => {
              const isAnswered = answered.has(q.id);
              const isActive = active?.id === q.id;
              return (
                <Pressable
                  key={q.id}
                  testID={`ask-q-${idx}`}
                  onPress={() => ask(q)}
                  style={({ pressed }) => [
                    styles.qBtn,
                    { backgroundColor: Q_COLORS[idx], transform: [{ scale: pressed ? 0.95 : 1 }] },
                  ]}
                >
                  <Text style={styles.qBtnTxt} numberOfLines={3}>{q.question}</Text>
                  {isAnswered && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark-circle" size={20} color={COL.gold} />
                    </View>
                  )}
                  {isActive && (
                    <Animated.View style={[styles.flash, flashStyle]} pointerEvents="none" />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* ===== 15% — Mic (coming soon) ===== */}
          <View style={styles.controlsBlock}>
            <View style={styles.micWrap}>
              <View style={styles.micCircle}>
                <Ionicons name="mic" size={26} color={COL.white} />
              </View>
              <View style={styles.comingSoonChip}>
                <Text style={styles.comingSoonTxt}>Coming Soon! 🎤</Text>
              </View>
            </View>
            <Text style={styles.micSub}>Voice questions coming soon!</Text>
          </View>
        </ScrollView>

        {/* Fun-fact badge popup */}
        {showBadge && active?.badge && (
          <Animated.View
            entering={ZoomIn.duration(360)}
            exiting={FadeOut.duration(300)}
            style={styles.badgeCard}
          >
            <Text style={styles.badgeEmoji}>
              {(active.badge.match(/[\p{Emoji}\u2728\u2B50]/u) || ["⭐"])[0]}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.badgeName}>{active.badge.replace(/[\p{Emoji}\u2728\u2B50]/u, "").trim()}</Text>
              <Text style={styles.badgeSub}>You learned something new! ⭐</Text>
            </View>
          </Animated.View>
        )}

        {/* Celebration overlay */}
        {showCelebration && (
          <View style={StyleSheet.absoluteFill}>
            <Confetti visible />
            <View style={styles.celebrationBackdrop}>
              <Animated.View entering={ZoomIn.duration(450)} style={styles.celebrationCard}>
                <Text style={styles.celebrationEmoji}>🏅</Text>
                <Text style={styles.celebrationTitle}>Amazing!</Text>
                <Text style={styles.celebrationBody}>
                  You know everything about {heroName}!
                </Text>
                <Text style={styles.celebrationBadge}>{heroName} Expert 🏅</Text>
                <TouchableOpacity
                  onPress={() => setShowCelebration(false)}
                  style={styles.celebrationBtn}
                  testID="celebrate-close"
                >
                  <Text style={styles.celebrationBtnTxt}>Continue</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

// ===== Styles =====
const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: COL.bg },
  chakraWrap: {
    position: "absolute",
    top: SH * 0.18,
    left: SW * 0.15,
    opacity: 0.08,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COL.subtitle,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  closeBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#FFFFFF22",
    alignItems: "center", justifyContent: "center",
  },

  // ===== Hero block =====
  heroBlock: { alignItems: "center", paddingTop: 8 },
  bubble: {
    backgroundColor: COL.bubbleBg,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    maxWidth: SW - 64,
    minHeight: 58,
    shadowColor: COL.gold,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    marginBottom: 18,
    position: "relative",
  },
  bubbleTxt: {
    fontSize: 16,
    lineHeight: 24,
    color: COL.bubbleTxt,
    fontWeight: "600",
    textAlign: "center",
    paddingRight: 28,
  },
  replayInline: {
    position: "absolute",
    right: 10, top: 10,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COL.gold + "33",
    alignItems: "center", justifyContent: "center",
  },
  bubbleTail: {
    position: "absolute",
    bottom: -14,
    alignSelf: "center",
    width: 0, height: 0,
    borderLeftWidth: 12, borderRightWidth: 12, borderTopWidth: 14,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: COL.bubbleBg,
  },
  glow: {
    position: "absolute",
    top: 72, alignSelf: "center",
    width: 230, height: 230, borderRadius: 115,
    backgroundColor: COL.gold,
    opacity: 0.18,
  },
  portraitCircle: {
    width: 170, height: 170, borderRadius: 85,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: COL.gold,
    backgroundColor: COL.gold + "22",
  },
  portrait: { width: "100%", height: "100%" },
  portraitFallback: {
    width: "100%", height: "100%",
    backgroundColor: COL.purple,
    alignItems: "center", justifyContent: "center",
  },
  portraitInitials: { fontSize: 44, fontWeight: "900", color: COL.white },
  heroName: {
    fontSize: 22, fontWeight: "900", color: COL.gold,
    marginTop: 14, textAlign: "center", letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14, color: COL.subtitle, fontWeight: "600",
    marginTop: 6, textAlign: "center",
  },
  dotsRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  dotEmpty: { backgroundColor: "#FFFFFF22", borderWidth: 1.5, borderColor: COL.gold + "66" },
  dotFull: { backgroundColor: COL.gold },

  divider: {
    height: 2,
    backgroundColor: COL.saffron,
    marginVertical: 18,
    borderRadius: 1,
    opacity: 0.85,
  },

  // ===== Question grid (2x2) =====
  qGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  qBtn: {
    width: "48%",
    minHeight: 80,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    overflow: "hidden",
  },
  qBtnTxt: {
    color: COL.white,
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 19,
  },
  checkBadge: {
    position: "absolute",
    top: 6, right: 6,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#FFFFFFEE",
    alignItems: "center", justifyContent: "center",
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COL.white,
    borderRadius: 20,
  },

  // ===== Controls block (mic) =====
  controlsBlock: { alignItems: "center", marginTop: 22 },
  micWrap: { position: "relative", alignItems: "center", justifyContent: "center" },
  micCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COL.greyMid,
    alignItems: "center", justifyContent: "center",
    opacity: 0.85,
  },
  comingSoonChip: {
    position: "absolute",
    bottom: -8,
    backgroundColor: COL.red,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 2, borderColor: COL.bg,
  },
  comingSoonTxt: { color: COL.white, fontWeight: "900", fontSize: 10 },
  micSub: {
    marginTop: 14,
    color: COL.subtitle,
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.8,
  },

  // ===== Badge popup =====
  badgeCard: {
    position: "absolute",
    bottom: 28, left: 18, right: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COL.bubbleBg,
    borderWidth: 2,
    borderColor: COL.gold,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: COL.gold,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  badgeEmoji: { fontSize: 36 },
  badgeName: { fontSize: 18, fontWeight: "900", color: "#1A1A3E" },
  badgeSub: { fontSize: 14, color: "#374151", fontWeight: "600", marginTop: 2 },

  // ===== Celebration =====
  celebrationBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000099",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  celebrationCard: {
    backgroundColor: COL.white,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    borderWidth: 3,
    borderColor: COL.gold,
    maxWidth: 340,
  },
  celebrationEmoji: { fontSize: 56 },
  celebrationTitle: {
    fontSize: 28, fontWeight: "900", color: "#1A1A3E",
    marginTop: 10, letterSpacing: -0.3,
  },
  celebrationBody: {
    fontSize: 16, color: "#374151", fontWeight: "700",
    textAlign: "center", marginTop: 8, lineHeight: 22,
  },
  celebrationBadge: {
    marginTop: 14,
    backgroundColor: COL.gold,
    paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 999,
    fontSize: 14, fontWeight: "900", color: "#1A1A3E",
    overflow: "hidden",
  },
  celebrationBtn: {
    marginTop: 22,
    backgroundColor: COL.bg,
    paddingHorizontal: 32, paddingVertical: 12,
    borderRadius: 999,
  },
  celebrationBtnTxt: {
    color: COL.gold, fontWeight: "900", fontSize: 16, letterSpacing: 0.4,
  },
});
