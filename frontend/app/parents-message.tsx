import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, {
  Defs, LinearGradient as SvgGradient, Stop, Rect, Circle, Line, G,
} from "react-native-svg";
import { FF } from "../src/theme";

const { width: SW, height: SH } = Dimensions.get("window");
const CHAKRA_R = SW * 0.42;
const HUB_R    = CHAKRA_R * 0.12;
const INNER_R  = CHAKRA_R * 0.18;

const SPOKES = Array.from({ length: 24 }, (_, i) => {
  const rad = (i * Math.PI * 2) / 24;
  return { x1: HUB_R * Math.cos(rad), y1: HUB_R * Math.sin(rad),
           x2: CHAKRA_R * Math.cos(rad), y2: CHAKRA_R * Math.sin(rad) };
});

export default function ParentsMessage() {
  const router = useRouter();

  const onBegin = async () => {
    await AsyncStorage.setItem("parents_message_seen", "true");
    router.replace("/name" as any);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* ── Gradient background + Ashoka Chakra watermark ── */}
      <Svg style={StyleSheet.absoluteFillObject} width={SW} height={SH}>
        <Defs>
          <SvgGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0"   stopColor="#0A1628" stopOpacity="1" />
            <Stop offset="0.5" stopColor="#8B2500" stopOpacity="1" />
            <Stop offset="1"   stopColor="#0A3D1F" stopOpacity="1" />
          </SvgGradient>
        </Defs>
        <Rect width={SW} height={SH} fill="url(#bg)" />

        <G opacity={0.06} transform={`translate(${SW / 2}, ${SH / 2})`}>
          <Circle r={CHAKRA_R} stroke="white" strokeWidth={CHAKRA_R * 0.055} fill="none" />
          <Circle r={INNER_R}  stroke="white" strokeWidth={CHAKRA_R * 0.035} fill="none" />
          <Circle r={HUB_R}    fill="white" />
          {SPOKES.map((s, i) => (
            <Line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              stroke="white" strokeWidth={CHAKRA_R * 0.022} />
          ))}
        </G>
      </Svg>

      {/* ── Content ── */}
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text style={s.header}>🇮🇳  Message for Parents  🇮🇳</Text>

          {/* Opening hook */}
          <View style={s.hookWrap}>
            <Text style={s.hook}>
              Every Child Knows Batman.{"\n"}Every Child Knows Spider-Man.{"\n"}
              But Does Every Child Know{" "}
              <Text style={s.hookGold}>Bhagat Singh?</Text>
            </Text>
          </View>

          {/* Section cards */}
          <Card
            heading="What Is Azadi Tales?"
            body="Azadi Tales brings India's greatest freedom fighters to life through engaging stories and interactive experiences designed for young minds. These are not just stories from history—they are lessons in courage, character, and purpose."
          />
          <Card
            heading="Why Does It Matter?"
            body="Today's children know countless fictional heroes, yet many know little about the real heroes who gave us our freedom. Beyond school celebrations and textbooks, these inspiring stories deserve a place in every child's everyday life—helping them understand bravery, sacrifice, and the values that built our nation."
          />
          <Card
            heading="How Will It Shape Your Child?"
            body="Think of Azadi Tales as a simple bedtime ritual—a few meaningful minutes together, discovering one inspiring story and one lifelong lesson. As children admire real heroes, they naturally develop courage, resilience, confidence, leadership, and pride in their heritage. And perhaps these stories are not just for children—they remind us, as parents, to lead with courage, values, and compassion."
          />

          {/* Closing */}
          <Text style={s.closingBold}>
            10 Minutes Before Bed. A Lifetime of Inspiration.
          </Text>
          <Text style={s.closingSub}>
            The heroes who won our freedom deserve more than a chapter in a
            textbook. They deserve a place in every child's heart.
          </Text>

          {/* CTA */}
          <TouchableOpacity
            style={s.cta}
            onPress={onBegin}
            activeOpacity={0.85}
            testID="begin-journey-btn"
          >
            <Text style={s.ctaTxt}>Begin the Journey 🇮🇳</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Card({ heading, body }: { heading: string; body: string }) {
  return (
    <View style={s.card}>
      <Text style={s.cardHeading}>{heading}</Text>
      <Text style={s.cardBody}>{body}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 48,
    alignItems: "center",
  },
  header: {
    fontFamily: FF.heading,
    fontSize: 20,
    color: "#FF9933",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 28,
  },
  hookWrap: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  hook: {
    fontFamily: FF.bodyBold,
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 30,
  },
  hookGold: {
    color: "#FFD700",
    fontFamily: FF.bodyBlack,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  cardHeading: {
    fontFamily: FF.heading,
    fontSize: 17,
    color: "#FF9933",
    marginBottom: 10,
  },
  cardBody: {
    fontFamily: FF.body,
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 24,
  },
  closingBold: {
    fontFamily: FF.bodyBlack,
    fontSize: 18,
    color: "#FF9933",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
    lineHeight: 26,
  },
  closingSub: {
    fontFamily: FF.body,
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 22,
    paddingHorizontal: 8,
    marginBottom: 36,
  },
  cta: {
    width: "100%",
    backgroundColor: "#FF9933",
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  ctaTxt: {
    fontFamily: FF.bodyBlack,
    fontSize: 18,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
