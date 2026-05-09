import { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API, clearAuth } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [allBadges, setAllBadges] = useState<any[]>([]);

  const load = async () => {
    try {
      const [me, b] = await Promise.all([API.get("/me"), API.get("/badges")]);
      setUser(me.data);
      setAllBadges(b.data);
    } catch (e: any) {
      if (e?.response?.status === 401) router.replace("/auth");
    }
  };

  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  const logout = async () => {
    Alert.alert("Log Out?", "See you soon, brave heart!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out", style: "destructive",
        onPress: async () => { await clearAuth(); router.replace("/auth"); },
      },
    ]);
  };

  if (!user) return <View style={styles.c} />;

  const earned = new Set(user.badges);

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
        <View style={styles.heroCard}>
          <View style={styles.avatarBig}>
            <Text style={{ fontSize: 56 }}>{user.avatar}</Text>
          </View>
          <Text style={styles.username} testID="profile-username">{user.username}</Text>
          <Text style={styles.age}>Age {user.age} · {user.language === "hi" ? "हिंदी" : "English"}</Text>

          <View style={styles.levelBadge}>
            <Ionicons name="ribbon" size={18} color={C.navy} />
            <Text style={styles.levelTxt}>Level {user.level} · {user.level_name}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat icon="flame" color={C.saffron} n={user.streak} label="Day Streak" />
          <Stat icon="star" color={C.gold} n={user.xp} label="XP Earned" />
          <Stat icon="book" color={C.green} n={user.completed_stories.length} label="Stories" />
        </View>

        <Text style={styles.section}>🏆 Badges</Text>
        <View style={styles.badgeGrid}>
          {allBadges.map((b) => {
            const has = earned.has(b.id);
            return (
              <View
                key={b.id}
                testID={`badge-${b.id}`}
                style={[styles.badge, !has && { opacity: 0.35 }]}
              >
                <View style={[styles.badgeIcon, { backgroundColor: has ? C.gold : C.cream }]}>
                  <Ionicons name={b.icon as any} size={26} color={has ? C.navy : C.textMuted} />
                </View>
                <Text style={styles.badgeName} numberOfLines={1}>{b.name}</Text>
                <Text style={styles.badgeDesc} numberOfLines={2}>{b.desc}</Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity testID="logout-btn" style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out" size={18} color={C.red} />
          <Text style={styles.logoutTxt}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ icon, color, n, label }: any) {
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
  heroCard: {
    backgroundColor: C.white, borderRadius: 28, padding: 22,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", ...SHADOW,
  },
  avatarBig: {
    width: 110, height: 110, borderRadius: 55, backgroundColor: C.gold,
    borderWidth: 3, borderColor: C.navy, alignItems: "center", justifyContent: "center",
  },
  username: { fontSize: 24, fontWeight: "900", color: C.navy, marginTop: 12 },
  age: { fontSize: 13, color: C.textMuted, fontWeight: "700", marginTop: 2 },
  levelBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.gold, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, marginTop: 12,
  },
  levelTxt: { fontWeight: "900", color: C.navy, fontSize: 13 },
  statsRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  statBox: {
    flex: 1, backgroundColor: C.white, borderRadius: 18, padding: 14,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", ...SHADOW,
  },
  statN: { fontSize: 22, fontWeight: "900", color: C.navy, marginTop: 4 },
  statLabel: { fontSize: 10, fontWeight: "700", color: C.textMuted, textTransform: "uppercase", textAlign: "center" },
  section: { fontSize: 18, fontWeight: "900", color: C.navy, marginTop: 24, marginBottom: 12 },
  badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  badge: {
    width: "31.5%", backgroundColor: C.white, padding: 12,
    borderRadius: 18, borderWidth: 2, borderColor: C.navy, alignItems: "center", ...SHADOW,
  },
  badgeIcon: {
    width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: C.navy,
  },
  badgeName: { fontSize: 12, fontWeight: "900", color: C.navy, marginTop: 6, textAlign: "center" },
  badgeDesc: { fontSize: 10, color: C.textMuted, fontWeight: "600", textAlign: "center", marginTop: 2 },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    marginTop: 26, padding: 14, borderRadius: 999, borderWidth: 2, borderColor: C.red, backgroundColor: C.white,
  },
  logoutTxt: { color: C.red, fontWeight: "900", fontSize: 15 },
});
