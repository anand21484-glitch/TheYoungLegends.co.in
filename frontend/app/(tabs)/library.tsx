import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

export default function Library() {
  const router = useRouter();
  const [stories, setStories] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<"en" | "hi">("en");

  useEffect(() => {
    (async () => {
      try {
        const [s, u] = await Promise.all([API.get("/stories"), API.get("/me")]);
        setStories(s.data);
        setUser(u.data);
        setLang((u.data.language as any) || "en");
      } catch {}
    })();
  }, []);

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Story Library</Text>
          <Text style={styles.subtitle}>{stories.length} brave heroes await</Text>
        </View>
        <View style={styles.langSwitch}>
          <TouchableOpacity
            testID="lib-lang-en"
            style={[styles.langBtn, lang === "en" && styles.langBtnActive]}
            onPress={() => setLang("en")}
          >
            <Text style={[styles.langTxt, lang === "en" && styles.langTxtActive]}>EN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="lib-lang-hi"
            style={[styles.langBtn, lang === "hi" && styles.langBtnActive]}
            onPress={() => setLang("hi")}
          >
            <Text style={[styles.langTxt, lang === "hi" && styles.langTxtActive]}>हिं</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }} testID="library-scroll">
        <TouchableOpacity
          testID="library-timeline-cta"
          activeOpacity={0.85}
          onPress={() => router.push("/timeline" as any)}
          style={styles.timelineCta}
        >
          <View style={styles.timelineIconWrap}>
            <Ionicons name="time" size={26} color={C.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.timelineTag}>INTERACTIVE TIMELINE 🕰️</Text>
            <Text style={styles.timelineTitle}>Walk through 250 years of Indian courage</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={C.white} />
        </TouchableOpacity>

        {stories.map((s, idx) => {
          const done = user?.completed_stories?.includes(s.id);
          const isLeft = idx % 2 === 0;
          return (
            <TouchableOpacity
              key={s.id}
              testID={`lib-story-${s.id}`}
              activeOpacity={0.85}
              onPress={() => router.push(`/story/${s.id}` as any)}
              style={[
                styles.card,
                { backgroundColor: s.color, marginLeft: isLeft ? 0 : 28, marginRight: isLeft ? 28 : 0 },
              ]}
            >
              <View style={styles.cardTopRow}>
                <Text style={styles.cardEra}>{s.era}</Text>
                {done && (
                  <View style={styles.doneBadge}>
                    <Ionicons name="checkmark" size={14} color={C.white} />
                    <Text style={styles.doneTxt}>Read</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardName}>{s.name}</Text>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {lang === "hi" ? s.title_hi : s.title_en}
              </Text>
              <Text style={styles.cardTag} numberOfLines={2}>
                {lang === "hi" ? s.tagline_hi : s.tagline_en}
              </Text>
              <View style={styles.cardCta}>
                <Text style={styles.cardCtaTxt}>{done ? "Read Again" : "Start Story"}</Text>
                <Ionicons name="arrow-forward" size={14} color={C.navy} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  header: {
    paddingHorizontal: 18, paddingTop: 8, paddingBottom: 14,
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end",
  },
  title: { fontSize: 30, fontWeight: "900", color: C.navy, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: C.textMuted, fontWeight: "700", marginTop: 2 },
  langSwitch: {
    flexDirection: "row", borderRadius: 999, borderWidth: 2, borderColor: C.navy,
    backgroundColor: C.white, overflow: "hidden",
  },
  langBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  langBtnActive: { backgroundColor: C.saffron },
  langTxt: { fontSize: 13, fontWeight: "900", color: C.navy },
  langTxtActive: { color: C.white },
  card: {
    borderRadius: 24, padding: 20, marginBottom: 16,
    borderWidth: 2, borderColor: C.navy, ...SHADOW,
  },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardEra: { color: C.gold, fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  doneBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#00000033", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
  },
  doneTxt: { color: C.white, fontSize: 11, fontWeight: "900" },
  cardName: { color: C.gold, fontSize: 13, fontWeight: "900", letterSpacing: 1, marginBottom: 4 },
  cardTitle: { color: C.white, fontSize: 20, fontWeight: "900", lineHeight: 26 },
  cardTag: { color: "#FFFFFFCC", fontSize: 13, fontWeight: "600", marginTop: 8, lineHeight: 18 },
  cardCta: {
    alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.gold, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 999, marginTop: 14, borderWidth: 2, borderColor: C.navy,
  },
  cardCtaTxt: { color: C.navy, fontWeight: "900", fontSize: 13 },
  timelineCta: {
    flexDirection: "row", alignItems: "center", gap: 14,
    backgroundColor: C.navy, padding: 16, borderRadius: 22,
    borderWidth: 2, borderColor: C.navy, marginBottom: 18, ...SHADOW,
  },
  timelineIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "#FFFFFF22", justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: C.gold,
  },
  timelineTag: { color: C.gold, fontWeight: "900", fontSize: 11, letterSpacing: 1, marginBottom: 2 },
  timelineTitle: { color: C.white, fontSize: 14, fontWeight: "800", lineHeight: 18 },
});
