import { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function JigsawList() {
  const router = useRouter();
  const [puzzles, setPuzzles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const r = await API.get("/jigsaw");
      setPuzzles(r.data);
    } catch (e: any) {
      if (e?.response?.status === 401) router.replace("/auth");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useFocusEffect(useCallback(() => { load(); }, []));

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="jigsaw-back">
          <Ionicons name="arrow-back" size={24} color={C.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Hero Jigsaws</Text>
          <Text style={styles.headerSub}>Reassemble the portrait • +30 XP each</Text>
        </View>
        <View style={styles.iconWrap}>
          <Ionicons name="extension-puzzle" size={26} color={C.gold} />
        </View>
      </View>

      {loading ? (
        <View style={[styles.c, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator size="large" color={C.saffron} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }} testID="jigsaw-scroll">
          {puzzles.map((p) => (
            <TouchableOpacity
              key={p.id}
              testID={`jigsaw-card-${p.id}`}
              activeOpacity={0.85}
              onPress={() => router.push(`/jigsaw/${p.id}` as any)}
              style={[styles.card, { borderColor: p.color }]}
            >
              <Image
                source={{ uri: `${BASE}${p.portrait_url}` }}
                style={[styles.thumb, { borderColor: p.color }]}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.era}>{p.era}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.chip}>
                    <Ionicons name="grid" size={12} color={C.navy} />
                    <Text style={styles.chipTxt}>{p.grid}×{p.grid} pieces</Text>
                  </View>
                  <View style={[styles.chip, { backgroundColor: C.gold }]}>
                    <Ionicons name="star" size={12} color={C.navy} />
                    <Text style={styles.chipTxt}>+{p.xp_reward} XP</Text>
                  </View>
                </View>
              </View>
              {p.solved ? (
                <View style={styles.solvedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color={C.green} />
                  <Text style={styles.solvedTxt}>SOLVED</Text>
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={22} color={C.navy} />
              )}
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
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 22, fontWeight: "900", color: C.navy },
  headerSub: { fontSize: 12, color: C.textMuted, fontWeight: "700", marginTop: 2 },
  iconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.navy, justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: C.navy,
  },
  card: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: C.white, padding: 14, borderRadius: 22,
    borderWidth: 2, marginBottom: 14, ...SHADOW,
  },
  thumb: {
    width: 70, height: 70, borderRadius: 35,
    borderWidth: 2,
  },
  name: { fontSize: 16, fontWeight: "900", color: C.navy },
  era: { fontSize: 11, fontWeight: "700", color: C.textMuted, marginTop: 2 },
  metaRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: C.cream, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, borderWidth: 1.5, borderColor: C.navy,
  },
  chipTxt: { fontSize: 11, fontWeight: "900", color: C.navy },
  solvedBadge: { alignItems: "center", gap: 2 },
  solvedTxt: { fontSize: 10, fontWeight: "900", color: C.green },
});
