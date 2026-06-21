import { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API } from "../../src/api";
import { getProgress } from "../../src/data/localStore";
import { STORIES, PORTRAITS, HERO_QA } from "../../src/data";
import { C, SHADOW } from "../../src/theme";
import { UserAvatar } from "../../src/components/UserAvatar";

const EMOJIS = ["🔥", "💡", "🌟"];

export default function Journal() {
  const router = useRouter();
  const [feed, setFeed] = useState<any[]>([]);
  const [mine, setMine] = useState<any[]>([]);
  const [tab, setTab] = useState<"feed" | "mine" | "experts">("feed");
  const [refreshing, setRefreshing] = useState(false);
  const [experts, setExperts] = useState<string[]>([]);

  const load = async () => {
    try {
      const [f, m, p] = await Promise.all([
        API.get("/journal/feed"),
        API.get("/journal/mine"),
        getProgress(),
      ]);
      setFeed(f.data);
      setMine(m.data);
      setExperts(p.hero_experts || []);
    } catch {}
  };
  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const react = async (postId: string, emoji: string) => {
    try {
      const { data } = await API.post(`/journal/${postId}/react`, { emoji });
      setFeed((f) => f.map((p) => (p.id === postId ? { ...p, reactions_count: data.counts } : p)));
    } catch {}
  };

  const data = tab === "feed" ? feed : mine;

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Freedom Journal</Text>
          <Text style={styles.subtitle}>Brave thoughts, shared kindly</Text>
        </View>
        <TouchableOpacity testID="new-post-btn" style={styles.newBtn} onPress={() => router.push("/journal/new" as any)}>
          <Ionicons name="add" size={22} color={C.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          testID="journal-tab-feed"
          style={[styles.tab, tab === "feed" && styles.tabActive]}
          onPress={() => setTab("feed")}
        >
          <Text style={[styles.tabTxt, tab === "feed" && styles.tabTxtActive]}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="journal-tab-mine"
          style={[styles.tab, tab === "mine" && styles.tabActive]}
          onPress={() => setTab("mine")}
        >
          <Text style={[styles.tabTxt, tab === "mine" && styles.tabTxtActive]}>My Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="journal-tab-experts"
          style={[styles.tab, tab === "experts" && styles.tabActive]}
          onPress={() => setTab("experts")}
        >
          <Text style={[styles.tabTxt, tab === "experts" && styles.tabTxtActive]}>Experts 🏅</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        testID="journal-scroll"
      >
        {/* === Experts tab === */}
        {tab === "experts" && (
          <View>
            <View style={styles.expertsHeader}>
              <Text style={styles.expertsTitle}>Hero Experts 🏅</Text>
              <Text style={styles.expertsSub}>
                You are an expert on{" "}
                <Text style={{ color: "#FFB300", fontWeight: "900" }}>{experts.length}</Text>{" "}
                {experts.length === 1 ? "hero" : "heroes"}!
              </Text>
            </View>
            {experts.length === 0 && (
              <View style={styles.empty}>
                <Text style={{ fontSize: 56 }}>🏅</Text>
                <Text style={styles.emptyTitle}>No experts yet</Text>
                <Text style={styles.emptySub}>
                  Open a hero story and tap &quot;Ask Me!&quot; — answer all 4 questions to earn an Expert badge!
                </Text>
              </View>
            )}
            <View style={styles.expertGrid}>
              {experts.map((hid) => {
                const s = STORIES.find((x) => x.id === hid);
                const name = HERO_QA[hid]?.name || s?.name || hid;
                return (
                  <TouchableOpacity
                    key={hid}
                    testID={`expert-${hid}`}
                    style={styles.expertCard}
                    onPress={() => router.push(`/ask/${hid}` as any)}
                  >
                    <View style={styles.expertPortrait}>
                      {PORTRAITS[hid] ? (
                        <Image source={PORTRAITS[hid]} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                      ) : (
                        <Text style={{ fontSize: 32 }}>🇮🇳</Text>
                      )}
                      <View style={styles.expertMedal}>
                        <Text style={{ fontSize: 14 }}>🏅</Text>
                      </View>
                    </View>
                    <Text style={styles.expertName} numberOfLines={2}>{name}</Text>
                    <Text style={styles.expertTag}>Expert</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* === Community + My posts tabs === */}
        {tab !== "experts" && data.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 56 }}>📔</Text>
            <Text style={styles.emptyTitle}>
              {tab === "feed" ? "Be the first to share!" : "No reflections yet"}
            </Text>
            <Text style={styles.emptySub}>
              Read a story, then write what it taught you.
            </Text>
          </View>
        )}

        {tab !== "experts" && data.map((p) => (
          <View key={p.id} style={styles.post} testID={`post-${p.id}`}>
            <View style={styles.postTop}>
              <UserAvatar avatar={p.author_avatar} size={40} />
              <View style={{ flex: 1 }}>
                <Text style={styles.author}>{p.author_username}</Text>
                {p.story_id && <Text style={styles.storyTag}>📖 {p.story_id.replace(/-/g, " ")}</Text>}
              </View>
              {tab === "mine" && (
                <View style={[styles.statusPill, p.status === "approved" ? styles.statusOk : p.status === "pending" ? styles.statusWait : styles.statusBad]}>
                  <Text style={styles.statusTxt}>{p.status}</Text>
                </View>
              )}
            </View>
            <Text style={styles.postTxt}>{p.text}</Text>
            {tab === "feed" && (
              <View style={styles.reactionRow}>
                {EMOJIS.map((e) => (
                  <TouchableOpacity
                    key={e}
                    testID={`react-${p.id}-${e}`}
                    style={styles.reactBtn}
                    onPress={() => react(p.id, e)}
                  >
                    <Text style={{ fontSize: 18 }}>{e}</Text>
                    <Text style={styles.reactCount}>{p.reactions_count?.[e] || 0}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  header: {
    paddingHorizontal: 18, paddingTop: 8, paddingBottom: 12,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "900", color: C.navy, letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: C.textMuted, fontWeight: "700", marginTop: 2 },
  newBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: C.saffron,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", justifyContent: "center", ...SHADOW,
  },
  tabs: { flexDirection: "row", paddingHorizontal: 18, gap: 8, marginBottom: 6 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 999, borderWidth: 2, borderColor: C.navy, backgroundColor: C.white, alignItems: "center" },
  tabActive: { backgroundColor: C.navy },
  tabTxt: { fontWeight: "900", color: C.navy, fontSize: 13 },
  tabTxtActive: { color: C.white },
  empty: { alignItems: "center", padding: 40, marginTop: 30 },
  emptyTitle: { fontSize: 20, fontWeight: "900", color: C.navy, marginTop: 8 },
  emptySub: { fontSize: 13, color: C.textMuted, fontWeight: "700", marginTop: 4, textAlign: "center" },
  post: {
    backgroundColor: C.white, padding: 16, borderRadius: 20,
    borderWidth: 2, borderColor: C.navy, marginBottom: 12, ...SHADOW,
  },
  postTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  av: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: C.gold,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", justifyContent: "center",
  },
  author: { fontSize: 15, fontWeight: "900", color: C.navy },
  storyTag: { fontSize: 11, color: C.textMuted, fontWeight: "700", marginTop: 1, textTransform: "capitalize" },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1.5, borderColor: C.navy },
  statusOk: { backgroundColor: "#D9F2D9" },
  statusWait: { backgroundColor: "#FFF1B8" },
  statusBad: { backgroundColor: "#FFD6D6" },
  statusTxt: { fontSize: 10, fontWeight: "900", color: C.navy, textTransform: "uppercase" },
  postTxt: { fontSize: 15, lineHeight: 22, color: C.text, fontWeight: "500" },
  reactionRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  reactBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: C.cream, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 999, borderWidth: 1.5, borderColor: C.navy,
  },
  reactCount: { fontWeight: "900", color: C.navy, fontSize: 13 },

  // ===== Experts tab =====
  expertsHeader: {
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFB300",
    marginBottom: 14,
  },
  expertsTitle: { fontSize: 20, fontWeight: "900", color: C.navy, letterSpacing: -0.3 },
  expertsSub: { fontSize: 13, color: C.textMuted, fontWeight: "700", marginTop: 4 },
  expertGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
  expertCard: {
    width: "47%",
    backgroundColor: C.white,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700",
    ...SHADOW,
  },
  expertPortrait: {
    width: 72, height: 72, borderRadius: 36,
    overflow: "hidden",
    borderWidth: 2, borderColor: C.navy,
    backgroundColor: C.gold,
    position: "relative",
  },
  expertMedal: {
    position: "absolute",
    right: -2, bottom: -2,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: "#FFD700",
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: C.white,
  },
  expertName: {
    fontSize: 13, fontWeight: "900", color: C.navy,
    textAlign: "center", marginTop: 8, minHeight: 32,
  },
  expertTag: {
    fontSize: 10,
    fontWeight: "900",
    color: "#7A5300",
    backgroundColor: "#FFE9A3",
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 999,
    marginTop: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
