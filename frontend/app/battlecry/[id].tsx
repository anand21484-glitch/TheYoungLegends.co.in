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
} from "react-native-reanimated";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { API, PORTRAITS } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

const { width: SW, height: SH } = Dimensions.get("window");

const drumMod = require("../../assets/audio/drumroll.mp3");
const cheerMod = require("../../assets/audio/crowd_cheer.mp3");
const chimeMod = require("../../assets/audio/badge_chime.mp3");

type Cry = {
  hero_id: string; hero_name: string; hero_color: string;
  portrait_url: string | null; cry: string; meaning: string;
  origin: string; completed: boolean; badge_id: string;
};

type Phase = "intro" | "reveal" | "prepare" | "countdown" | "recording" | "processing" | "celebrate";

const REC_DURATION_MS = 10000;
const COUNTDOWN_VALUES = [3, 2, 1, 0]; // 0 = "GO!"

export default function BattleCryScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const router = useRouter();

  const [data, setData] = useState<Cry | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("intro");
  const [wordsShown, setWordsShown] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [ttsActive, setTtsActive] = useState(false);
  const [micReady, setMicReady] = useState(false); // shown after TTS done
  const [reward, setReward] = useState<{ xp: number; badge: string; freedom_voice: boolean } | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const replaySoundRef = useRef<Audio.Sound | null>(null);
  const drumRef = useRef<Audio.Sound | null>(null);
  const cheerRef = useRef<Audio.Sound | null>(null);
  const chimeRef = useRef<Audio.Sound | null>(null);
  const recTimerRef = useRef<any>(null);
  const countdownTimerRef = useRef<any>(null);
  const phaseRef = useRef<Phase>("intro");
  const introStartedRef = useRef(false);

  // Animated values
  const portraitScale = useSharedValue(0.4);
  const portraitOpacity = useSharedValue(0);
  const fistRotate = useSharedValue(0);
  const micPulse = useSharedValue(0);
  const ringScale1 = useSharedValue(0);
  const ringScale2 = useSharedValue(0);
  const countdownScale = useSharedValue(0);
  const countdownOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0); // 0→1 over REC_DURATION_MS

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Unload replay sound on unmount
  useEffect(() => {
    return () => { replaySoundRef.current?.unloadAsync().catch(() => {}); };
  }, []);

  // ── Load data + SFX ────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        }).catch(() => {});

        const r = await API.get(`/battle-cries/${id}`);
        setData(r.data);

        try {
          const d = await Audio.Sound.createAsync(drumMod, { volume: 0.85 });
          drumRef.current = d.sound;
          const c = await Audio.Sound.createAsync(cheerMod, { volume: 0.9 });
          cheerRef.current = c.sound;
          const ch = await Audio.Sound.createAsync(chimeMod, { volume: 0.85 });
          chimeRef.current = ch.sound;
        } catch {}
      } catch (e: any) {
        if (e?.response?.status === 404) { Alert.alert("No battle cry", "This hero doesn't have a battle cry."); router.back(); }
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      cleanup();
      Speech.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!loading && data && !introStartedRef.current) {
      introStartedRef.current = true;
      setTimeout(() => startIntro(data.cry), 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, data]);

  // ── Cleanup ────────────────────────────────────────────────────────────────
  const cleanup = async () => {
    if (recTimerRef.current) clearTimeout(recTimerRef.current);
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    try { await recordingRef.current?.stopAndUnloadAsync(); } catch {}
    recordingRef.current = null;
    try { await replaySoundRef.current?.unloadAsync(); } catch {}
    replaySoundRef.current = null;
    try { await drumRef.current?.unloadAsync(); } catch {}
    try { await cheerRef.current?.unloadAsync(); } catch {}
    try { await chimeRef.current?.unloadAsync(); } catch {}
  };

  const playSfx = async (ref: React.MutableRefObject<Audio.Sound | null>) => {
    if (Platform.OS === "web") return;
    try { await ref.current?.replayAsync(); } catch {}
  };

  // ── Choreography ──────────────────────────────────────────────────────────
  const startIntro = (cryText: string) => {
    setPhase("intro");
    playSfx(drumRef);
    portraitScale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.3)) });
    portraitOpacity.value = withTiming(1, { duration: 500 });
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
        setTimeout(() => startPrepare(cryText), 600);
      }
    };
    setTimeout(step, 0);
  };

  const startPrepare = (cryText: string) => {
    setPhase("prepare");
    setMicReady(false);
    micPulse.value = 0;

    // TTS — speak the cry so the child hears it
    if (Platform.OS !== "web") {
      setTtsActive(true);
      try {
        Speech.speak(cryText, {
          rate: 0.85,
          pitch: 1.0,
          onDone: () => { setTtsActive(false); showMicAfterTTS(); },
          onStopped: () => { setTtsActive(false); showMicAfterTTS(); },
          onError: () => { setTtsActive(false); showMicAfterTTS(); },
        });
      } catch {
        setTtsActive(false);
        showMicAfterTTS();
      }
      // Failsafe: show mic after 6 seconds regardless
      setTimeout(() => {
        setTtsActive(false);
        showMicAfterTTS();
      }, 6000);
    } else {
      // Web: skip TTS
      setTimeout(showMicAfterTTS, 600);
    }
  };

  const showMicAfterTTS = () => {
    if (phaseRef.current !== "prepare") return;
    setMicReady(true);
    micPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  };

  // ── Countdown ─────────────────────────────────────────────────────────────
  const tapMic = async () => {
    if (phaseRef.current === "recording" || phaseRef.current === "countdown") return;
    Speech.stop();
    setTtsActive(false);
    if (Platform.OS === "web") { celebrate(); return; }
    if (permissionDenied) { celebrate(); return; }

    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        setPermissionDenied(true);
        Alert.alert(
          "Mic needed",
          "Can I use your mic? I want to hear you roar like a freedom fighter! 🎤\n\nTap 'Tap to Celebrate' if you prefer.",
        );
        return;
      }
    } catch {
      celebrate(); return;
    }

    startCountdown();
  };

  const startCountdown = () => {
    setPhase("countdown");
    let idx = 0;
    setCountdown(COUNTDOWN_VALUES[0]);

    const animateNumber = () => {
      countdownScale.value = 0;
      countdownOpacity.value = 0;
      countdownScale.value = withSequence(
        withTiming(1.3, { duration: 200 }),
        withTiming(1.0, { duration: 300 }),
      );
      countdownOpacity.value = withTiming(1, { duration: 150 });
    };

    animateNumber();

    const tick = () => {
      idx++;
      if (idx < COUNTDOWN_VALUES.length) {
        // Fade out old, set new
        countdownOpacity.value = withTiming(0, { duration: 180 });
        setTimeout(() => {
          setCountdown(COUNTDOWN_VALUES[idx]);
          animateNumber();
          if (idx < COUNTDOWN_VALUES.length - 1) {
            countdownTimerRef.current = setTimeout(tick, 900);
          } else {
            // "GO!" — start recording after a brief moment
            countdownTimerRef.current = setTimeout(startRecording, 700);
          }
        }, 220);
      }
    };

    countdownTimerRef.current = setTimeout(tick, 900);
  };

  // ── Recording ─────────────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true }).catch(() => {});

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync({
        android: {
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        web: {},
        isMeteringEnabled: true,
      });
      await rec.startAsync();
      recordingRef.current = rec;

      setPhase("recording");
      progressWidth.value = 0;
      progressWidth.value = withTiming(1, { duration: REC_DURATION_MS, easing: Easing.linear });

      // Ring animations
      ringScale1.value = withRepeat(
        withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: 1100, easing: Easing.out(Easing.ease) })),
        -1,
      );
      ringScale2.value = withRepeat(
        withDelay(550, withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: 1100, easing: Easing.out(Easing.ease) }))),
        -1,
      );
      micPulse.value = withRepeat(
        withSequence(withTiming(1, { duration: 340 }), withTiming(0.5, { duration: 340 })),
        -1,
        true,
      );

      // ALWAYS wait full 10 seconds — no early skip
      recTimerRef.current = setTimeout(() => {
        if (phaseRef.current === "recording") stopAndProcess();
      }, REC_DURATION_MS);
    } catch {
      celebrate();
    }
  };

  const stopAndProcess = async () => {
    if (recTimerRef.current) clearTimeout(recTimerRef.current);
    ringScale1.value = withTiming(0, { duration: 200 });
    ringScale2.value = withTiming(0, { duration: 200 });

    const rec = recordingRef.current;
    recordingRef.current = null;

    try { await rec?.stopAndUnloadAsync(); } catch {}

    const uri = rec?.getURI() || null;
    // Android sometimes returns a bare path without file:// scheme
    const finalUri = uri
      ? (uri.startsWith("file://") ? uri : `file://${uri}`)
      : null;

    setRecordingUri(finalUri);
    setPhase("processing");

    // Allow React to flush recordingUri state before celebration modal renders
    await new Promise<void>((resolve) => setTimeout(resolve, 200));
    celebrate();
  };

  // ── Celebrate ─────────────────────────────────────────────────────────────
  const celebrate = async () => {
    setPhase("celebrate");
    playSfx(cheerRef);
    fistRotate.value = withRepeat(
      withSequence(
        withTiming(-14, { duration: 220 }),
        withTiming(14, { duration: 380 }),
        withTiming(0, { duration: 220 }),
      ),
      2,
      false,
    );
    setTimeout(() => playSfx(chimeRef), 700);
    try {
      const r = await API.post(`/battle-cries/${id}/complete`);
      setReward({ xp: r.data.xp_awarded || 0, badge: r.data.badge_awarded, freedom_voice: !!r.data.freedom_voice_awarded });
    } catch {
      setReward({ xp: 10, badge: `cry_${id}`, freedom_voice: false });
    }
  };

  // ── Replay ────────────────────────────────────────────────────────────────
  const replayVoice = async () => {
    if (!recordingUri) {
      Alert.alert("Recording not available", "Recording not available, please try again.");
      return;
    }
    try {
      // Always clean up any existing sound first
      if (replaySoundRef.current) {
        await replaySoundRef.current.stopAsync().catch(() => {});
        await replaySoundRef.current.unloadAsync().catch(() => {});
        replaySoundRef.current = null;
      }
      // Toggle off if already playing
      if (isReplaying) {
        setIsReplaying(false);
        return;
      }
      // Switch to playback mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
      }).catch(() => {});
      setIsReplaying(true);
      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      replaySoundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsReplaying(false);
          replaySoundRef.current = null;
          sound.unloadAsync().catch(() => {});
        }
      });
      await sound.playAsync();
    } catch {
      setIsReplaying(false);
    }
  };

  const sayAgain = () => {
    Speech.stop();
    setIsReplaying(false);
    try { replaySoundRef.current?.stopAsync(); } catch {}
    setWordsShown(data?.cry.split(/\s+/).length || 0);
    setReward(null);
    setRecordingUri(null);
    setPhase("prepare");
    setMicReady(false);
    introStartedRef.current = false;
    if (data) startPrepare(data.cry);
  };

  const goNext = () => {
    Speech.stop();
    if (from === "story") router.replace("/(tabs)/library" as any);
    else router.back();
  };

  // ── Animated styles ───────────────────────────────────────────────────────
  const portraitAnim = useAnimatedStyle(() => ({
    transform: [{ scale: portraitScale.value }, { rotate: `${fistRotate.value}deg` }],
    opacity: portraitOpacity.value,
  }));
  const micAnim = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + micPulse.value * 0.11 }],
    shadowOpacity: 0.5 + micPulse.value * 0.4,
  }));
  const ring1Anim = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + ringScale1.value * 1.6 }],
    opacity: (1 - ringScale1.value) * 0.7,
  }));
  const ring2Anim = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + ringScale2.value * 1.6 }],
    opacity: (1 - ringScale2.value) * 0.7,
  }));
  const countdownAnim = useAnimatedStyle(() => ({
    transform: [{ scale: countdownScale.value }],
    opacity: countdownOpacity.value,
  }));
  const progressAnim = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%` as any,
  }));

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading || !data) {
    return (
      <SafeAreaView style={[s.c, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#FFD93D" />
      </SafeAreaView>
    );
  }

  const words = data.cry.split(/\s+/).filter(Boolean);
  const shownText = words.slice(0, wordsShown).join(" ");
  const isCelebrate = phase === "celebrate";
  const isRecording = phase === "recording";
  const isCountdown = phase === "countdown";
  const isProcessing = phase === "processing";

  return (
    <SafeAreaView style={s.c} edges={["top", "bottom"]}>
      <Sparks />

      <TouchableOpacity style={s.skipBtn} onPress={() => router.back()} testID="cry-skip">
        <Text style={s.skipTxt}>Skip</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={s.scroll} testID="cry-scroll" scrollEnabled={!isCountdown && !isRecording}>

        {/* Portrait */}
        <Animated.View style={[s.portraitWrap, portraitAnim, { borderColor: data.hero_color }]}>
          {PORTRAITS[data.hero_id] ? (
            <Image source={PORTRAITS[data.hero_id]} style={s.portrait} />
          ) : (
            <View style={[s.portrait, { backgroundColor: data.hero_color }]} />
          )}
          {isCelebrate && (
            <Animated.View entering={ZoomIn.duration(400)} style={s.fistBadge}>
              <Text style={{ fontSize: 28 }}>✊</Text>
            </Animated.View>
          )}
        </Animated.View>
        <Text style={s.heroName}>{data.hero_name}</Text>

        {/* Battle cry text */}
        {!isCountdown && !isRecording && !isProcessing && (
          <View style={s.cryBox}>
            <Text style={s.cryText}>{shownText || "…"}</Text>
            {wordsShown >= words.length && (
              <Animated.Text entering={FadeIn.delay(200)} style={s.meaningText}>
                💛 {data.meaning}
              </Animated.Text>
            )}
            {!!data.origin && wordsShown >= words.length && (
              <Animated.Text entering={FadeIn.delay(450)} style={s.originText}>
                {data.origin}
              </Animated.Text>
            )}
          </View>
        )}

        {/* Prepare phase */}
        {phase === "prepare" && (
          <Animated.View entering={FadeInUp.duration(350)} style={{ alignItems: "center", width: "100%" }}>
            {ttsActive && (
              <View style={s.ttsChip}>
                <Ionicons name="volume-high" size={18} color="#FFD93D" />
                <Text style={s.ttsTxt}>🎵 Listen first…</Text>
              </View>
            )}
            {micReady && !ttsActive && (
              <>
                <Text style={s.prompt}>
                  Now YOUR turn! Take a deep breath and say it LOUD! 🎤
                </Text>
                <View style={s.micArea}>
                  <Animated.View style={[s.micBtnWrap, micAnim, { backgroundColor: C.saffron }]}>
                    <TouchableOpacity
                      style={s.micBtn}
                      onPress={tapMic}
                      testID="mic-btn"
                      activeOpacity={0.85}
                    >
                      <Ionicons name="mic" size={48} color="#FFFFFF" />
                    </TouchableOpacity>
                  </Animated.View>
                  <Text style={s.micHint}>Tap the mic to start</Text>
                  {permissionDenied && (
                    <TouchableOpacity style={s.altBtn} onPress={celebrate} testID="tap-celebrate-btn">
                      <Text style={s.altBtnTxt}>🎉 Tap to Celebrate</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </Animated.View>
        )}

        {/* Countdown phase */}
        {isCountdown && (
          <View style={s.countdownWrap}>
            <Animated.Text style={[s.countdownNum, countdownAnim]}>
              {countdown === 0 ? "GO!" : String(countdown)}
            </Animated.Text>
            <Text style={s.countdownLabel}>
              {countdown === 0 ? "Say it NOW! 💪" : "Get ready…"}
            </Text>
          </View>
        )}

        {/* Recording phase */}
        {isRecording && (
          <View style={{ alignItems: "center", width: "100%" }}>
            <View style={s.micArea}>
              {/* Ring animations */}
              <Animated.View style={[s.micRing, ring1Anim, { borderColor: "#22C55E" }]} />
              <Animated.View style={[s.micRing, ring2Anim, { borderColor: "#22C55E" }]} />
              <Animated.View style={[s.micBtnWrap, micAnim, { backgroundColor: "#22C55E", borderColor: "#22C55E" }]}>
                <View style={s.micBtn}>
                  <Ionicons name="mic" size={48} color="#FFFFFF" />
                </View>
              </Animated.View>
            </View>

            {/* 10-second progress bar */}
            <View style={s.progressWrap}>
              <Animated.View style={[s.progressFill, progressAnim]} />
            </View>
            <Text style={s.recHint}>Keep going… say it again LOUDER! 💪</Text>

            {/* Show the cry text during recording */}
            <View style={[s.cryBox, { marginTop: 16 }]}>
              <Text style={[s.cryText, { fontSize: 22 }]}>{data.cry}</Text>
            </View>
          </View>
        )}

        {/* Processing phase */}
        {isProcessing && (
          <Animated.View entering={FadeIn.duration(300)} style={{ alignItems: "center", gap: 16, marginTop: 12 }}>
            <Text style={s.processingText}>Amazing! Let me save your roar… 🔥</Text>
            <ActivityIndicator size="large" color="#FFD93D" />
          </Animated.View>
        )}
      </ScrollView>

      {/* Celebration modal */}
      <Modal visible={isCelebrate && !!reward} transparent animationType="fade">
        <View style={s.celBg}>
          <TricolorConfetti />
          <Animated.View entering={ZoomIn.duration(450)} style={s.celCard}>
            <Text style={s.celEmoji}>🦁</Text>
            <Text style={s.celTitle}>Incredible!</Text>
            <Text style={s.celSub}>
              You sound just like a freedom fighter!
            </Text>

            <Animated.View entering={SlideInDown.delay(400)} style={s.badgeCard}>
              <Text style={s.badgeEmoji}>🏅</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.badgeLabel}>BATTLE CRY BADGE EARNED</Text>
                <Text style={s.badgeName} numberOfLines={1}>{data.hero_name}</Text>
              </View>
              <View style={s.xpChip}>
                <Ionicons name="star" size={14} color="#0B1437" />
                <Text style={s.xpTxt}>+{reward?.xp || 10}</Text>
              </View>
            </Animated.View>

            {reward?.freedom_voice && (
              <Animated.View entering={SlideInDown.delay(800)} style={s.megaBadge}>
                <Text style={s.megaEmoji}>🏆</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.megaLabel}>MEGA BADGE UNLOCKED</Text>
                  <Text style={s.megaName}>The Freedom Voice</Text>
                  <Text style={s.megaSub}>You spoke for India!</Text>
                </View>
              </Animated.View>
            )}

            {/* Replay — always visible; greyed out while URI is loading */}
            <Animated.View entering={FadeIn.delay(600)} style={s.replaySection}>
              <Waveform isPlaying={isReplaying} />
              {isReplaying && (
                <Text style={s.replayCaption}>
                  That's YOUR voice! The voice of a freedom fighter! 🇮🇳
                </Text>
              )}
              <TouchableOpacity
                onPress={recordingUri ? replayVoice : undefined}
                disabled={!recordingUri}
                style={[
                  s.replayBtn,
                  isReplaying && s.replayBtnActive,
                  !recordingUri && s.replayBtnDisabled,
                ]}
                testID="replay-btn"
                activeOpacity={0.85}
              >
                <Ionicons
                  name={isReplaying ? "volume-high" : "play-circle"}
                  size={22}
                  color={recordingUri ? "#0B1437" : "#999999"}
                />
                <Text style={[s.replayBtnTxt, !recordingUri && s.replayBtnTxtDim]}>
                  {!recordingUri
                    ? "🎤 Loading your roar..."
                    : isReplaying
                    ? "🔊 Playing... (tap to stop)"
                    : "🔁 Hear Your Roar!"}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={s.celBtnRow}>
              <TouchableOpacity style={s.celBtnGhost} onPress={sayAgain} testID="say-again">
                <Ionicons name="refresh" size={16} color="#FFFFFF" />
                <Text style={s.celBtnGhostTxt}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.celBtnSolid} onPress={goNext} testID="continue-btn">
                <Text style={s.celBtnSolidTxt}>Continue</Text>
                <Ionicons name="arrow-forward" size={18} color="#0B1437" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Waveform ────────────────────────────────────────────────────────────────
const WAVE_HEIGHTS = [0.5, 0.8, 0.65, 1.0, 0.55, 0.9, 0.6];

function WaveBar({ maxH, isPlaying, delay }: { maxH: number; isPlaying: boolean; delay: number }) {
  const h = useSharedValue(0.15);
  useEffect(() => {
    if (isPlaying) {
      h.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(maxH, { duration: 260 }),
            withTiming(0.15, { duration: 260 }),
          ),
          -1,
          true,
        ),
      );
    } else {
      h.value = withTiming(0.15, { duration: 200 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);
  const style = useAnimatedStyle(() => ({ height: h.value * 38 }));
  return <Animated.View style={[s.waveBar, style]} />;
}

function Waveform({ isPlaying }: { isPlaying: boolean }) {
  return (
    <View style={s.waveWrap}>
      {WAVE_HEIGHTS.map((h, i) => (
        <WaveBar key={i} maxH={h} isPlaying={isPlaying} delay={i * 70} />
      ))}
    </View>
  );
}

// ── Background sparks ────────────────────────────────────────────────────────
function Sparks() {
  return (
    <View pointerEvents="none" style={s.sparkLayer}>
      {Array.from({ length: 12 }).map((_, i) => <Spark key={i} index={i} />)}
    </View>
  );
}
function Spark({ index }: { index: number }) {
  const ty = useSharedValue(SH + 50);
  const op = useSharedValue(0);
  useEffect(() => {
    const delay = (index * 350) % 4000;
    const run = () => {
      ty.value = SH + 50; op.value = 0;
      ty.value = withDelay(delay, withTiming(-60, { duration: 6000 + (index % 5) * 600, easing: Easing.linear }));
      op.value = withDelay(delay, withTiming(1, { duration: 800 }));
      setTimeout(() => { op.value = withTiming(0, { duration: 1200 }); }, delay + 5200);
    };
    run();
    const interval = setInterval(run, 6500);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);
  const anim = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
    opacity: op.value,
  }));
  return <Animated.Text style={[s.spark, { left: (index * 73) % SW }, anim]}>✨</Animated.Text>;
}

// ── Tricolor confetti ────────────────────────────────────────────────────────
function TricolorConfetti() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: 28 }).map((_, i) => <ConfettiPiece key={i} index={i} />)}
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { rotate: `${rot.value}deg` }],
  }));
  return (
    <Animated.View
      style={[{
        position: "absolute", top: 0, left: SW / 2, width: 9, height: 14, borderRadius: 2,
        backgroundColor: colors[index % 3],
      }, style]}
    />
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#0B1437" },
  sparkLayer: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  spark: { position: "absolute", fontSize: 20 },
  skipBtn: {
    position: "absolute", top: 50, right: 16, zIndex: 20,
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: "#FFFFFF22", borderRadius: 999, borderWidth: 1.5, borderColor: "#FFFFFF66",
  },
  skipTxt: { color: "#FFFFFFCC", fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  scroll: { alignItems: "center", paddingTop: 40, paddingBottom: 100, paddingHorizontal: 22 },
  portraitWrap: {
    width: 150, height: 150, borderRadius: 75,
    overflow: "hidden", borderWidth: 4, backgroundColor: "#1F2A52", ...SHADOW,
  },
  portrait: { width: "100%", height: "100%" },
  fistBadge: {
    position: "absolute", bottom: -8, right: -8, width: 52, height: 52, borderRadius: 26,
    backgroundColor: "#FFD93D", justifyContent: "center", alignItems: "center",
    borderWidth: 3, borderColor: "#0B1437",
  },
  heroName: {
    color: "#FFD93D", fontWeight: "900", fontSize: 20,
    marginTop: 14, marginBottom: 18, textAlign: "center",
  },
  cryBox: { alignItems: "center", maxWidth: 360, marginBottom: 20 },
  cryText: {
    color: "#FFFFFF", fontSize: 28, fontWeight: "900",
    textAlign: "center", lineHeight: 36, minHeight: 60,
  },
  meaningText: { color: "#FFD93D", fontSize: 14, fontWeight: "700", textAlign: "center", marginTop: 12, fontStyle: "italic" },
  originText: { color: "#FFFFFF88", fontSize: 12, fontWeight: "600", textAlign: "center", marginTop: 6 },
  // Prepare
  ttsChip: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#FFFFFF15", paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 999, borderWidth: 1.5, borderColor: "#FFD93D44", marginBottom: 12,
  },
  ttsTxt: { color: "#FFD93D", fontWeight: "800", fontSize: 14 },
  prompt: {
    color: "#FFFFFF", fontSize: 15, fontWeight: "800", textAlign: "center",
    marginBottom: 20, backgroundColor: "#FFFFFF18", paddingHorizontal: 16,
    paddingVertical: 10, borderRadius: 999, overflow: "hidden",
    lineHeight: 22,
  },
  micArea: { alignItems: "center", marginTop: 8 },
  micBtnWrap: {
    width: 110, height: 110, borderRadius: 55,
    justifyContent: "center", alignItems: "center",
    borderWidth: 5, borderColor: "#FFD93D",
    shadowColor: "#FFD93D", shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 }, elevation: 12,
  },
  micBtn: { width: "100%", height: "100%", justifyContent: "center", alignItems: "center" },
  micRing: {
    position: "absolute", width: 110, height: 110, borderRadius: 55, borderWidth: 3,
  },
  micHint: { color: "#FFFFFFCC", fontSize: 12, fontWeight: "700", marginTop: 16, textAlign: "center" },
  altBtn: {
    backgroundColor: "#FFD93D", paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 999, marginTop: 18, borderWidth: 2, borderColor: "#FFFFFF",
  },
  altBtnTxt: { color: "#0B1437", fontWeight: "900", fontSize: 14 },
  // Countdown
  countdownWrap: { alignItems: "center", marginTop: 16, gap: 10 },
  countdownNum: {
    color: "#FFD93D", fontSize: 96, fontWeight: "900", lineHeight: 108,
    textShadowColor: "#FFD93D88", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 24,
  },
  countdownLabel: { color: "#FFFFFF", fontSize: 18, fontWeight: "800", letterSpacing: 0.5 },
  // Recording
  progressWrap: {
    width: SW - 80, height: 14, backgroundColor: "#FFFFFF22",
    borderRadius: 7, overflow: "hidden", marginTop: 24,
    borderWidth: 1, borderColor: "#FFFFFF44",
  },
  progressFill: { height: "100%", backgroundColor: C.saffron, borderRadius: 7 },
  recHint: { color: "#FFFFFF", fontSize: 14, fontWeight: "800", marginTop: 14, textAlign: "center" },
  // Processing
  processingText: {
    color: "#FFD93D", fontSize: 20, fontWeight: "900", textAlign: "center",
    marginTop: 12,
  },
  // Celebration
  celBg: {
    flex: 1, backgroundColor: "#0B1437EE",
    justifyContent: "center", alignItems: "center", padding: 18,
  },
  celCard: {
    backgroundColor: "#0B1437", borderRadius: 28, padding: 22,
    borderWidth: 3, borderColor: "#FFD93D",
    alignItems: "center", maxWidth: 380, width: "100%", ...SHADOW,
  },
  celEmoji: { fontSize: 52 },
  celTitle: { color: "#FFD93D", fontSize: 30, fontWeight: "900", marginTop: 6 },
  celSub: { color: "#FFFFFF", fontSize: 13, fontWeight: "700", marginTop: 6, textAlign: "center" },
  badgeCard: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "#FFFFFF15", paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 16, borderWidth: 2, borderColor: "#FFD93D", marginTop: 18, width: "100%",
  },
  badgeEmoji: { fontSize: 30 },
  badgeLabel: { color: "#FFD93D", fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  badgeName: { color: "#FFFFFF", fontSize: 14, fontWeight: "900", marginTop: 2 },
  xpChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#FFD93D", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
  },
  xpTxt: { color: "#0B1437", fontWeight: "900", fontSize: 12 },
  megaBadge: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#FFD93D", paddingHorizontal: 12, paddingVertical: 10,
    borderRadius: 16, borderWidth: 3, borderColor: "#FF7A1A", marginTop: 10, width: "100%",
  },
  megaEmoji: { fontSize: 36 },
  megaLabel: { color: "#0B1437", fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  megaName: { color: "#0B1437", fontSize: 16, fontWeight: "900", marginTop: 2 },
  megaSub: { color: "#0B1437CC", fontSize: 10, fontWeight: "700", marginTop: 2 },
  // Replay
  replaySection: { width: "100%", alignItems: "center", marginTop: 16, gap: 8 },
  waveWrap: { flexDirection: "row", gap: 5, height: 42, alignItems: "center", paddingVertical: 4 },
  waveBar: { width: 6, backgroundColor: C.saffron, borderRadius: 3 },
  replayCaption: {
    color: "#FFD93DCC", fontSize: 11, fontWeight: "700", textAlign: "center", fontStyle: "italic",
  },
  replayBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#FFD93D", paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 999, borderWidth: 2, borderColor: "#FFFFFF",
  },
  replayBtnActive: { backgroundColor: "#138808" },
  replayBtnDisabled: { backgroundColor: "#555566", borderColor: "#888899" },
  replayBtnTxt: { color: "#0B1437", fontWeight: "900", fontSize: 13 },
  replayBtnTxtDim: { color: "#CCCCCC" },
  // Buttons
  celBtnRow: { flexDirection: "row", gap: 10, marginTop: 18, width: "100%" },
  celBtnGhost: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    paddingVertical: 12, borderRadius: 999, borderWidth: 2, borderColor: "#FFFFFF88",
  },
  celBtnGhostTxt: { color: "#FFFFFF", fontWeight: "900", fontSize: 13 },
  celBtnSolid: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    backgroundColor: "#FFD93D", paddingVertical: 12,
    borderRadius: 999, borderWidth: 2, borderColor: "#FFFFFF",
  },
  celBtnSolidTxt: { color: "#0B1437", fontWeight: "900", fontSize: 13 },
});
