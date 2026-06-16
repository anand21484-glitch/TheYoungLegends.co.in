import { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Alert, RefreshControl, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API, clearAuth } from "../../src/api";
import { C, SHADOW } from "../../src/theme";
import { UserAvatar } from "../../src/components/UserAvatar";

type Tab = "children" | "review";

export default function ParentHome() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("children");
  const [children, setChildren] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [linkUsername, setLinkUsername] = useState("");

  const load = async () => {
    try {
      const [c, p] = await Promise.all([API.get("/parent/children"), API.get("/parent/pending-posts")]);
      setChildren(c.data);
      setPending(p.data);
    } catch (e: any) {
      if (e?.response?.status === 401 || e?.response?.status === 403) {
        await clearAuth();
        router.replace("/auth");
      }
    }
  };
  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const linkChild = async () => {
    const u = linkUsername.trim();
    if (!u) return;
    try {
      await API.post("/parent/link-child", { child_username: u });
      setLinkUsername("");
      await load();
      Alert.alert("Linked! 🎉", `${u} is now connected to you.`);
    } catch (e: any) {
      Alert.alert("Hmm", e?.response?.data?.detail || "Could not link");
    }
  };

  const setGoal = async (kidId: string, goal: number) => {
    try {
      await API.post(`/parent/child/${kidId}/goal`, { daily_goal: goal });
      await load();
    } catch {}
  };

  const moderate = async (postId: string, action: "approve" | "reject") => {
    try {
      await API.post(`/parent/posts/${postId}/moderate`, { action });
      setPending((p) => p.filter((x) => x.id !== postId));
    } catch {}
  };

  const logout = async () => {
    Alert.alert("Log Out?", "", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: async () => { await clearAuth(); router.replace("/auth"); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Parent Hub</Text>
            <Text style={styles.subtitle}>{children.length} child{children.length === 1 ? "" : "ren"} linked</Text>
          </View>
          <TouchableOpacity testID="parent-logout" style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={22} color={C.red} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            testID="parent-tab-children"
            style={[styles.tab, tab === "children" && styles.tabActive]}
            onPress={() => setTab("children")}
          >
            <Text style={[styles.tabTxt, tab === "children" && styles.tabTxtActive]}>👨‍👩‍👧 Children</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="parent-tab-review"
            style={[styles.tab, tab === "review" && styles.tabActive]}
            onPress={() => setTab("review")}
          >
            <Text style={[styles.tabTxt, tab === "review" && styles.tabTxtActive]}>
              📝 Review {pending.length > 0 && `(${pending.length})`}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 18, paddingBottom: 60 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          testID="parent-scroll"
          keyboardShouldPersistTaps="handled"
        >
          {tab === "children" && (
            <>
              <View style={styles.linkCard}>
                <Text style={styles.linkLabel}>Link a Child</Text>
                <Text style={styles.linkHelp}>Enter your child&apos;s Azaadi Tales username:</Text>
                <View style={styles.linkRow}>
                  <TextInput
                    testID="link-input"
                    value={linkUsername}
                    onChangeText={setLinkUsername}
                    placeholder="e.g. brave_tiger"
                    placeholderTextColor={C.textMuted}
                    autoCapitalize="none"
                    style={styles.linkInput}
                  />
                  <TouchableOpacity testID="link-btn" style={styles.linkBtn} onPress={linkChild}>
                    <Ionicons name="link" size={20} color={C.white} />
                  </TouchableOpacity>
                </View>
              </View>

              {children.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={{ fontSize: 56 }}>👨‍👩‍👧</Text>
                  <Text style={styles.emptyTitle}>No children linked yet</Text>
                  <Text style={styles.emptySub}>Ask your child to sign up first, then enter their username above.</Text>
                </View>
              ) : (
                children.map((k) => (
                  <View key={k.id} style={styles.kidCard} testID={`kid-${k.id}`}>
                    <View style={styles.kidTop}>
                      <View style={styles.kidAv}>
                        <UserAvatar avatar={k.avatar} size={48} borderWidth={0} showBackground={false} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.kidName}>{k.username}</Text>
                        <Text style={styles.kidMeta}>Age {k.age} · {k.level_name}</Text>
                      </View>
                      <View style={styles.streakChip}>
                        <Ionicons name="flame" size={14} color={C.saffron} />
                        <Text style={styles.streakTxt}>{k.streak}</Text>
                      </View>
                    </View>
                    <View style={styles.statsRow}>
                      <Stat label="XP" value={k.xp} color={C.gold} />
                      <Stat label="Stories" value={k.completed_stories.length} color={C.green} />
                      <Stat label="Quizzes" value={k.quizzes_taken} color={C.maroon} />
                      <Stat label="Badges" value={k.badges.length} color={C.saffron} />
                    </View>
                    <Text style={styles.goalLabel}>Daily Story Goal</Text>
                    <View style={styles.goalRow}>
                      {[1, 2, 3, 5].map((g) => (
                        <TouchableOpacity
                          key={g}
                          testID={`goal-${k.id}-${g}`}
                          style={[styles.goalChip, k.daily_goal === g && styles.goalChipActive]}
                          onPress={() => setGoal(k.id, g)}
                        >
                          <Text style={[styles.goalChipTxt, k.daily_goal === g && { color: C.white }]}>
                            {g}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))
              )}
            </>
          )}

          {tab === "review" && (
            <>
              {pending.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={{ fontSize: 56 }}>✅</Text>
                  <Text style={styles.emptyTitle}>All caught up!</Text>
                  <Text style={styles.emptySub}>No posts waiting for your review.</Text>
                </View>
              ) : (
                pending.map((p) => (
                  <View key={p.id} style={styles.reviewCard} testID={`review-${p.id}`}>
                    <View style={styles.reviewTop}>
                      <UserAvatar avatar={p.author_avatar} size={44} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.kidName}>{p.author_username}</Text>
                        {p.story_id && <Text style={styles.kidMeta}>📖 {p.story_id.replace(/-/g, " ")}</Text>}
                      </View>
                    </View>
                    <Text style={styles.reviewTxt}>{p.text}</Text>
                    {p.moderation_reason && (
                      <Text style={styles.modNote}>🇮🇳 Veer: {p.moderation_reason}</Text>
                    )}
                    <View style={styles.reviewActions}>
                      <TouchableOpacity
                        testID={`reject-${p.id}`}
                        style={[styles.actionBtn, { backgroundColor: C.white, borderColor: C.red }]}
                        onPress={() => moderate(p.id, "reject")}
                      >
                        <Ionicons name="close" size={18} color={C.red} />
                        <Text style={[styles.actionTxt, { color: C.red }]}>Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        testID={`approve-${p.id}`}
                        style={[styles.actionBtn, { backgroundColor: C.green, borderColor: C.green }]}
                        onPress={() => moderate(p.id, "approve")}
                      >
                        <Ionicons name="checkmark" size={18} color={C.white} />
                        <Text style={[styles.actionTxt, { color: C.white }]}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Stat({ label, value, color }: any) {
  return (
    <View style={[styles.statBox, { borderColor: color }]}>
      <Text style={[styles.statN, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  logoutBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: C.white,
    borderWidth: 2, borderColor: C.red, alignItems: "center", justifyContent: "center",
  },
  tabs: { flexDirection: "row", paddingHorizontal: 18, gap: 8, marginBottom: 6 },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 999, borderWidth: 2, borderColor: C.navy, backgroundColor: C.white, alignItems: "center" },
  tabActive: { backgroundColor: C.navy },
  tabTxt: { fontWeight: "900", color: C.navy, fontSize: 13 },
  tabTxtActive: { color: C.white },
  linkCard: {
    backgroundColor: "#FFF8E7", padding: 16, borderRadius: 18,
    borderWidth: 2, borderColor: C.navy, marginBottom: 16, ...SHADOW,
  },
  linkLabel: { fontSize: 14, fontWeight: "900", color: C.navy },
  linkHelp: { fontSize: 12, color: C.textSecondary, fontWeight: "700", marginTop: 4 },
  linkRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  linkInput: {
    flex: 1, borderWidth: 2, borderColor: C.navy, borderRadius: 14,
    padding: 12, fontSize: 14, backgroundColor: C.white, color: C.text,
  },
  linkBtn: {
    width: 50, height: 48, backgroundColor: C.saffron, borderRadius: 14,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", justifyContent: "center",
  },
  empty: { alignItems: "center", padding: 40, marginTop: 20 },
  emptyTitle: { fontSize: 19, fontWeight: "900", color: C.navy, marginTop: 8 },
  emptySub: { fontSize: 13, color: C.textMuted, fontWeight: "700", marginTop: 6, textAlign: "center" },
  kidCard: {
    backgroundColor: C.white, padding: 16, borderRadius: 20,
    borderWidth: 2, borderColor: C.navy, marginBottom: 14, ...SHADOW,
  },
  kidTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  kidAv: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: C.gold,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", justifyContent: "center",
  },
  kidName: { fontSize: 18, fontWeight: "900", color: C.navy },
  kidMeta: { fontSize: 12, color: C.textMuted, fontWeight: "700", marginTop: 2 },
  streakChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: C.cream, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999, borderWidth: 1.5, borderColor: C.navy,
  },
  streakTxt: { fontWeight: "900", color: C.navy, fontSize: 12 },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  statBox: { flex: 1, padding: 10, borderRadius: 14, borderWidth: 2, alignItems: "center", backgroundColor: C.white },
  statN: { fontSize: 20, fontWeight: "900" },
  statLabel: { fontSize: 9, fontWeight: "800", color: C.textMuted, textTransform: "uppercase", marginTop: 2 },
  goalLabel: { fontSize: 12, fontWeight: "900", color: C.navy, marginTop: 14, textTransform: "uppercase", letterSpacing: 0.5 },
  goalRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  goalChip: {
    flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 2,
    borderColor: C.navy, backgroundColor: C.cream, alignItems: "center",
  },
  goalChipActive: { backgroundColor: C.green, borderColor: C.green },
  goalChipTxt: { fontWeight: "900", color: C.navy, fontSize: 14 },
  reviewCard: {
    backgroundColor: C.white, padding: 16, borderRadius: 20,
    borderWidth: 2, borderColor: C.navy, marginBottom: 14, ...SHADOW,
  },
  reviewTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  reviewTxt: { fontSize: 15, lineHeight: 22, color: C.text, fontWeight: "500" },
  modNote: { fontSize: 11, color: C.textMuted, fontWeight: "700", marginTop: 8, fontStyle: "italic" },
  reviewActions: { flexDirection: "row", gap: 10, marginTop: 14 },
  actionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, padding: 12, borderRadius: 999, borderWidth: 2,
  },
  actionTxt: { fontWeight: "900", fontSize: 14 },
});
