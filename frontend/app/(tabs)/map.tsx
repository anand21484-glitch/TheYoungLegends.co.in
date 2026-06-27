import { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  Modal, Pressable, Dimensions, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, G, Path } from "react-native-svg";
import { Audio } from "expo-av";
import Animated, {
  useSharedValue, useAnimatedProps, withRepeat, withTiming,
  FadeInUp, ZoomIn, Easing,
} from "react-native-reanimated";
import { API, PORTRAITS } from "../../src/api";
import { C, SHADOW } from "../../src/theme";
import LOCAL_MAP from "../../src/data/freedom_map.json";
import { IndiaMapSvg } from "../../src/components/IndiaMapSvg";

const { width: SW, height: SH } = Dimensions.get("window");

const SVG_VIEW_W = 612;
const SVG_VIEW_H = 696;

// Replicate the same equirectangular projection used by the backend
const LON_MIN = 68, LON_MAX = 97, LAT_MAX = 37, LAT_MIN = 8;
function latLonToXY(lat: number, lon: number, dx: number, dy: number) {
  const x = (lon - LON_MIN) / (LON_MAX - LON_MIN) * SVG_VIEW_W + dx;
  const y = (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * SVG_VIEW_H + dy;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

type Hero = {
  hero_id: string; name: string; state: string; x: number; y: number;
  short_line: string; has_story: boolean; story_id: string | null;
  portrait_url: string; discovered: boolean;
};

// Build heroes from bundled JSON — works 100% offline
const LOCAL_HEROES: Hero[] = (LOCAL_MAP.fighters as any[]).map((f) => {
  const [hero_id, name, state, lat, lon, short_line, dx, dy, story_id] = f;
  const { x, y } = latLonToXY(lat, lon, dx, dy);
  return {
    hero_id, name, state, x, y, short_line,
    has_story: story_id !== null && story_id !== undefined,
    story_id: story_id ?? null,
    portrait_url: "",
    discovered: false,
  };
});

// -- Sounds ----------------------------------------------------------------
const chimeMod = require("../../assets/audio/chime.mp3");
const winMod = require("../../assets/audio/win.mp3");
let _chime: Audio.Sound | null = null;
let _win: Audio.Sound | null = null;

async function loadSounds() {
  try {
    if (!_chime) { const { sound } = await Audio.Sound.createAsync(chimeMod, { volume: 0.7 }); _chime = sound; }
    if (!_win) { const { sound } = await Audio.Sound.createAsync(winMod, { volume: 0.9 }); _win = sound; }
  } catch {}
}
async function unloadSounds() {
  try { await _chime?.unloadAsync(); _chime = null; } catch {}
  try { await _win?.unloadAsync(); _win = null; } catch {}
}
async function playChime() { if (Platform.OS === "web") return; try { await _chime?.replayAsync(); } catch {} }
async function playWin() { if (Platform.OS === "web") return; try { await _win?.replayAsync(); } catch {} }

// -- Pulsing dot -----------------------------------------------------------
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function PulsingDot({ hero, onPress }: { hero: Hero; onPress: () => void }) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [pulse]);

  const outerProps = useAnimatedProps(() => ({ r: 14 + pulse.value * 10, opacity: 0.55 - pulse.value * 0.45 }));
  const midProps = useAnimatedProps(() => ({ r: 9 + pulse.value * 4, opacity: 0.75 - pulse.value * 0.25 }));

  if (hero.discovered) {
    return (
      <G onPress={onPress}>
        <AnimatedCircle cx={hero.x} cy={hero.y} fill="#FFD93D" animatedProps={outerProps} />
        <Circle cx={hero.x} cy={hero.y} r={10} fill="#FFD93D" stroke="#3D2914" strokeWidth={1.2} />
        <Path d={starPath(hero.x, hero.y, 7, 3)} fill="#FFFFFF" stroke="#3D2914" strokeWidth={0.6} />
        {/* Large transparent tap target — must be last so it sits on top */}
        <Circle cx={hero.x} cy={hero.y} r={22} fill="transparent" />
      </G>
    );
  }
  return (
    <G onPress={onPress}>
      <AnimatedCircle cx={hero.x} cy={hero.y} fill="#FF7A1A" animatedProps={outerProps} />
      <AnimatedCircle cx={hero.x} cy={hero.y} fill="#FFB347" animatedProps={midProps} />
      <Circle cx={hero.x} cy={hero.y} r={6.5} fill="#FF7A1A" stroke="#3D2914" strokeWidth={1.2} />
      <Circle cx={hero.x} cy={hero.y} r={2.6} fill="#FFFFFF" />
      {/* Large transparent tap target — must be last so it sits on top */}
      <Circle cx={hero.x} cy={hero.y} r={22} fill="transparent" />
    </G>
  );
}

