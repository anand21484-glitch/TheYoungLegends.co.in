import { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [me, sts] = await Promise.all([API.get("/me"), API.get("/stories")]);
      setUser(me.data);
      setStories(sts.data);
    } catch (e: any) {
      if (e?.response?.status === 401) router.replace("/auth");
    }
  };

  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => {
    setRefreshing(true); await load(); setRefreshing(false);
  };

  if (!user) return <View style={styles.c} />;

  const featured = stories[0];
  const lang = user.language || "en";
  const xpToNext = (() => {
    const levels = [0, 50, 150, 300, 500, 800, 1200];
    const next = levels.find((x) => x > user.xp) ?? user.xp + 100;
    return next - user.xp;
  })();

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        testID="home-scroll"
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.hello}>Namaste,</Text>
            <Text style={styles.name} testID="home-username">{user.username} {user.avatar || "🦉"}</Text>
          </View>
          <View style={styles.streakPill}>
            <Ionicons name="flame" size={18} color={C.saffron} />
            <Text style={styles.streakTxt}>{user.streak}d</Text>
          </View>
        </View>

        <View style={styles.levelCard}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={styles.levelLabel}>LEVEL {user.level}</Text>
              <Text style={styles.levelName}>{user.level_name}</Text>
            </View>
            <View style={styles.xpPill}>
              <Text style={styles.xpTxt}>{user.xp} XP</Text>
            </View>
          </View>
          <View style={styles.xpBarBg}>
            <View style={[styles.xpBarFill, { width: `${Math.min(100, (user.xp % 200) / 2)}%` }]} />
          </View>
          <Text style={styles.xpHint}>{xpToNext} XP to next level 🚀</Text>
        </View>

        <View style={styles.statsRow}>
          <Stat n={user.completed_stories.length} label="Stories" icon="book" color={C.green} />
          <Stat n={user.badges.length} label="Badges" icon="ribbon" color={C.gold} />
          <Stat n={user.quizzes_taken} label="Quizzes" icon="help-circle" color={C.maroon} />
        </View>

        {featured && (
          <TouchableOpacity
            testID="featured-story"
            activeOpacity={0.85}
            onPress={() => router.push(`/story/${featured.id}` as any)}
            style={[styles.featuredCard, { backgroundColor: featured.color }]}
          >
            <Text style={styles.featuredTag}>✨ STORY OF THE DAY</Text>
            <Text style={styles.featuredTitle}>
              {lang === "hi" ? featured.title_hi : featured.title_en}
            </Text>
            <Text style={styles.featuredTagline} numberOfLines={2}>
              {lang === "hi" ? featured.tagline_hi : featured.tagline_en}
            </Text>
            <View style={styles.featuredCta}>
              <Text style={styles.featuredCtaTxt}>Read Now</Text>
              <Ionicons name="arrow-forward" size={16} color={C.navy} />
            </View>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Brave Hearts to Meet</Text>
        {stories.slice(1).map((s) => (
          <TouchableOpacity
            key={s.id}
            testID={`home-story-${s.id}`}
            onPress={() => router.push(`/story/${s.id}` as any)}
            style={styles.storyRow}
            activeOpacity={0.85}
          >
            <View style={[styles.storyDot, { backgroundColor: s.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.storyName}>{s.name}</Text>
              <Text style={styles.storyEra}>{s.era}</Text>
            </View>
            {user.completed_stories.includes(s.id) ? (
              <Ionicons name="checkmark-circle" size={26} color={C.green} />
            ) : (
              <Ionicons name="chevron-forward" size={22} color={C.textMuted} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ n, label, icon, color }: any) {
  return (
    <View style={styles.statBox}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.statN}>{n}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  hello: { fontSize: 14, color: C.textSecondary, fontWeight: "700" },
  name: { fontSize: 28, fontWeight: "900", color: C.navy, letterSpacing: -0.5 },
  streakPill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: C.white, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, ...SHADOW,
  },
  streakTxt: { fontSize: 14, fontWeight: "900", color: C.navy },
  levelCard: {
    backgroundColor: C.white, borderRadius: 24, padding: 18,
    borderWidth: 2, borderColor: C.navy, ...SHADOW, marginBottom: 16,
  },
  levelLabel: { fontSize: 11, fontWeight: "900", color: C.saffron, letterSpacing: 1 },
  levelName: { fontSize: 22, fontWeight: "900", color: C.navy, marginTop: 2 },
  xpPill: {
    backgroundColor: C.gold, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy,
  },
  xpTxt: { fontWeight: "900", color: C.navy, fontSize: 14 },
  xpBarBg: {
    height: 14, backgroundColor: C.cream, borderRadius: 999,
    borderWidth: 2, borderColor: C.navy, marginTop: 14, overflow: "hidden",
  },
  xpBarFill: { height: "100%", backgroundColor: C.saffron },
  xpHint: { fontSize: 12, color: C.textMuted, marginTop: 8, fontWeight: "700" },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  statBox: {
    flex: 1, backgroundColor: C.white, borderRadius: 18, padding: 14,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", ...SHADOW,
  },
  statN: { fontSize: 22, fontWeight: "900", color: C.navy, marginTop: 4 },
  statLabel: { fontSize: 11, fontWeight: "700", color: C.textMuted, textTransform: "uppercase" },
  featuredCard: {
    borderRadius: 24, padding: 22, borderWidth: 2, borderColor: C.navy,
    ...SHADOW, marginBottom: 22,
  },
  featuredTag: { color: C.gold, fontWeight: "900", fontSize: 11, letterSpacing: 1.2, marginBottom: 6 },
  featuredTitle: { color: C.white, fontSize: 22, fontWeight: "900", lineHeight: 28 },
  featuredTagline: { color: "#FFFFFFCC", fontSize: 14, fontWeight: "600", marginTop: 8, lineHeight: 20 },
  featuredCta: {
    flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start",
    backgroundColor: C.gold, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 999, marginTop: 14, borderWidth: 2, borderColor: C.navy,
  },
  featuredCtaTxt: { color: C.navy, fontWeight: "900", fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: C.navy, marginBottom: 12 },
  storyRow: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: C.white, padding: 14, borderRadius: 18,
    borderWidth: 2, borderColor: C.navy, marginBottom: 10, ...SHADOW,
  },
  storyDot: { width: 14, height: 50, borderRadius: 6 },
  storyName: { fontSize: 16, fontWeight: "800", color: C.navy },
  storyEra: { fontSize: 12, fontWeight: "600", color: C.textMuted, marginTop: 2 },
});
