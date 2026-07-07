/**
 * Renders a user avatar — either a freedom-fighter AI portrait (when the
 * avatar value is a known hero story_id), a warrior avatar (boy/girl), or
 * a legacy emoji (e.g. "🦉").
 * Backward-compatible with users created before the hero-avatar change.
 */
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { C } from "../theme";
import { PORTRAITS } from "../data";

// The 6 hero IDs offered as avatar choices on signup. Keep in sync with auth.tsx.
export const HERO_AVATARS: { id: string; name: string; color: string }[] = [
  { id: "bhagat-singh",      name: "Bhagat Singh",       color: "#D72638" },
  { id: "rani-lakshmibai",   name: "Rani Lakshmibai",    color: "#7B1FA2" },
  { id: "mahatma-gandhi",    name: "Gandhi",             color: "#1A365D" },
  { id: "subhas-bose",       name: "Subhas Bose",        color: "#388E3C" },
  { id: "sarojini-naidu",    name: "Sarojini Naidu",     color: "#E91E63" },
  { id: "birsa-munda",       name: "Birsa Munda",        color: "#5D4037" },
];

// Warrior avatars — placeholder emoji until real Ghibli images are added.
// To swap in a real image: replace the emoji config with require("../../assets/images/avatar-boy.png")
// and update the render path below.
const WARRIOR_AVATARS: Record<string, { emoji: string; bg: string }> = {
  boy:  { emoji: "⚔️", bg: C.saffron },
  girl: { emoji: "🏹", bg: "#138808" },
};

const HERO_ID_SET = new Set(HERO_AVATARS.map((h) => h.id));

export function isHeroAvatar(avatar: string | null | undefined): boolean {
  return !!avatar && HERO_ID_SET.has(avatar);
}

export function UserAvatar({
  avatar,
  size = 48,
  borderColor = C.navy,
  borderWidth = 2,
  showBackground = true,
}: {
  avatar?: string | null;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
  showBackground?: boolean;
}) {
  // ── Warrior avatars (boy / girl) ──────────────────────────────────────────
  if (avatar === "boy" || avatar === "girl") {
    const w = WARRIOR_AVATARS[avatar];
    return (
      <View
        style={[
          styles.wrap,
          {
            width: size, height: size, borderRadius: size / 2,
            borderColor, borderWidth,
            backgroundColor: showBackground ? w.bg : "transparent",
          },
        ]}
      >
        <Text style={{ fontSize: size * 0.48 }}>{w.emoji}</Text>
      </View>
    );
  }

  // ── Hero portrait avatars ─────────────────────────────────────────────────
  if (isHeroAvatar(avatar)) {
    const source = PORTRAITS[avatar as string];
    return (
      <View
        style={[
          styles.wrap,
          {
            width: size, height: size, borderRadius: size / 2,
            borderColor, borderWidth,
            backgroundColor: showBackground ? C.white : "transparent",
          },
        ]}
      >
        {source ? (
          <Image
            source={source}
            style={{ width: size - borderWidth * 2, height: size - borderWidth * 2, borderRadius: (size - borderWidth * 2) / 2 }}
            resizeMode="cover"
          />
        ) : (
          <Text style={{ fontSize: size * 0.45 }}>🦁</Text>
        )}
      </View>
    );
  }

  // ── Fallback — emoji string (legacy users) ────────────────────────────────
  const fallback = avatar || "🦉";
  return (
    <View
      style={[
        styles.wrap,
        {
          width: size, height: size, borderRadius: size / 2,
          borderColor, borderWidth,
          backgroundColor: showBackground ? C.white : "transparent",
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.55 }}>{fallback}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
