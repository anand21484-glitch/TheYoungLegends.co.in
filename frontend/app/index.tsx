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
            Every Child Knows Batman.{"\n"}
            Every Child Knows Spider-Man.{"\n"}
            <Text style={styles.heroAccent}>But Does Every Child Know Bhagat Singh?</Text>
          </Animated.Text>

          <Animated.View entering={FadeIn.delay(450).duration(600)} style={styles.card}>
            <SectionLabel icon="book" color={C.saffron} text="What Is This App?" />
            <Para>
              This app brings the stories of <Bold>India's freedom fighters</Bold> to
              life through engaging, child-friendly storytelling and interactive
              experiences.
            </Para>
            <Para style={{ marginTop: 8 }}>
              From <Bold>Bhagat Singh</Bold> and <Bold>Rani Lakshmibai</Bold> to{" "}
              <Bold>Subhas Chandra Bose</Bold> and <Bold>Mahatma Gandhi</Bold>,
              children discover the real heroes whose courage, sacrifice, and
              determination shaped the India we live in today.
            </Para>
            <Para style={{ marginTop: 8 }}>
              These are not just stories from history. They are{" "}
              <Bold>lessons in character, courage, and purpose</Bold>.
            </Para>

            <View style={styles.divider} />

            <SectionLabel icon="heart" color={C.maroon} text="Why Does It Matter?" />
            <Para>
              Today's children are surrounded by cartoons, social media, and
              endless digital entertainment. They can name dozens of fictional
              heroes, yet many know very little about the brave men and women who
              sacrificed everything for our freedom.
            </Para>
            <Para style={{ marginTop: 8 }}>
              For most families, freedom fighters become a topic of conversation
              only during Independence Day, school projects, or annual events.
            </Para>
            <Para style={{ marginTop: 8 }}>
              But shouldn't our children know the{" "}
              <Bold>real heroes of our nation</Bold> just as well?
            </Para>
            <Para style={{ marginTop: 8 }}>
              Their stories teach values that remain timeless—<Bold>courage in
              adversity, resilience in failure, leadership in uncertainty</Bold>,
              and the strength to stand up for what is right.
            </Para>

            <View style={styles.divider} />

            <SectionLabel icon="rocket" color={C.green} text="How Will It Shape Your Child?" />
            <Para>
              Think of this app as a simple <Bold>10-minute bedtime ritual</Bold>.
            </Para>
            <Para style={{ marginTop: 8 }}>
              A few minutes spent together discovering a story, reflecting on a
              lesson, and asking one simple question:
            </Para>
            <View style={styles.quoteBox}>
              <Text style={styles.quoteTxt}>
                "What can we learn from this hero today?"
              </Text>
            </View>
            <Para style={{ marginTop: 8 }}>
              Over time, these small moments can leave a lasting impact. Children
              begin to develop <Bold>confidence, courage, resilience, leadership</Bold>,
              and a deeper appreciation for the freedom they enjoy today.
            </Para>
            <Para style={{ marginTop: 8 }}>
              Because <Bold>children become what they admire</Bold>. And when
              they admire real heroes, they grow into stronger individuals.
            </Para>

            <View style={styles.closingQuote}>
              <Text style={styles.closingQuoteTxt}>
                "And perhaps these stories are not just for children. As parents,
                they remind us too—to be courageous when life is difficult, to
                stand by our values, and to lead by example."
              </Text>
            </View>
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

function Para({ children, style }: any) {
  return <Text style={[styles.para, style]}>{children}</Text>;
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
    fontSize: 20, fontWeight: "900", color: C.navy,
    textAlign: "center", marginTop: 12, lineHeight: 26, letterSpacing: -0.3,
  },
  heroAccent: { color: C.maroon, fontSize: 22 },
  card: {
    marginTop: 18,
    backgroundColor: "#FFFFFFF7",
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: C.navy,
    ...SHADOW,
  },
  quoteBox: {
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF8EC",
    borderLeftWidth: 4,
    borderLeftColor: C.gold,
    borderRadius: 10,
  },
  quoteTxt: {
    fontSize: 15, fontStyle: "italic", fontWeight: "800",
    color: C.navy, textAlign: "center", lineHeight: 22,
  },
  closingQuote: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: "#FFF8EC",
    borderLeftWidth: 4,
    borderLeftColor: C.maroon,
    borderRadius: 12,
  },
  closingQuoteTxt: {
    fontSize: 14, fontStyle: "italic", fontWeight: "700",
    color: C.navy, lineHeight: 22, textAlign: "center",
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
