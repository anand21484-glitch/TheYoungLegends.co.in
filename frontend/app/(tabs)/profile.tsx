import { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API, Local } from "../../src/api";
import { C, SHADOW } from "../../src/theme";
import { UserAvatar } from "../../src/components/UserAvatar";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [allBadges, setAllBadges] = useState<any[]>([]);

  const load = async () => {
    try {
      const [me, b] = await Promise.all([API.get("/me"), API.get("/badges")]);
      setUser(me.data);
      setAllBadges(Array.isArray(b.data) ? b.data : b.data?.badges || []);
    } catch (e) {
      // No backend dependency now — purely local
      // eslint-disable-next-line no-console
      console.warn("[Profile] load failed", e);
    }
  };

  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  const resetProgress = async () => {
    Alert.alert(
      "🧹 Reset Progress?",
      "This will erase your XP, badges, completed stories and journal entries on this device. Your name will stay. You cannot undo this.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            // Keep profile (name) but wipe progress only
            const cur = await import("../../src/data/localStore").then((m) => m.getProgress());
            void cur; // not used; just ensures local import compiles
            // Wipe progress by re-saving defaults
            await import("../../src/data/localStore").then(async (m) => {
              await m.setProgress({
                xp: 0,
                badges: [],
                completed_stories: [],
                quizzes_taken: {},
                discovered_heroes: [],
                battle_cries_done: [],
                jigsaw_done: [],
                journal: [],
                streak: 1,
                last_open: new Date().toISOString().slice(0, 10),
                daily_goal: 1,
              });
            });
            await load();
            Alert.alert("Done", "All progress has been reset. Time for a fresh adventure! 🇮🇳");
          },
        },
      ],
    );
  };

  const clearEverything = async () => {
    Alert.alert(
      "❗️ Start Over Completely?",
      "This will also erase your name and send you back to the welcome screen. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, start over",
          style: "destructive",
          onPress: async () => {
            await Local.reset();
            router.replace("/" as any);
          },
        },
      ],
    );
  };

  if (!user) return <View style={styles.c} />;

  const earned = new Set(user.badges);

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
        <View style={styles.heroCard}>
          <UserAvatar avatar={user.avatar} size={120} borderColor={C.gold} borderWidth={4} />
          <Text style={styles.username} testID="profile-username">
            {user.name || user.username}
          </Text>
          <Text style={styles.age}>Level {user.level} · {user.level_name}</Text>
          <View style={styles.levelBadge}>
            <Ionicons name="ribbon" size={18} color={C.navy} />
            <Text style={styles.levelTxt}>{user.xp} XP earned</Text>
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

        {/* ===== Settings ===== */}
        <Text style={styles.section}>⚙️ Settings</Text>

        <View style={styles.settingsCard}>
          <SettingRow
            icon="people"
            iconColor={C.navy}
            title="Parent View"
            subtitle="See your child's full progress at a glance"
            onPress={() => router.push("/parent-view" as any)}
          />
          <View style={styles.settingsDivider} />
          <SettingRow
            icon="refresh"
            iconColor={C.saffron}
            title="Reset Progress"
            subtitle="Clear XP, badges, stories & journal (keep name)"
            onPress={resetProgress}
            testID="reset-progress"
          />
          <View style={styles.settingsDivider} />
          <SettingRow
            icon="trash"
            iconColor={C.red}
            title="Start Over"
            subtitle="Erase everything including your name"
            onPress={clearEverything}
            testID="clear-everything"
          />
        </View>

        <Text style={styles.footerNote}>
          Azaadi Tales · Works fully offline · v1.0
        </Text>
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

function SettingRow({ icon, iconColor, title, subtitle, onPress, testID }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      testID={testID}
      style={styles.settingRow}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconColor + "22" }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={C.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  heroCard: {
    backgroundColor: C.white, borderRadius: 28, padding: 22,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", ...SHADOW,
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

  settingsCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: C.navy,
    overflow: "hidden",
    ...SHADOW,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  settingIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  settingTitle: { fontSize: 15, fontWeight: "800", color: C.navy },
  settingSub: { fontSize: 11, color: C.textMuted, fontWeight: "600", marginTop: 2 },
  settingsDivider: { height: 1, backgroundColor: C.navy + "11" },

  footerNote: {
    fontSize: 11, color: C.textMuted, fontWeight: "600",
    textAlign: "center", marginTop: 26,
  },
});
