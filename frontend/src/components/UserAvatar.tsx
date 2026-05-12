/**
 * Renders a user avatar — either a freedom-fighter AI portrait (when the
 * avatar value is a known hero story_id) or a legacy emoji (e.g. "🦉").
 * Backward-compatible with users created before the hero-avatar change.
 */
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { C } from "../theme";

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

// The 6 hero IDs offered as avatar choices on signup. Keep in sync with auth.tsx.
export const HERO_AVATARS: { id: string; name: string; color: string }[] = [
  { id: "bhagat-singh",      name: "Bhagat Singh",       color: "#D72638" },
  { id: "rani-lakshmibai",   name: "Rani Lakshmibai",    color: "#7B1FA2" },
  { id: "mahatma-gandhi",    name: "Gandhi",             color: "#1A365D" },
  { id: "subhas-bose",       name: "Subhas Bose",        color: "#388E3C" },
  { id: "sarojini-naidu",    name: "Sarojini Naidu",     color: "#E91E63" },
  { id: "birsa-munda",       name: "Birsa Munda",        color: "#5D4037" },
];

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
  const isHero = isHeroAvatar(avatar);

  if (isHero) {
    const uri = `${BASE}/api/stories/${avatar}/portrait`;
    return (
      <View
        style={[
          styles.wrap,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor,
            borderWidth,
            backgroundColor: showBackground ? C.white : "transparent",
          },
        ]}
      >
        <Image
          source={{ uri }}
          style={{ width: size - borderWidth * 2, height: size - borderWidth * 2, borderRadius: (size - borderWidth * 2) / 2 }}
        />
      </View>
    );
  }

  // Fallback — emoji string (legacy users) OR initial letter
  const fallback = avatar || "🦉";
  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
          borderWidth,
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
