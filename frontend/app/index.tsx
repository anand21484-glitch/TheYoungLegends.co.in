import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp, ZoomIn } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStoredToken } from "../src/api";
import { C, SHADOW } from "../src/theme";

const { width: SCREEN_W } = Dimensions.get("window");

// Simple 24-spoke Ashoka Chakra built with rotated lines (no SVG dependency)
function Chakra({ size = 110 }: { size?: number }) {
  const spokes = Array.from({ length: 24 });
  return (
    <View style={[chakraStyles.outer, { width: size, height: size, borderRadius: size / 2 }]}>
      {spokes.map((_, i) => (
        <View
          key={i}
          style={[
            chakraStyles.spoke,
            {
              width: size * 0.46,
              height: 2,
              left: size * 0.27,
              top: size / 2 - 1,
              transform: [{ rotate: `${i * 15}deg` }],
            },
          ]}
        />
      ))}
      <View
        style={[
          chakraStyles.hub,
          { width: size * 0.18, height: size * 0.18, borderRadius: size * 0.09 },
        ]}
      />
    </View>
  );
}

// Official Indian flag Ashok Chakra navy
const CHAKRA_NAVY = "#000080";

const chakraStyles = StyleSheet.create({
  outer: {
    borderWidth: 3,
    borderColor: CHAKRA_NAVY,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  spoke: {
    position: "absolute",
    backgroundColor: CHAKRA_NAVY,
  },
  hub: {
    backgroundColor: CHAKRA_NAVY,
    position: "absolute",
  },
});

export default function Welcome() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [routeAfter, setRouteAfter] = useState<"tabs" | "parent" | "auth">("auth");

  useEffect(() => {
    (async () => {
      try {
        const t = await getStoredToken();
        const raw = await AsyncStorage.getItem("user");
        const u = raw ? JSON.parse(raw) : null;
        if (t && u?.role === "parent") setRouteAfter("parent");
        else if (t) setRouteAfter("tabs");
        else setRouteAfter("auth");
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const proceed = () => {
    if (routeAfter === "parent") router.replace("/parent" as any);
    else if (routeAfter === "tabs") router.replace("/(tabs)" as any);
    else router.replace("/auth" as any);
  };

  return (
    <View style={styles.root} testID="welcome-screen">
      {/* Indian Flag background: saffron / white(card) / green bands */}
      <View style={[styles.band, styles.saffronBand]} />
      <View style={[styles.band, styles.whiteBand]} />
      <View style={[styles.band, styles.greenBand]} />

      {/* Chakra decoration faintly behind the card */}
      <View pointerEvents="none" style={styles.chakraWrap}>
        <Chakra size={Math.min(SCREEN_W * 0.7, 320)} />
      </View>

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scrollBody}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInUp.duration(500)} style={styles.headerRow}>
            <View style={styles.miniFlag}>
              <View style={[styles.miniBand, { backgroundColor: C.saffron }]} />
              <View style={[styles.miniBand, { backgroundColor: C.white, justifyContent: "center", alignItems: "center" }]}>
                <Chakra size={10} />
              </View>
              <View style={[styles.miniBand, { backgroundColor: C.green }]} />
            </View>
            <Text style={styles.brand}>Azaadi Tales</Text>
          </Animated.View>

          <Animated.View entering={ZoomIn.delay(200).duration(500)} style={styles.crownWrap}>
            <View style={styles.crownPill}>
              <Ionicons name="people" size={16} color={C.navy} />
              <Text style={styles.crownTxt}>FOR PARENTS</Text>
            </View>
          </Animated.View>

          <Animated.Text entering={FadeInUp.delay(300).duration(500)} style={styles.heroTitle}>
            Welcome to the world of{"\n"}
            <Text style={styles.heroAccent}>India's Brave Hearts!</Text>
          </Animated.Text>

          <Animated.View entering={FadeIn.delay(450).duration(600)} style={styles.card}>
            <Para>
              This app is specially created for{" "}
              <Bold>children aged 5 to 10 years</Bold> to help them learn about the
              inspiring lives of India's greatest freedom fighters in a fun and
              engaging way. Through{" "}
              <Bold>stories, activities, quizzes, and adventures</Bold>, kids will
              discover the courage, kindness, leadership, and patriotism of the
              heroes who fought for our country's freedom.
            </Para>

            <View style={styles.divider} />

            <SectionLabel icon="bulb" color={C.saffron} text="Why is this important?" />
            <Para>
              Freedom fighters teach us valuable life lessons such as{" "}
              <Bold>bravery, honesty, discipline, teamwork, and love for our nation</Bold>.
              Their stories inspire children to become{" "}
              <Bold>confident, responsible, and caring individuals</Bold>.
            </Para>

            <View style={styles.divider} />

            <SectionLabel icon="rocket" color={C.green} text="How will this app help?" />
            <Para>
              By exploring the journeys of these great heroes, children will
              develop <Bold>confidence, moral values, curiosity, and positive thinking</Bold>.
              The app makes learning enjoyable while helping kids build a{" "}
              <Bold>strong personality, respect for the nation, and pride in India's rich history</Bold>.
              Every story is a step toward becoming a{" "}
              <Bold>brave and kind future leader</Bold>.
            </Para>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.featureRow}>
            <FeaturePill icon="book" label="30 Stories" />
            <FeaturePill icon="trophy" label="3 Hunts" />
            <FeaturePill icon="time" label="Timeline" />
            <FeaturePill icon="chatbubbles" label="AI Owl" />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(900).duration(500)}>
            <TouchableOpacity
              testID="welcome-begin-btn"
              activeOpacity={0.85}
              disabled={checking}
              onPress={proceed}
              style={styles.cta}
            >
              <Text style={styles.ctaTxt}>Let's Begin the Journey</Text>
              <Ionicons name="arrow-forward" size={20} color={C.white} />
            </TouchableOpacity>
            <Text style={styles.tinyHint}>
              Jai Hind! 🇮🇳 Every story is a step toward a brave young heart.
            </Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Para({ children }: any) {
  return <Text style={styles.para}>{children}</Text>;
}

function Bold({ children }: any) {
  return <Text style={styles.bold}>{children}</Text>;
}

function SectionLabel({ icon, color, text }: any) {
  return (
    <View style={styles.sectionRow}>
      <View style={[styles.sectionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={16} color={C.white} />
      </View>
      <Text style={styles.sectionTxt}>{text}</Text>
    </View>
  );
}

function FeaturePill({ icon, label }: any) {
  return (
    <View style={styles.pill}>
      <Ionicons name={icon} size={14} color={C.navy} />
      <Text style={styles.pillTxt}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.white },
  band: { position: "absolute", left: 0, right: 0 },
  saffronBand: { top: 0, height: "33.4%", backgroundColor: C.saffron },
  whiteBand:   { top: "33.4%", height: "33.4%", backgroundColor: C.white },
  greenBand:   { top: "66.6%", bottom: 0, backgroundColor: C.green },
  chakraWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.18,
  },
  safe: { flex: 1 },
  scrollBody: {
    padding: 20,
    paddingTop: 14,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    alignSelf: "center",
    backgroundColor: "#FFFFFFEE", paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy, ...SHADOW,
  },
  miniFlag: {
    width: 30, height: 22,
    borderRadius: 4, overflow: "hidden",
    borderWidth: 1.5, borderColor: C.navy,
  },
  miniBand: { flex: 1 },
  brand: { fontSize: 20, fontWeight: "900", color: C.navy, letterSpacing: -0.5 },
  crownWrap: { alignItems: "center", marginTop: 18 },
  crownPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.gold, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy,
  },
  crownTxt: { color: C.navy, fontWeight: "900", letterSpacing: 1.2, fontSize: 11 },
  heroTitle: {
    fontSize: 26, fontWeight: "900", color: C.navy,
    textAlign: "center", marginTop: 12, lineHeight: 32, letterSpacing: -0.5,
  },
  heroAccent: { color: C.maroon, fontSize: 28 },
  card: {
    marginTop: 18,
    backgroundColor: "#FFFFFFF7",
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: C.navy,
    ...SHADOW,
  },
  para: {
    fontSize: 14,
    color: C.text,
    lineHeight: 22,
    fontWeight: "500",
  },
  bold: { fontWeight: "900", color: C.navy },
  divider: {
    height: 1,
    backgroundColor: C.navy,
    opacity: 0.12,
    marginVertical: 16,
  },
  sectionRow: {
    flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10,
  },
  sectionIcon: {
    width: 30, height: 30, borderRadius: 15,
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: C.navy,
  },
  sectionTxt: { fontSize: 16, fontWeight: "900", color: C.navy },
  featureRow: {
    flexDirection: "row", justifyContent: "center", flexWrap: "wrap",
    gap: 8, marginTop: 18,
  },
  pill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#FFFFFFEE",
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy,
  },
  pillTxt: { fontSize: 12, fontWeight: "900", color: C.navy },
  cta: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: C.maroon,
    paddingHorizontal: 22, paddingVertical: 16,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy,
    marginTop: 22, ...SHADOW,
  },
  ctaTxt: { color: C.white, fontWeight: "900", fontSize: 16 },
  tinyHint: {
    textAlign: "center", marginTop: 14,
    fontSize: 12, fontWeight: "700", color: C.navy,
    backgroundColor: "#FFFFFFCC",
    alignSelf: "center", paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 999,
  },
});
