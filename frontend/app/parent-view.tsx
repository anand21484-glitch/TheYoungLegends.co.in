// Parent View — read-only summary of the child's local progress.
// Reached from Settings → "Parent View". No accounts; data is on-device only.

import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getProgress, getProfile, levelFromXP, type Progress, type Profile } from "../src/data/localStore";
import { STORIES, BADGES, BATTLE_CRIES, FREEDOM_MAP } from "../src/data";
import { C, SHADOW } from "../src/theme";

export default function ParentView() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [prog, setProg] = useState<Progress | null>(null);

  useEffect(() => {
    (async () => {
      setProfile(await getProfile());
      setProg(await getProgress());
    })();
  }, []);

  if (!profile || !prog) return <View style={styles.c} />;
  const level = levelFromXP(prog.xp);

  const totalStories = STORIES.length;
  const totalBadges = BADGES.length;
  const totalCries = Object.keys(BATTLE_CRIES).length;
  const totalHeroes = FREEDOM_MAP.fighters.length;
  const lastQuiz = Object.entries(prog.quizzes_taken)
    .sort((a, b) => b[1].at.localeCompare(a[1].at))
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.c} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} testID="back-btn">
          <Ionicons name="chevron-back" size={28} color={C.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Parent View</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
        <View style={styles.heroCard}>
          <Text style={styles.greeting}>{profile.name}&apos;s Progress 🇮🇳</Text>
          <Text style={styles.subgreet}>
            Level {level.level} · {level.name} · {prog.xp} XP
          </Text>
        </View>

        <View style={styles.row}>
          <Tile label="Stories Read" value={prog.completed_stories.length} of={totalStories} icon="book" color={C.saffron} />
          <Tile label="Badges Earned" value={prog.badges.length} of={totalBadges} icon="ribbon" color={C.gold} />
        </View>
        <View style={styles.row}>
          <Tile label="Heroes Found" value={prog.discovered_heroes.length} of={totalHeroes} icon="location" color={C.green} />
          <Tile label="Battle Cries" value={prog.battle_cries_done.length} of={totalCries} icon="megaphone" color={C.maroon} />
        </View>
        <View style={styles.row}>
          <Tile label="Day Streak" value={prog.streak} icon="flame" color={C.saffron} />
        </View>

        {lastQuiz.length > 0 && (
          <>
            <Text style={styles.section}>📝 Recent Quizzes</Text>
            <View style={styles.listCard}>
              {lastQuiz.map(([sid, q], i) => {
                const story = STORIES.find((s) => s.id === sid);
                return (
                  <View key={sid} style={[styles.listRow, i > 0 && styles.listDivider]}>
                    <Ionicons
                      name={q.score === q.total ? "trophy" : "checkmark-circle"}
                      size={18}
                      color={q.score === q.total ? C.gold : C.green}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listTitle}>{story?.title_en || sid}</Text>
                      <Text style={styles.listSub}>
                        Score {q.score}/{q.total} · {new Date(q.at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <Text style={styles.footerNote}>
          All progress is stored only on this device. There is no online account.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Tile({ label, value, of, icon, color }: any) {
  return (
    <View style={styles.tile}>
      <View style={[styles.tileIcon, { backgroundColor: color + "22" }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.tileVal}>
        {value}
        {of != null && <Text style={styles.tileOf}> / {of}</Text>}
      </Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: C.white, borderBottomWidth: 2, borderBottomColor: C.navy,
  },
  title: { fontSize: 18, fontWeight: "900", color: C.navy },
  heroCard: {
    backgroundColor: C.navy, borderRadius: 22, padding: 20,
    borderWidth: 2, borderColor: C.gold, alignItems: "center", ...SHADOW,
  },
  greeting: { fontSize: 22, fontWeight: "900", color: C.gold, letterSpacing: -0.3 },
  subgreet: { fontSize: 13, color: "#FFFFFFCC", marginTop: 6, fontWeight: "700" },
  row: { flexDirection: "row", gap: 12, marginTop: 14 },
  tile: {
    flex: 1, backgroundColor: C.white, borderRadius: 18, padding: 14,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", ...SHADOW,
  },
  tileIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  tileVal: { fontSize: 24, fontWeight: "900", color: C.navy, marginTop: 8 },
  tileOf: { fontSize: 13, color: C.textMuted, fontWeight: "700" },
  tileLabel: { fontSize: 11, color: C.textMuted, fontWeight: "700", textTransform: "uppercase", marginTop: 2 },
  section: { fontSize: 16, fontWeight: "900", color: C.navy, marginTop: 24, marginBottom: 10 },
  listCard: {
    backgroundColor: C.white, borderRadius: 14, borderWidth: 2, borderColor: C.navy,
    overflow: "hidden",
  },
  listRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14 },
  listDivider: { borderTopWidth: 1, borderTopColor: C.navy + "11" },
  listTitle: { fontSize: 14, fontWeight: "800", color: C.navy },
  listSub: { fontSize: 11, color: C.textMuted, fontWeight: "600", marginTop: 2 },
  footerNote: {
    fontSize: 11, color: C.textMuted, fontWeight: "600",
    textAlign: "center", marginTop: 28, paddingHorizontal: 20,
  },
});
