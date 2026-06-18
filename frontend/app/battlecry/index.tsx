import { useCallback, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { API, PORTRAITS } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;
const { width: SW } = Dimensions.get("window");

type Cry = {
  hero_id: string; hero_name: string; hero_color: string;
  portrait_url: string | null; cry: string; meaning: string;
  origin: string; completed: boolean; badge_id: string;
};

export default function BattleCryWall() {
  const router = useRouter();
  const [cries, setCries] = useState<Cry[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [total, setTotal] = useState(15);
  const [freedomVoiceUnlocked, setFvUnlocked] = useState(false);
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const r = await API.get("/battle-cries");
      setCries(r.data.cries);
      setCompletedCount(r.data.completed_count);
      setTotal(r.data.total);
      setFvUnlocked(r.data.freedom_voice_unlocked);
      setThreshold(r.data.freedom_voice_threshold);
    } catch (e: any) {
      // (offline: no auth)
} finally {
      setLoading(false);
    }
  }, [router]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) {
    return (
      <SafeAreaView style={[styles.c, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={C.gold} />
      </SafeAreaView>
    );
  }

  const progressPct = total ? (completedCount / total) * 100 : 0;

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>🦁 Battle Cry Wall</Text>
          <Text style={styles.sub}>{completedCount}/{total} freedom roars unlocked</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>

      {/* Mega badge banner */}
      <View style={[styles.megaBanner, freedomVoiceUnlocked ? styles.megaUnlocked : styles.megaLocked]}>
        <Text style={styles.megaEmoji}>{freedomVoiceUnlocked ? "🏆" : "🔒"}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.megaTitle, freedomVoiceUnlocked && styles.megaTitleLight]}>
            {freedomVoiceUnlocked ? "The Freedom Voice" : `${threshold} cries → MEGA BADGE`}
          </Text>
          <Text style={[styles.megaSub, freedomVoiceUnlocked && styles.megaSubLight]}>
            {freedomVoiceUnlocked
              ? "You spoke for India!"
              : `Complete ${Math.max(0, threshold - completedCount)} more to unlock 🦁`}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {cries.map((c, idx) => (
          <Animated.View key={c.hero_id} entering={FadeInUp.delay(idx * 30).duration(280)}>
            <TouchableOpacity
              style={[
                styles.card,
                { borderColor: c.completed ? "#FFD93D" : "#FFFFFF55" },
              ]}
              onPress={() => router.push(`/battlecry/${c.hero_id}` as any)}
              testID={`cry-card-${c.hero_id}`}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.portraitWrap,
                  { borderColor: c.hero_color },
                ]}
              >
                {PORTRAITS[c.hero_id] || c.portrait_url ? (
                  <Image
                    source={PORTRAITS[c.hero_id] || ({ uri: `${BASE}${c.portrait_url}` } as any)}
                    style={styles.portrait}
                  />
                ) : null}
                ) : (
                  <View style={[styles.portrait, { backgroundColor: c.hero_color }]} />
                )}
                {c.completed && (
                  <View style={styles.badgeBubble}>
                    <Text style={{ fontSize: 12 }}>🏅</Text>
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroName} numberOfLines={1}>{c.hero_name}</Text>
                <Text style={styles.cryLine} numberOfLines={2}>
                  "{c.cry}"
                </Text>
                <Text style={styles.meaning} numberOfLines={1}>{c.meaning}</Text>
              </View>
              <Ionicons
                name={c.completed ? "checkmark-circle" : "chevron-forward"}
                size={22}
                color={c.completed ? "#22C55E" : "#FFFFFF99"}
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#0B1437" },
  header: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#FFFFFF22",
  },
  backBtn: { padding: 4 },
  title: { color: "#FFD93D", fontSize: 20, fontWeight: "900" },
  sub: { color: "#FFFFFFCC", fontSize: 12, fontWeight: "700", marginTop: 2 },
  progressWrap: {
    height: 6, backgroundColor: "#FFFFFF18", marginHorizontal: 14, marginTop: 6,
    borderRadius: 3, overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#FFD93D" },
  megaBanner: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 14, paddingVertical: 14,
    marginHorizontal: 14, marginTop: 14, marginBottom: 4,
    borderRadius: 18, borderWidth: 2,
  },
  megaUnlocked: { backgroundColor: "#FFD93D", borderColor: "#FF7A1A" },
  megaLocked: { backgroundColor: "#1F2A52", borderColor: "#FFFFFF44" },
  megaEmoji: { fontSize: 32 },
  megaTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
  megaTitleLight: { color: "#0B1437" },
  megaSub: { color: "#FFFFFFAA", fontSize: 11, fontWeight: "700", marginTop: 2 },
  megaSubLight: { color: "#0B1437DD" },
  scroll: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 40, gap: 10 },
  card: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#1F2A52", padding: 12, borderRadius: 18,
    borderWidth: 2, marginBottom: 10, ...SHADOW,
  },
  portraitWrap: {
    width: 64, height: 64, borderRadius: 32, overflow: "hidden",
    borderWidth: 3, backgroundColor: "#0B1437", position: "relative",
  },
  portrait: { width: "100%", height: "100%" },
  badgeBubble: {
    position: "absolute", bottom: -2, right: -2,
    width: 22, height: 22, borderRadius: 11, backgroundColor: "#FFD93D",
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "#0B1437",
  },
  heroName: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
  cryLine: { color: "#FFD93D", fontSize: 13, fontWeight: "800", marginTop: 4, fontStyle: "italic" },
  meaning: { color: "#FFFFFF99", fontSize: 11, fontWeight: "600", marginTop: 2 },
});
