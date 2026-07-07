// First-launch name entry screen.
// One-tap: child types their first name → saved to AsyncStorage → home tabs.

import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Image, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { setProfile, Local } from "../src/data/localStore";
import { C, FF, SHADOW } from "../src/theme";

const WELCOME_IMAGE = require("../assets/images/welcome-kid.png");

type AvatarChoice = "boy" | "girl";

const AVATAR_OPTIONS: { id: AvatarChoice; label: string; emoji: string; bg: string }[] = [
  { id: "boy",  label: "Warrior Boy",  emoji: "⚔️", bg: "#FF9933" },
  { id: "girl", label: "Warrior Girl", emoji: "🏹", bg: "#2E7D32" },
];

export default function NameScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarChoice | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);

  const canSubmit = name.trim().length >= 2 && avatar !== null;

  const submit = async () => {
    const clean = name.trim().replace(/\s+/g, " ");
    if (clean.length < 2) {
      Alert.alert("Oops!", "Please type your name (at least 2 letters).");
      return;
    }
    if (clean.length > 24) {
      Alert.alert("Wow!", "Let's keep your name a little shorter (max 24 letters).");
      return;
    }
    if (!avatar) {
      Alert.alert("Choose your warrior!", "Tap your warrior avatar to continue.");
      return;
    }
    setSaving(true);
    try {
      await setProfile({
        name: clean,
        avatar,
        language: "en",
        createdAt: new Date().toISOString(),
      });
      await Local.touchDailyStreak();
      router.replace("/(tabs)");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.c} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(500)} style={styles.brandRow}>
            <View style={styles.flagDot} />
            <Text style={styles.brand}>Azadi Tales</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.heroCircle}>
            {(!WELCOME_IMAGE || imageError) ? (
              <View style={styles.heroFallback}>
                <Text style={styles.heroFlagEmoji}>🇮🇳</Text>
              </View>
            ) : (
              <Image
                source={WELCOME_IMAGE}
                style={styles.heroImg}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            )}
          </Animated.View>

          <Animated.Text entering={FadeInUp.delay(350).duration(600)} style={styles.greet}>
            🙏 Namaste, brave friend!
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(450).duration(600)} style={styles.question}>
            What&apos;s your name?
          </Animated.Text>

          <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.inputWrap}>
            <TextInput
              testID="name-input"
              value={name}
              onChangeText={setName}
              placeholder="Type your first name..."
              placeholderTextColor="#90A4C2"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="go"
              maxLength={24}
              onSubmitEditing={submit}
              style={styles.input}
            />
          </Animated.View>

          {/* ── Avatar selection ── */}
          <Animated.View entering={FadeInUp.delay(700).duration(600)} style={styles.avatarSection}>
            <Text style={styles.avatarLabel}>Choose Your Avatar</Text>
            <View style={styles.avatarRow}>
              {AVATAR_OPTIONS.map((opt) => {
                const selected = avatar === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    testID={`avatar-${opt.id}`}
                    onPress={() => setAvatar(opt.id)}
                    activeOpacity={0.8}
                    style={styles.avatarItem}
                  >
                    <View
                      style={[
                        styles.avatarCircle,
                        { backgroundColor: opt.bg },
                        selected ? styles.avatarSelected : styles.avatarUnselected,
                      ]}
                    >
                      <Text style={styles.avatarEmoji}>{opt.emoji}</Text>
                      {selected && (
                        <View style={styles.checkBadge}>
                          <Text style={styles.checkMark}>✓</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.avatarName, selected && styles.avatarNameSelected]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(850).duration(600)}>
            <TouchableOpacity
              testID="name-go"
              onPress={submit}
              activeOpacity={0.85}
              disabled={saving || !canSubmit}
              style={[styles.goBtn, (!canSubmit || saving) && styles.goBtnDisabled]}
            >
              <Text style={styles.goTxt}>Let&apos;s Go! 🇮🇳</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.privacy}>
            Your name stays only on this device. No accounts. No internet needed.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    padding: 24,
    paddingTop: 32,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  flagDot: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: C.saffron, borderWidth: 2, borderColor: C.navy,
  },
  brand: {
    fontSize: 22, fontFamily: FF.heading, color: C.navy, letterSpacing: 0,
  },
  heroCircle: {
    width: 180, height: 180, borderRadius: 90, overflow: "hidden",
    borderWidth: 4, borderColor: C.navy, marginTop: 28,
    backgroundColor: C.saffron, ...SHADOW,
  },
  heroImg: { width: "100%", height: "100%" },
  heroFallback: {
    flex: 1, alignItems: "center", justifyContent: "center",
  },
  heroFlagEmoji: { fontSize: 90, lineHeight: 100 },
  greet: { fontSize: 22, color: C.navy, fontFamily: FF.bodyBold, marginTop: 22, textAlign: "center" },
  question: {
    fontSize: 28, color: C.maroon, fontFamily: FF.heading,
    marginTop: 8, textAlign: "center",
  },
  inputWrap: { width: "100%", marginTop: 28 },
  input: {
    width: "100%",
    backgroundColor: C.white,
    borderWidth: 3,
    borderColor: C.navy,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 18,
    fontFamily: FF.bodyBold,
    color: C.navy,
    textAlign: "center",
    ...SHADOW,
  },
  // Avatar selection
  avatarSection: { width: "100%", alignItems: "center", marginTop: 28 },
  avatarLabel: {
    fontSize: 16, fontFamily: FF.bodyBold, color: C.navy,
    marginBottom: 16, letterSpacing: 0.3,
  },
  avatarRow: { flexDirection: "row", gap: 28 },
  avatarItem: { alignItems: "center", gap: 8 },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: "center", justifyContent: "center",
    borderWidth: 3, ...SHADOW,
  },
  avatarEmoji: { fontSize: 38 },
  avatarSelected: {
    borderColor: C.saffron,
    shadowColor: C.saffron,
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  avatarUnselected: { borderColor: C.navy },
  checkBadge: {
    position: "absolute", bottom: -4, right: -4,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: "#F4C430",
    borderWidth: 2, borderColor: C.white,
    alignItems: "center", justifyContent: "center",
  },
  checkMark: { fontSize: 13, fontFamily: FF.bodyBlack, color: C.navy },
  avatarName: {
    fontSize: 12, fontFamily: FF.bodyBold, color: C.textMuted,
    textAlign: "center",
  },
  avatarNameSelected: { color: C.navy },
  // CTA button
  goBtn: {
    marginTop: 22,
    paddingHorizontal: 48,
    paddingVertical: 18,
    backgroundColor: C.saffron,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: C.navy,
    ...SHADOW,
  },
  goBtnDisabled: { opacity: 0.4 },
  goTxt: { fontSize: 22, fontFamily: FF.heading, color: C.white },
  privacy: {
    marginTop: 28,
    fontSize: 12,
    color: C.textMuted,
    fontFamily: FF.bodySemi,
    textAlign: "center",
    paddingHorizontal: 12,
  },
});
