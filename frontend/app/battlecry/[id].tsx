import { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator,
  Modal, Alert, Platform, Dimensions, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence,
  withDelay, Easing, FadeIn, FadeOut, ZoomIn, FadeInUp, SlideInDown,
  runOnJS,
} from "react-native-reanimated";
import { Audio } from "expo-av";
import { API, PORTRAITS } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;
const { width: SW, height: SH } = Dimensions.get("window");

// --- SFX modules (loaded once per screen) ---
const drumMod = require("../../assets/audio/drumroll.mp3");
const cheerMod = require("../../assets/audio/crowd_cheer.mp3");
const chimeMod = require("../../assets/audio/badge_chime.mp3");

type Cry = {
  hero_id: string; hero_name: string; hero_color: string;
  portrait_url: string | null; cry: string; meaning: string;
  origin: string; completed: boolean; badge_id: string;
};

type Phase = "intro" | "reveal" | "prepare" | "recording" | "shy" | "celebrate";

export default function BattleCryScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const router = useRouter();
  const [data, setData] = useState<Cry | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("intro");
  const [wordsShown, setWordsShown] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [reward, setReward] = useState<{ xp: number; badge: string; freedom_voice: boolean } | null>(null);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const drumSoundRef = useRef<Audio.Sound | null>(null);
  const cheerSoundRef = useRef<Audio.Sound | null>(null);
  const chimeSoundRef = useRef<Audio.Sound | null>(null);
  const recTimerRef = useRef<any>(null);
  const shyTimerRef = useRef<any>(null);
  const phaseRef = useRef<Phase>("intro");
  const maxMeteringRef = useRef<number>(-160);
  const earlySuccessRef = useRef<boolean>(false);
  const introStartedRef = useRef<boolean>(false);

  // Animated values
  const portraitScale = useSharedValue(0.4);
  const portraitOpacity = useSharedValue(0);
  const fistRotate = useSharedValue(0);
  const micPulse = useSharedValue(0);
  const ringScale = useSharedValue(0);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Kick off the entrance choreography once data has loaded
  useEffect(() => {
    if (!loading && data && !introStartedRef.current) {
      introStartedRef.current = true;
      // Tiny delay to let SafeAreaView mount cleanly
      setTimeout(() => startIntro(data.cry), 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, data]);

  // Load data + audio
  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        }).catch(() => {});

        const r = await API.get(`/battle-cries/${id}`);
        setData(r.data);

        // Preload SFX
        try {
          const d = await Audio.Sound.createAsync(drumMod, { volume: 0.85 });
          drumSoundRef.current = d.sound;
          const c = await Audio.Sound.createAsync(cheerMod, { volume: 0.9 });
          cheerSoundRef.current = c.sound;
          const ch = await Audio.Sound.createAsync(chimeMod, { volume: 0.85 });
          chimeSoundRef.current = ch.sound;
        } catch {}
      } catch (e: any) {
        // (offline: no auth)
        if (e?.response?.status === 404) {
          Alert.alert("No battle cry", "This hero doesn't have a battle cry.");
          router.back();
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const cleanup = async () => {
    try { await recordingRef.current?.stopAndUnloadAsync(); } catch {}
    recordingRef.current = null;
    try { await drumSoundRef.current?.unloadAsync(); } catch {}
    try { await cheerSoundRef.current?.unloadAsync(); } catch {}
    try { await chimeSoundRef.current?.unloadAsync(); } catch {}
    if (recTimerRef.current) clearTimeout(recTimerRef.current);
    if (shyTimerRef.current) clearTimeout(shyTimerRef.current);
  };

  const playDrum = async () => {
    if (Platform.OS === "web") return;
    try { await drumSoundRef.current?.replayAsync(); } catch {}
  };
  const playCheer = async () => {
    if (Platform.OS === "web") return;
    try { await cheerSoundRef.current?.replayAsync(); } catch {}
  };
  const playChime = async () => {
    if (Platform.OS === "web") return;
    try { await chimeSoundRef.current?.replayAsync(); } catch {}
  };

  // ---------- Choreography ----------
  const startIntro = (cryText: string) => {
    setPhase("intro");
    playDrum();
    // Portrait zoom-in
    portraitScale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.3)) });
    portraitOpacity.value = withTiming(1, { duration: 500 });
    // After portrait lands, reveal the cry word-by-word
    setTimeout(() => {
      setPhase("reveal");
      revealWords(cryText);
    }, 1400);
  };

  const revealWords = (cryText: string) => {
    const words = cryText.split(/\s+/).filter(Boolean);
    let i = 0;
    const step = () => {
      i++;
      setWordsShown(i);
      if (i < words.length) {
        setTimeout(step, 420);
      } else {
        // Transition to prepare phase
        setTimeout(() => {
          setPhase("prepare");
          // Start mic pulse animation
          micPulse.value = withRepeat(
            withSequence(
              withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
              withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            ),
            -1,
            true,
          );
        }, 600);
      }
    };
    setTimeout(step, 0);
  };

  // ---------- Recording flow ----------
  const tapMic = async () => {
    if (phaseRef.current === "recording" || phaseRef.current === "shy") return;
    // Web platform doesn't reliably support expo-av Recording — fall back to tap-celebrate
    if (Platform.OS === "web") {
      celebrate();
      return;
    }
    if (permissionDenied) { celebrate(); return; }
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        setPermissionDenied(true);
        Alert.alert(
          "Mic needed",
          "Can I use your mic? I want to hear you roar like a freedom fighter! 🎤\n\n(Tap the Tap-to-Celebrate button if you'd prefer.)",
        );
        return;
      }

      // Reset trackers
      maxMeteringRef.current = -160;
      earlySuccessRef.current = false;

      // Start recording WITH metering enabled (volume threshold detection)
      const rec = new Audio.Recording();
      const opts: any = {
        ...Audio.RecordingOptionsPresets.LOW_QUALITY,
        isMeteringEnabled: true,
      };
      await rec.prepareToRecordAsync(opts);

      // Listen for metering updates to detect a "roar"
      rec.setOnRecordingStatusUpdate((status: any) => {
        if (!status?.isRecording) return;
        const m: number = typeof status.metering === "number" ? status.metering : -160;
        if (m > maxMeteringRef.current) maxMeteringRef.current = m;

        // -20 dB = decent shout/loud voice. -10 dB = full roar.
        // Trigger early success once the kid has roared loudly enough
        if (!earlySuccessRef.current && m >= -20) {
          earlySuccessRef.current = true;
          // Small grace window so they finish the cry, then celebrate
          setTimeout(() => {
            if (phaseRef.current === "recording") stopAndCelebrate();
          }, 700);
        }
      });
      await rec.startAsync();
      recordingRef.current = rec;
      setPhase("recording");
      micPulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 360 }),
          withTiming(0.5, { duration: 360 }),
        ),
        -1,
        true,
      );
      ringScale.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.out(Easing.ease) }), -1);

      // Auto-stop after 5 s — always celebrates (even soft voices count)
      recTimerRef.current = setTimeout(() => stopAndCelebrate(), 5000);

      // Shy nudge after 2.8 s if we haven't heard anything loud yet
      shyTimerRef.current = setTimeout(() => {
        if (phaseRef.current === "recording" && maxMeteringRef.current < -35) {
          setPhase("shy");
        }
      }, 2800);
    } catch (e) {
      console.warn("recording error", e);
      celebrate();
    }
  };

  const stopAndCelebrate = async () => {
    try { await recordingRef.current?.stopAndUnloadAsync(); } catch {}
    recordingRef.current = null;
    if (recTimerRef.current) clearTimeout(recTimerRef.current);
    if (shyTimerRef.current) clearTimeout(shyTimerRef.current);
    ringScale.value = 0;
    celebrate();
  };

  const celebrate = async () => {
    setPhase("celebrate");
    playCheer();
    fistRotate.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 220 }),
        withTiming(15, { duration: 380 }),
        withTiming(0, { duration: 220 }),
      ),
      2,
      false,
    );
    setTimeout(playChime, 700);
    try {
      const r = await API.post(`/battle-cries/${id}/complete`);
      setReward({
        xp: r.data.xp_awarded || 0,
        badge: r.data.badge_awarded,
        freedom_voice: !!r.data.freedom_voice_awarded,
      });
    } catch {
      setReward({ xp: 0, badge: `cry_${id}`, freedom_voice: false });
    }
  };

  const sayAgain = () => {
    setWordsShown(data?.cry.split(/\s+/).length || 0);
    setReward(null);
    setPhase("prepare");
    micPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  };

  const goNext = () => {
    if (from === "story") router.replace(`/(tabs)/library` as any);
    else router.back();
  };

  // ---------- Animated styles ----------
  const portraitAnim = useAnimatedStyle(() => ({
    transform: [{ scale: portraitScale.value }, { rotate: `${fistRotate.value}deg` }],
    opacity: portraitOpacity.value,
  }));
  const micAnim = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + micPulse.value * 0.12 }],
    shadowOpacity: 0.55 + micPulse.value * 0.4,
  }));
  const ringAnim = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + ringScale.value * 1.4 }],
    opacity: 1 - ringScale.value,
  }));

  if (loading || !data) {
    return (
      <SafeAreaView style={[styles.c, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={C.gold} />
      </SafeAreaView>
    );
  }

  const words = data.cry.split(/\s+/).filter(Boolean);
  const shownText = words.slice(0, wordsShown).join(" ");
  const recording = phase === "recording";
  const isCelebrate = phase === "celebrate";

  return (
    <SafeAreaView style={styles.c} edges={["top", "bottom"]}>
      <Sparks />
      {/* Skip button (top-right) */}
      <TouchableOpacity style={styles.skipBtn} onPress={() => router.back()} testID="cry-skip">
        <Text style={styles.skipTxt}>Skip</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll} testID="cry-scroll">
        {/* Hero portrait */}
        <Animated.View style={[styles.portraitWrap, portraitAnim, { borderColor: data.hero_color }]}>
          {data.portrait_url || PORTRAITS[data.hero_id] ? (
            <Image
              source={PORTRAITS[data.hero_id] || ({ uri: `${BASE}${data.portrait_url}` } as any)}
              style={styles.portrait}
            />
          ) : (
            <View style={[styles.portrait, { backgroundColor: data.hero_color }]} />
          )}
          {isCelebrate && (
            <Animated.View entering={ZoomIn.duration(400)} style={styles.fistBadge}>
              <Text style={{ fontSize: 28 }}>✊</Text>
            </Animated.View>
          )}
        </Animated.View>
        <Text style={styles.heroName}>{data.hero_name}</Text>

        {/* Battle cry text — word by word */}
        <View style={styles.cryBox}>
          <Text style={styles.cryText}>{shownText || "…"}</Text>
          {wordsShown >= words.length && (
            <Animated.Text entering={FadeIn.delay(200)} style={styles.meaningText}>
              💛 {data.meaning}
            </Animated.Text>
          )}
          {!!data.origin && wordsShown >= words.length && (
            <Animated.Text entering={FadeIn.delay(450)} style={styles.originText}>
              {data.origin}
            </Animated.Text>
          )}
        </View>

        {/* Prepare prompt */}
        {phase === "prepare" && (
          <Animated.Text entering={FadeInUp.duration(400)} style={styles.prompt}>
            Take a deep breath… and say it LOUD!
          </Animated.Text>
        )}

        {/* Mic button area */}
        {(phase === "prepare" || recording || phase === "shy") && (
          <View style={styles.micArea}>
            {recording && (
              <>
                <Animated.View style={[styles.micRing, ringAnim, { borderColor: "#22C55E" }]} />
              </>
            )}
            <Animated.View
              style={[
                styles.micBtnWrap,
                micAnim,
                { backgroundColor: recording ? "#22C55E" : C.saffron },
              ]}
            >
              <TouchableOpacity
                style={styles.micBtn}
                onPress={recording ? stopAndCelebrate : tapMic}
                testID="mic-btn"
                activeOpacity={0.85}
              >
                <Ionicons name={recording ? "stop" : "mic"} size={48} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.micHint}>
              {recording ? "🎤 Recording… tap to finish (or wait 5s)" : "Tap the mic to begin"}
            </Text>
            {phase === "shy" && (
              <Animated.View entering={FadeIn} style={styles.shyChip}>
                <Text style={styles.shyTxt}>
                  It's okay! Even a whisper counts. Try again! 🤫
                </Text>
              </Animated.View>
            )}
            {permissionDenied && (
              <TouchableOpacity
                style={styles.altBtn}
                onPress={celebrate}
                testID="tap-celebrate-btn"
              >
                <Text style={styles.altBtnTxt}>🎉 Tap to Celebrate</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Celebration modal */}
      <Modal visible={isCelebrate && !!reward} transparent animationType="fade">
        <View style={styles.celBg}>
          <TricolorConfetti />
          <Animated.View entering={ZoomIn.duration(450)} style={styles.celCard}>
            <Text style={styles.celEmoji}>🦁</Text>
            <Text style={styles.celTitle}>Incredible!</Text>
            <Text style={styles.celSub}>
              You sound just like a freedom fighter!
            </Text>
            <Animated.View entering={SlideInDown.delay(400)} style={styles.badgeCard}>
              <Text style={styles.badgeEmoji}>🏅</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.badgeLabel}>Battle Cry Badge Earned</Text>
                <Text style={styles.badgeName} numberOfLines={1}>
                  {data.hero_name}
                </Text>
              </View>
              <View style={styles.xpChip}>
                <Ionicons name="star" size={14} color={C.navy} />
                <Text style={styles.xpTxt}>+{reward?.xp || 10}</Text>
              </View>
            </Animated.View>
            {reward?.freedom_voice && (
              <Animated.View entering={SlideInDown.delay(800)} style={styles.megaBadge}>
                <Text style={styles.megaEmoji}>🏆</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.megaLabel}>MEGA BADGE UNLOCKED</Text>
                  <Text style={styles.megaName}>The Freedom Voice</Text>
                  <Text style={styles.megaSub}>You spoke for India!</Text>
                </View>
              </Animated.View>
            )}
            <View style={styles.celBtnRow}>
              <TouchableOpacity style={styles.celBtnGhost} onPress={sayAgain} testID="say-again">
                <Ionicons name="refresh" size={16} color={C.white} />
                <Text style={styles.celBtnGhostTxt}>Say it Again!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.celBtnSolid} onPress={goNext} testID="continue-btn">
                <Text style={styles.celBtnSolidTxt}>Continue</Text>
                <Ionicons name="arrow-forward" size={18} color={C.navy} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- Golden floating sparks background ---
function Sparks() {
  const sparks = Array.from({ length: 14 });
  return (
    <View pointerEvents="none" style={styles.sparkLayer}>
      {sparks.map((_, i) => <Spark key={i} index={i} />)}
    </View>
  );
}
function Spark({ index }: { index: number }) {
  const ty = useSharedValue(SH + 50);
  const op = useSharedValue(0);
  useEffect(() => {
    const startDelay = (index * 350) % 4000;
    const fall = () => {
      ty.value = SH + 50;
      op.value = 0;
      ty.value = withDelay(
        startDelay,
        withTiming(-60, { duration: 6000 + (index % 5) * 600, easing: Easing.linear })
      );
      op.value = withDelay(startDelay, withTiming(1, { duration: 800 }));
      setTimeout(() => { op.value = withTiming(0, { duration: 1200 }); }, startDelay + 5200);
    };
    fall();
    const interval = setInterval(fall, 6500);
    return () => clearInterval(interval);
  }, [index, ty, op]);
  const left = (index * 73) % SW;
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
    opacity: op.value,
  }));
  return <Animated.Text style={[styles.spark, { left }, style]}>✨</Animated.Text>;
}

