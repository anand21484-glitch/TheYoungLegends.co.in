import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeIn } from "react-native-reanimated";
import { API, getStoredUser } from "../src/api";
import { C, SHADOW } from "../src/theme";

type Story = {
  id: string; name: string; era: string; color: string;
  title_en: string; title_hi: string; tagline_en: string; tagline_hi: string;
};

type Era = {
  key: string;
  start: number;
  end: number;
  label_en: string;
  label_hi: string;
  emoji: string;
  desc_en: string;
  desc_hi: string;
};

const ERAS: Era[] = [
  {
    key: "early",
    start: 1700,
    end: 1856,
    label_en: "Early Resistance",
    label_hi: "प्रारंभिक प्रतिरोध",
    emoji: "🕯️",
    desc_en: "Tribal heroes & local rulers who first fought the British.",
    desc_hi: "आदिवासी नायक और स्थानीय शासक जिन्होंने पहले अंग्रेज़ों से लोहा लिया।",
  },
  {
    key: "1857",
    start: 1857,
    end: 1885,
    label_en: "First War of Independence",
    label_hi: "प्रथम स्वतंत्रता संग्राम",
    emoji: "⚔️",
    desc_en: "Sepoys, queens and generals rose together in 1857.",
    desc_hi: "1857 में सिपाही, रानियाँ और सेनापति एक साथ उठ खड़े हुए।",
  },
  {
    key: "renaissance",
    start: 1886,
    end: 1919,
    label_en: "Awakening & Revolution",
    label_hi: "जागरण और क्रांति",
    emoji: "🌅",
    desc_en: "Poets, leaders and young revolutionaries lit India's fire.",
    desc_hi: "कवि, नेता और नौजवान क्रांतिकारियों ने भारत की आग जलाई।",
  },
  {
    key: "gandhi",
    start: 1920,
    end: 1939,
    label_en: "Gandhi Era",
    label_hi: "गांधी युग",
    emoji: "🕊️",
    desc_en: "Salt March, Civil Disobedience, and the path of Ahimsa.",
    desc_hi: "नमक यात्रा, सविनय अवज्ञा, और अहिंसा का मार्ग।",
  },
  {
    key: "freedom",
    start: 1940,
    end: 1960,
    label_en: "Final March to Freedom",
    label_hi: "स्वतंत्रता की अंतिम यात्रा",
    emoji: "🇮🇳",
    desc_en: "Quit India, INA, and the dawn of independent India.",
    desc_hi: "भारत छोड़ो, आज़ाद हिंद फ़ौज, और स्वतंत्र भारत की भोर।",
  },
];

function parseEraStart(era: string): number {
  // era looks like "1907 - 1931" or "c. 1750 - 1785"
  const m = era.match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : 1900;
}

function pickEraGroup(year: number): Era {
  for (const e of ERAS) {
    if (year >= e.start && year <= e.end) return e;
  }
  return ERAS[0];
}