function starPath(cx: number, cy: number, rOuter: number, rInner: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts[0]} L${pts.slice(1).join(" L")} Z`;
}

// -- Main screen -----------------------------------------------------------
export default function FreedomMap() {
  const router = useRouter();
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [discoveredCount, setDiscoveredCount] = useState(0);
  const [total, setTotal] = useState(LOCAL_HEROES.length);
  const [selected, setSelected] = useState<Hero | null>(null);
  const [celebrated, setCelebrated] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const mapWidth = Math.min(SW - 24, 380);
  const mapHeight = mapWidth * (SVG_VIEW_H / SVG_VIEW_W);

  const load = useCallback(async () => {
    setHeroes(LOCAL_HEROES);
    setTotal(LOCAL_HEROES.length);
    try {
      const r = await API.get("/freedom-map");
      const data = r.data as { fighters: any[]; discovered_count: number; total: number };
      // Each fighter is a spread tuple — index 0 is the hero_id
      const discoveredSet = new Set<string>(
        (data.fighters as any[]).filter((h: any) => h.discovered).map((h: any) => String(h[0]))
      );
      setHeroes(LOCAL_HEROES.map((h) => ({ ...h, discovered: discoveredSet.has(h.hero_id) })));
      setDiscoveredCount(data.discovered_count ?? 0);
      setTotal(data.total || LOCAL_HEROES.length);
    } catch {
      // Offline — show local heroes undiscovered
    }
  }, []);

  useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true }).catch(() => {});
      await loadSounds();
      await load();
    })();
    return () => { unloadSounds(); };
  }, [load]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onTapDot = (h: Hero) => { playChime(); setSelected(h); };
  const closePopup = () => setSelected(null);

  const onMeetHero = async () => {
    if (!selected) return;
    const { hero_id: heroId, story_id: storyId, has_story: hasStory } = selected;
    try {
      const r = await API.post(`/freedom-map/discover/${heroId}`);
      const justAll = r.data.discovered_count >= total && !celebrated;
      setDiscoveredCount(r.data.discovered_count);
      setHeroes((prev) => prev.map((x) => (x.hero_id === heroId ? { ...x, discovered: true } : x)));
      if (justAll) {
        playWin();
        setCelebrated(true);
        setShowCelebration(true);
        setSelected(null);
        return;
      }
    } catch {}
    setSelected(null);
    if (hasStory && storyId) router.push(`/story/${storyId}` as any);
  };

  const progressPct = total > 0 ? (discoveredCount / total) * 100 : 0;

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      {/* Header — no back button since this is a tab */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>🗺️ Freedom Map</Text>
          <Text style={styles.headerSub}>Tap a glowing spot to meet a hero!</Text>
        </View>
        <View style={styles.counterPill}>
          <Ionicons name="star" size={14} color={C.gold} />
          <Text style={styles.counterTxt}>{discoveredCount}/{total}</Text>
        </View>
      </View>

      <View style={styles.progressOuter}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} testID="map-scroll">
        <Animated.View entering={FadeInUp.duration(400)} style={styles.intro}>
          <Text style={styles.introTxt}>🇮🇳 Tap the glowing dots to discover heroes from every corner of India!</Text>
          <Text style={styles.introHint}>⭐ Visited heroes turn into gold stars</Text>
        </Animated.View>

        <View style={[styles.mapCanvas, { width: mapWidth, height: mapHeight }]}>
          {/* Parchment background */}
          <View style={styles.parchment} />

          {/* India map outline — hardcoded SVG, no async loading, works on all platforms */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <IndiaMapSvg
              width={mapWidth}
              height={mapHeight}
              fillColor="#F4C430"
              strokeColor="#1A365D"
            />
          </View>

          {/* Hero dots — on top of map, tappable */}
          <Svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${SVG_VIEW_W} ${SVG_VIEW_H}`}
            style={StyleSheet.absoluteFill}
            pointerEvents="box-none"
          >
            {heroes.map((h) => (
              <PulsingDot key={h.hero_id} hero={h} onPress={() => onTapDot(h)} />
            ))}
          </Svg>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: C.saffron }]} />
            <Text style={styles.legendTxt}>Discover</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: "#FFD93D" }]} />
            <Text style={styles.legendTxt}>Found</Text>
          </View>
        </View>
      </ScrollView>

      {/* Hero popup */}
      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={closePopup}>
        <Pressable style={styles.modalBackdrop} onPress={closePopup}>
          {selected && (
            <Animated.View entering={ZoomIn.duration(300)} style={styles.popupCard}>
              <Pressable onPress={(e) => e.stopPropagation()}>
                <Text style={[styles.corner, styles.cornerTL]}>🪷</Text>
                <Text style={[styles.corner, styles.cornerTR]}>☸️</Text>
                <Text style={[styles.corner, styles.cornerBL]}>☸️</Text>
                <Text style={[styles.corner, styles.cornerBR]}>🪷</Text>

                <TouchableOpacity style={styles.closeX} onPress={closePopup} testID="popup-close">
                  <Ionicons name="close" size={22} color={C.navy} />
                </TouchableOpacity>

                <View style={styles.portraitWrap}>
                  <Image
                    source={PORTRAITS[selected.hero_id] || undefined}
                    style={styles.portrait}
                  />
                </View>
                <Text style={styles.heroName} numberOfLines={2}>{selected.name}</Text>
                <View style={styles.statePill}>
                  <Ionicons name="location" size={14} color={C.maroon} />
                  <Text style={styles.stateTxt}>{selected.state}</Text>
                </View>
                <Text style={styles.shortLine}>{selected.short_line}</Text>

                {!selected.has_story && (
                  <View style={styles.soonChip}>
                    <Text style={styles.soonTxt}>📖 Full story coming soon!</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.meetBtn, !selected.has_story && { backgroundColor: C.navy }]}
                  onPress={onMeetHero}
                  testID="meet-hero-btn"
                >
                  <Text style={styles.meetBtnTxt}>
                    {selected.has_story ? `Meet ${selected.name.split(" ")[0]}!` : "Discover & Continue"}
                  </Text>
                  <Ionicons name={selected.has_story ? "arrow-forward-circle" : "checkmark-circle"} size={20} color={C.white} />
                </TouchableOpacity>
              </Pressable>
            </Animated.View>
          )}
        </Pressable>
      </Modal>

      {/* Celebration overlay */}
      <Modal visible={showCelebration} transparent animationType="fade">
        <View style={styles.celebrationBg}>
          <TricolorConfetti />
          <Animated.View entering={ZoomIn.duration(500)} style={styles.celebrationCard}>
            <Text style={styles.celeEmoji}>🏅</Text>
            <Text style={styles.celeTitle}>You found all the Heroes of India!</Text>
            <Text style={styles.celeSub}>
              You discovered {total} freedom fighters from every corner of our country. Jai Hind! 🇮🇳
            </Text>
            <View style={styles.celeBadge}>
              <Ionicons name="trophy" size={20} color={C.gold} />
              <Text style={styles.celeBadgeTxt}>MAP EXPLORER</Text>
            </View>
            <TouchableOpacity style={styles.celeBtn} onPress={() => setShowCelebration(false)} testID="celebration-close">
              <Text style={styles.celeBtnTxt}>Continue Exploring</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function TricolorConfetti() {
  const colors = ["#FF7A1A", "#FFFFFF", "#138808"];
  return (
    <View pointerEvents="none" style={styles.confettiWrap}>
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiPiece key={i} color={colors[i % 3]} index={i} />
      ))}
    </View>
  );
}

