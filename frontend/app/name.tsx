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
import { VEER_AVATAR_URI } from "../src/veer";
const WELCOME_IMAGE = require('../assets/images/welcome-kid.png.jpg');

export default function NameScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      await setProfile({
        name: clean,
        avatar: "bhagat-singh",
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
            <Text style={styles.brand}>Azaadi Tales</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.heroCircle}>
           <Image source={require('../assets/images/welcome-kid.png.jpg')} style={styles.heroImg} resizeMode="cover" />
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

          <Animated.View entering={FadeInUp.delay(750).duration(600)}>
            <TouchableOpacity
              testID="name-go"
              onPress={submit}
              activeOpacity={0.85}
              disabled={saving}
              style={[styles.goBtn, saving && { opacity: 0.6 }]}
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
    backgroundColor: C.gold, ...SHADOW,
  },
  heroImg: { width: "100%", height: "100%" },
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
