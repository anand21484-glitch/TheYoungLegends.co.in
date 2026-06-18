import { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API, getStoredUser } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

export default function HuntsList() {
  const router = useRouter();
  const [hunts, setHunts] = useState<any[]>([]);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const u = await getStoredUser();
      if (u?.language) setLang(u.language);
      const r = await API.get("/hunts");
      setHunts(r.data);
    } catch (e: any) {
      // (offline: no auth)
} finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  const onRefresh = async () => {
    setRefreshing(true); await load(); setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="hunts-back">
          <Ionicons name="arrow-back" size={24} color={C.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Treasure Hunts</Text>
          <Text style={styles.headerSub}>Solve clues, tap the right hero, earn badges</Text>
        </View>
        <View style={styles.huntIconWrap}>
          <Ionicons name="map" size={26} color={C.gold} />
        </View>
      </View>

      {loading ? (
        <View style={[styles.c, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator size="large" color={C.saffron} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          testID="hunts-scroll"
        >
          {hunts.map((h) => (
            <TouchableOpacity
              key={h.id}
              activeOpacity={0.85}
              testID={`hunt-card-${h.id}`}
              onPress={() => router.push(`/hunts/${h.id}` as any)}
              style={[styles.huntCard, { backgroundColor: h.color }]}
            >
              <View style={styles.huntCardTop}>
                <View style={styles.iconBubble}>
                  <Ionicons name={h.icon as any} size={26} color={h.color} />
                </View>
                {h.completed && (
                  <View style={styles.doneBadge}>
                    <Ionicons name="checkmark-circle" size={18} color={C.green} />
                    <Text style={styles.doneTxt}>SOLVED</Text>
                  </View>
                )}
              </View>
              <Text style={styles.huntTitle}>{lang === "hi" ? h.title_hi : h.title_en}</Text>
              <Text style={styles.huntTagline} numberOfLines={2}>
                {lang === "hi" ? h.tagline_hi : h.tagline_en}
              </Text>
              <View style={styles.progressRow}>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${h.percent}%` }]} />
                </View>
                <Text style={styles.progressTxt}>
                  {h.solved_clues}/{h.total_clues}
                </Text>
              </View>
              <View style={styles.huntFoot}>
                <View style={styles.xpChip}>
                  <Ionicons name="star" size={13} color={C.navy} />
                  <Text style={styles.xpChipTxt}>+{h.xp_reward} XP</Text>
                </View>
                <View style={styles.startCta}>
                  <Text style={styles.startCtaTxt}>
                    {h.completed ? "Replay" : h.solved_clues > 0 ? "Continue" : "Start"}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color={C.navy} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  header: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 14, paddingVertical: 8,
    borderBottomWidth: 2, borderBottomColor: C.navy, backgroundColor: C.white,
  },
  backBtn: { padding: 8, borderRadius: 999 },
  headerTitle: { fontSize: 22, fontWeight: "900", color: C.navy },
  headerSub: { fontSize: 12, color: C.textMuted, fontWeight: "700", marginTop: 2 },
  huntIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.navy, justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: C.navy,
  },
  huntCard: {
    borderRadius: 24, padding: 20, marginBottom: 16,
    borderWidth: 2, borderColor: C.navy, ...SHADOW,
  },
  huntCardTop: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12,
  },
  iconBubble: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: C.white, justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: C.navy,
  },
  doneBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: C.white, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy,
  },
  doneTxt: { fontSize: 11, fontWeight: "900", color: C.green },
  huntTitle: { color: C.white, fontSize: 22, fontWeight: "900", lineHeight: 28 },
  huntTagline: { color: "#FFFFFFCC", fontSize: 13, fontWeight: "600", marginTop: 6, lineHeight: 18 },
  progressRow: {
    flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14,
  },
  progressBg: {
    flex: 1, height: 12, backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: C.gold },
  progressTxt: { color: C.white, fontWeight: "900", fontSize: 13 },
  huntFoot: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14,
  },
  xpChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: C.gold, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy,
  },
  xpChipTxt: { color: C.navy, fontWeight: "900", fontSize: 12 },
  startCta: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: C.white, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy,
  },
  startCtaTxt: { color: C.navy, fontWeight: "900", fontSize: 13 },
});