// --- Tricolor confetti ---
function TricolorConfetti() {
  const items = Array.from({ length: 28 });
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {items.map((_, i) => <ConfettiPiece key={i} index={i} />)}
    </View>
  );
}
function ConfettiPiece({ index }: { index: number }) {
  const colors = ["#FF7A1A", "#FFFFFF", "#138808"];
  const ty = useSharedValue(-50);
  const tx = useSharedValue(0);
  const rot = useSharedValue(0);
  const op = useSharedValue(0);
  useEffect(() => {
    const startX = ((index * 41) % SW) - SW / 2;
    op.value = withTiming(1, { duration: 100 });
    tx.value = withTiming(startX, { duration: 2200 });
    ty.value = withTiming(SH + 60, { duration: 2400, easing: Easing.linear });
    rot.value = withRepeat(withTiming(360, { duration: 900 }), -1);
    setTimeout(() => { op.value = withTiming(0, { duration: 400 }); }, 2000);
  }, [op, tx, ty, rot, index]);
  const style = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${rot.value}deg` },
    ],
  }));
  return (
    <Animated.View
      style={[
        { position: "absolute", top: 0, left: SW / 2, width: 9, height: 14, borderRadius: 2 },
        { backgroundColor: colors[index % 3] },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#0B1437" },
  sparkLayer: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  spark: { position: "absolute", fontSize: 20 },
  skipBtn: {
    position: "absolute", top: 50, right: 16, zIndex: 20,
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: "#FFFFFF22", borderRadius: 999,
    borderWidth: 1.5, borderColor: "#FFFFFF66",
  },
  skipTxt: { color: "#FFFFFFCC", fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  scroll: { alignItems: "center", paddingTop: 40, paddingBottom: 100, paddingHorizontal: 22 },
  portraitWrap: {
    width: 160, height: 160, borderRadius: 80,
    overflow: "hidden", borderWidth: 4,
    backgroundColor: "#1F2A52",
    ...SHADOW,
  },
  portrait: { width: "100%", height: "100%" },
  fistBadge: {
    position: "absolute", bottom: -8, right: -8,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#FFD93D", justifyContent: "center", alignItems: "center",
    borderWidth: 3, borderColor: "#0B1437",
  },
  heroName: {
    color: "#FFD93D", fontWeight: "900", fontSize: 20,
    marginTop: 14, marginBottom: 18, textAlign: "center",
    letterSpacing: 0.5,
  },
  cryBox: { alignItems: "center", maxWidth: 360, marginBottom: 28 },
  cryText: {
    color: "#FFFFFF", fontSize: 30, fontWeight: "900",
    textAlign: "center", lineHeight: 38, minHeight: 80,
  },
  meaningText: {
    color: "#FFD93D", fontSize: 15, fontWeight: "700",
    textAlign: "center", marginTop: 14, fontStyle: "italic",
  },
  originText: {
    color: "#FFFFFF99", fontSize: 12, fontWeight: "600",
    textAlign: "center", marginTop: 6,
  },
  prompt: {
    color: "#FFFFFF", fontSize: 16, fontWeight: "800",
    textAlign: "center", marginBottom: 18,
    backgroundColor: "#FFFFFF18", paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 999, overflow: "hidden",
  },
  micArea: { alignItems: "center", marginTop: 6 },
  micBtnWrap: {
    width: 112, height: 112, borderRadius: 56,
    justifyContent: "center", alignItems: "center",
    borderWidth: 5, borderColor: "#FFD93D",
    shadowColor: "#FFD93D", shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  micBtn: {
    width: "100%", height: "100%",
    justifyContent: "center", alignItems: "center",
  },
  micRing: {
    position: "absolute",
    width: 112, height: 112, borderRadius: 56,
    borderWidth: 3,
  },
  micHint: {
    color: "#FFFFFFCC", fontSize: 12, fontWeight: "700",
    marginTop: 16, textAlign: "center",
  },
  shyChip: {
    backgroundColor: "#FFFFFF22", paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, marginTop: 14, borderWidth: 1.5, borderColor: "#FFD93D",
  },
  shyTxt: { color: "#FFD93D", fontWeight: "800", fontSize: 13 },
  altBtn: {
    backgroundColor: "#FFD93D", paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 999, marginTop: 18, borderWidth: 2, borderColor: "#FFFFFF",
  },
  altBtnTxt: { color: "#0B1437", fontWeight: "900", fontSize: 14 },
  // Celebration modal
  celBg: {
    flex: 1, backgroundColor: "#0B1437DD",
    justifyContent: "center", alignItems: "center", padding: 22,
  },
  celCard: {
    backgroundColor: "#0B1437", borderRadius: 28, padding: 24,
    borderWidth: 3, borderColor: "#FFD93D",
    alignItems: "center", maxWidth: 360, width: "100%",
    ...SHADOW,
  },
  celEmoji: { fontSize: 56 },
  celTitle: { color: "#FFD93D", fontSize: 32, fontWeight: "900", marginTop: 8 },
  celSub: {
    color: "#FFFFFF", fontSize: 14, fontWeight: "700",
    marginTop: 6, textAlign: "center",
  },
  badgeCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#FFFFFF15",
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 18, borderWidth: 2, borderColor: "#FFD93D",
    marginTop: 22, width: "100%",
  },
  badgeEmoji: { fontSize: 34 },
  badgeLabel: { color: "#FFD93D", fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  badgeName: { color: "#FFFFFF", fontSize: 15, fontWeight: "900", marginTop: 2 },
  xpChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#FFD93D", paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999,
  },
  xpTxt: { color: "#0B1437", fontWeight: "900", fontSize: 12 },
  megaBadge: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#FFD93D",
    paddingHorizontal: 14, paddingVertical: 12,
    borderRadius: 18, borderWidth: 3, borderColor: "#FF7A1A",
    marginTop: 12, width: "100%",
  },
  megaEmoji: { fontSize: 38 },
  megaLabel: { color: "#0B1437", fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  megaName: { color: "#0B1437", fontSize: 17, fontWeight: "900", marginTop: 2 },
  megaSub: { color: "#0B1437DD", fontSize: 11, fontWeight: "700", marginTop: 2 },
  celBtnRow: { flexDirection: "row", gap: 10, marginTop: 22, width: "100%" },
  celBtnGhost: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    backgroundColor: "transparent", paddingVertical: 12,
    borderRadius: 999, borderWidth: 2, borderColor: "#FFFFFFAA",
  },
  celBtnGhostTxt: { color: "#FFFFFF", fontWeight: "900", fontSize: 13 },
  celBtnSolid: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    backgroundColor: "#FFD93D", paddingVertical: 12,
    borderRadius: 999, borderWidth: 2, borderColor: "#FFFFFF",
  },
  celBtnSolidTxt: { color: "#0B1437", fontWeight: "900", fontSize: 13 },
});