function ConfettiPiece({ color, index }: { color: string; index: number }) {
  const ty = useSharedValue(-60);
  const tx = useSharedValue(0);
  const rot = useSharedValue(0);
  const op = useSharedValue(0);
  useEffect(() => {
    const startX = ((index * 37) % 300) - 150;
    const driftX = ((index * 53) % 80) - 40;
    op.value = withTiming(1, { duration: 100 });
    tx.value = withTiming(startX + driftX, { duration: 2800, easing: Easing.linear });
    ty.value = withTiming(SH + 100, { duration: 2800 + (index % 5) * 200, easing: Easing.linear });
    rot.value = withRepeat(withTiming(360, { duration: 1200, easing: Easing.linear }), -1);
    setTimeout(() => { op.value = withTiming(0, { duration: 600 }); }, 2400);
  }, [op, tx, ty, rot, index]);
  const animProps = useAnimatedProps(() => ({ opacity: op.value }));
  return (
    <Animated.View
      animatedProps={animProps}
      style={[
        styles.confettiPiece,
        { backgroundColor: color, transform: [{ translateX: tx as any }, { translateY: ty as any }, { rotate: `${rot.value}deg` as any }] as any },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#FFF9EC" },
  header: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: C.white, borderBottomWidth: 2, borderBottomColor: C.navy,
  },
  headerTitle: { fontSize: 20, fontWeight: "900", color: C.navy },
  headerSub: { fontSize: 11, fontWeight: "700", color: C.textMuted, marginTop: 2 },
  counterPill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: C.navy, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 999, borderWidth: 2, borderColor: C.gold,
  },
  counterTxt: { color: C.white, fontWeight: "900", fontSize: 13 },
  progressOuter: {
    height: 6, backgroundColor: "#FFE6B8", marginHorizontal: 14, marginTop: 8,
    borderRadius: 3, borderWidth: 1, borderColor: C.navy, overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: C.saffron },
  scroll: { padding: 14, alignItems: "center", paddingBottom: 40 },
  intro: {
    backgroundColor: C.white, paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 18, borderWidth: 2, borderColor: C.navy,
    marginBottom: 14, alignItems: "center", maxWidth: 380, alignSelf: "center",
  },
  introTxt: { fontSize: 13, fontWeight: "800", color: C.navy, textAlign: "center" },
  introHint: { fontSize: 11, fontWeight: "700", color: C.textMuted, textAlign: "center", marginTop: 4 },
  mapCanvas: {
    backgroundColor: "#FFF1D6", borderRadius: 20, borderWidth: 3, borderColor: C.navy,
    overflow: "hidden", ...SHADOW, position: "relative",
  },
  parchment: { ...StyleSheet.absoluteFillObject, backgroundColor: "#FFF1D6" },
  legend: {
    flexDirection: "row", gap: 18, marginTop: 14, justifyContent: "center",
    backgroundColor: C.white, paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 999, borderWidth: 1.5, borderColor: C.navy,
  },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1.5, borderColor: C.navy },
  legendTxt: { fontSize: 12, fontWeight: "800", color: C.navy },
  modalBackdrop: { flex: 1, backgroundColor: "#00000099", justifyContent: "center", alignItems: "center", padding: 24 },
  popupCard: {
    backgroundColor: C.white, borderRadius: 24, padding: 22,
    borderWidth: 3, borderColor: C.saffron, alignItems: "center",
    width: "100%", maxWidth: 340, ...SHADOW,
  },
  corner: { position: "absolute", fontSize: 18 },
  cornerTL: { top: 6, left: 8 },
  cornerTR: { top: 6, right: 8 },
  cornerBL: { bottom: 6, left: 8 },
  cornerBR: { bottom: 6, right: 8 },
  closeX: { position: "absolute", right: 6, top: 6, padding: 8, zIndex: 10 },
  portraitWrap: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 3, borderColor: C.gold, overflow: "hidden",
    backgroundColor: "#FFF1D6", marginTop: 8,
  },
  portrait: { width: "100%", height: "100%" },
  heroName: { fontSize: 20, fontWeight: "900", color: C.navy, marginTop: 12, textAlign: "center" },
  statePill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#FFE6B8", paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 999, borderWidth: 1.5, borderColor: C.maroon, marginTop: 6,
  },
  stateTxt: { fontSize: 12, fontWeight: "800", color: C.maroon },
  shortLine: { fontSize: 14, fontWeight: "700", color: C.navy, textAlign: "center", marginTop: 12, fontStyle: "italic" },
  soonChip: {
    backgroundColor: "#FFE6B8", paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 999, borderWidth: 1.5, borderColor: C.navy, marginTop: 10,
  },
  soonTxt: { fontSize: 11, fontWeight: "800", color: C.navy },
  meetBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: C.saffron, paddingHorizontal: 18, paddingVertical: 12,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, marginTop: 16,
  },
  meetBtnTxt: { color: C.white, fontWeight: "900", fontSize: 14 },
  celebrationBg: { flex: 1, backgroundColor: "#00000088", justifyContent: "center", alignItems: "center", padding: 24 },
  celebrationCard: {
    backgroundColor: C.white, padding: 28, borderRadius: 28,
    borderWidth: 3, borderColor: C.gold, alignItems: "center",
    maxWidth: 340, width: "100%", ...SHADOW,
  },
  celeEmoji: { fontSize: 64 },
  celeTitle: { fontSize: 22, fontWeight: "900", color: C.navy, textAlign: "center", marginTop: 12 },
  celeSub: { fontSize: 13, fontWeight: "700", color: C.textMuted, textAlign: "center", marginTop: 10, lineHeight: 19 },
  celeBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.navy, paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 999, borderWidth: 2, borderColor: C.gold, marginTop: 16,
  },
  celeBadgeTxt: { color: C.gold, fontWeight: "900", fontSize: 13, letterSpacing: 1 },
  celeBtn: {
    backgroundColor: C.saffron, paddingHorizontal: 22, paddingVertical: 12,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, marginTop: 18,
  },
  celeBtnTxt: { color: C.white, fontWeight: "900", fontSize: 14 },
  confettiWrap: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "flex-start" },
  confettiPiece: { position: "absolute", width: 10, height: 14, top: 0, left: SW / 2, borderRadius: 2 },
});