export default function Timeline() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const u = await getStoredUser();
        if (u?.language) setLang(u.language);
        const [meRes, sts] = await Promise.all([API.get("/me"), API.get("/stories")]);
        setUser(meRes.data);
        setStories(sts.data);
      } catch (e: any) {
        if (e?.response?.status === 401) router.replace("/auth");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.c, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={C.saffron} />
      </SafeAreaView>
    );
  }

  // Sort stories by start year, group by era
  const sorted = [...stories].sort((a, b) => parseEraStart(a.era) - parseEraStart(b.era));
  const grouped: Record<string, { era: Era; items: Story[] }> = {};
  for (const s of sorted) {
    const yr = parseEraStart(s.era);
    const e = pickEraGroup(yr);
    if (!grouped[e.key]) grouped[e.key] = { era: e, items: [] };
    grouped[e.key].items.push(s);
  }
  const orderedEras = ERAS.filter((e) => grouped[e.key]);
  const completed = new Set<string>(user?.completed_stories || []);

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="timeline-back">
          <Ionicons name="arrow-back" size={24} color={C.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Freedom Timeline</Text>
          <Text style={styles.headerSub}>30 heroes • 1700s → 1947</Text>
        </View>
        <View style={styles.iconWrap}>
          <Ionicons name="time" size={22} color={C.gold} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="timeline-scroll">
        <View style={styles.introBox}>
          <Text style={styles.introTitle}>From whispers to roars 🦅</Text>
          <Text style={styles.introTxt}>
            Scroll through 250 years of Indian courage. Tap any hero's card to read their full story.
          </Text>
        </View>

        {orderedEras.map((era) => (
          <View key={era.key} style={styles.eraBlock}>
            <Animated.View entering={FadeIn} style={[styles.eraHeader, { backgroundColor: C.navy }]}>
              <Text style={styles.eraEmoji}>{era.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.eraYears}>
                  {era.start} – {era.end === 1960 ? "1947" : era.end}
                </Text>
                <Text style={styles.eraLabel}>{lang === "hi" ? era.label_hi : era.label_en}</Text>
                <Text style={styles.eraDesc}>{lang === "hi" ? era.desc_hi : era.desc_en}</Text>
              </View>
            </Animated.View>

            <View style={styles.timelineCol}>
              {/* vertical line */}
              <View style={styles.vLine} />

              {grouped[era.key].items.map((s, idx) => {
                const startYear = parseEraStart(s.era);
                const isDone = completed.has(s.id);
                return (
                  <Animated.View
                    key={s.id}
                    entering={FadeInRight.delay(idx * 60)}
                    style={styles.row}
                  >
                    {/* Year badge on the line */}
                    <View style={styles.yearWrap}>
                      <View style={[styles.yearDot, { backgroundColor: s.color }]} />
                      <Text style={styles.yearTxt}>{startYear}</Text>
                    </View>

                    {/* Hero card */}
                    <TouchableOpacity
                      activeOpacity={0.85}
                      testID={`timeline-card-${s.id}`}
                      onPress={() => router.push(`/story/${s.id}` as any)}
                      style={[styles.card, { borderLeftColor: s.color }]}
                    >
                      <View style={styles.cardHead}>
                        <Text style={styles.cardName} numberOfLines={1}>{s.name}</Text>
                        {isDone ? (
                          <Ionicons name="checkmark-circle" size={18} color={C.green} />
                        ) : null}
                      </View>
                      <Text style={styles.cardEra}>{s.era}</Text>
                      <Text style={styles.cardTagline} numberOfLines={2}>
                        {lang === "hi" ? s.tagline_hi : s.tagline_en}
                      </Text>
                      <View style={styles.cardCta}>
                        <Text style={[styles.cardCtaTxt, { color: s.color }]}>Read story</Text>
                        <Ionicons name="arrow-forward" size={13} color={s.color} />
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.endBlock}>
          <Text style={styles.endEmoji}>🇮🇳</Text>
          <Text style={styles.endTitle}>15 August 1947</Text>
          <Text style={styles.endSub}>India is finally free.</Text>
          <Text style={styles.endNote}>
            Every hero you tapped is part of why we are free today. Jai Hind!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const TIMELINE_LEFT = 70; // px from left to vertical line

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
  introBox: {
    margin: 16, padding: 16, borderRadius: 18,
    backgroundColor: C.white, borderWidth: 2, borderColor: C.navy, ...SHADOW,
  },
  introTitle: { fontSize: 16, fontWeight: "900", color: C.navy, marginBottom: 4 },
  introTxt: { fontSize: 13, color: C.textSecondary, lineHeight: 18, fontWeight: "600" },
  eraBlock: { marginBottom: 14 },
  eraHeader: {
    flexDirection: "row", alignItems: "center", gap: 10,
    marginHorizontal: 16, padding: 14, borderRadius: 18,
    borderWidth: 2, borderColor: C.navy, ...SHADOW, marginBottom: 8,
  },
  eraEmoji: { fontSize: 28 },
  eraYears: { color: C.gold, fontWeight: "900", fontSize: 11, letterSpacing: 1 },
  eraLabel: { color: C.white, fontSize: 17, fontWeight: "900", marginTop: 2 },
  eraDesc: { color: "#FFFFFFCC", fontSize: 12, fontWeight: "600", marginTop: 4, lineHeight: 16 },
  timelineCol: { paddingHorizontal: 16, paddingTop: 6 },
  vLine: {
    position: "absolute",
    left: 16 + TIMELINE_LEFT / 2 - 2,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: C.navy,
    opacity: 0.15,
    borderRadius: 2,
  },
  row: {
    flexDirection: "row", alignItems: "stretch", marginBottom: 14, paddingLeft: 0,
  },
  yearWrap: {
    width: TIMELINE_LEFT,
    alignItems: "center",
    paddingTop: 14,
  },
  yearDot: {
    width: 18, height: 18, borderRadius: 10,
    borderWidth: 3, borderColor: C.white,
    // shadow ring
    elevation: 3,
  },
  yearTxt: {
    marginTop: 4, fontSize: 11, fontWeight: "900",
    color: C.navy, backgroundColor: C.white,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
    borderWidth: 1, borderColor: C.navy,
  },
  card: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: C.navy,
    borderLeftWidth: 6,
    ...SHADOW,
  },
  cardHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardName: { fontSize: 15, fontWeight: "900", color: C.navy, flex: 1, marginRight: 6 },
  cardEra: { fontSize: 11, fontWeight: "700", color: C.textMuted, marginTop: 2 },
  cardTagline: { fontSize: 12, fontWeight: "600", color: C.textSecondary, marginTop: 6, lineHeight: 16 },
  cardCta: {
    flexDirection: "row", alignItems: "center", gap: 4,
    alignSelf: "flex-start", marginTop: 8,
  },
  cardCtaTxt: { fontWeight: "900", fontSize: 12 },
  endBlock: {
    margin: 16, padding: 22, borderRadius: 22,
    backgroundColor: C.green, borderWidth: 2, borderColor: C.navy, ...SHADOW,
    alignItems: "center",
  },
  endEmoji: { fontSize: 44 },
  endTitle: { fontSize: 22, fontWeight: "900", color: C.white, marginTop: 8 },
  endSub: { fontSize: 14, fontWeight: "700", color: "#FFFFFFDD", marginTop: 4 },
  endNote: {
    fontSize: 13, fontWeight: "600", color: C.white, marginTop: 14,
    textAlign: "center", lineHeight: 18,
  },
});
