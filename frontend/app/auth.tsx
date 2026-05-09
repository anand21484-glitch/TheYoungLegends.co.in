import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { API, saveAuth } from "../src/api";
import { C, SHADOW } from "../src/theme";

const AVATARS = ["🦉", "🦁", "🐯", "🐘", "🦚", "🦅"];

export default function Auth() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(8);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Oops!", "Please fill in username and password");
      return;
    }
    setLoading(true);
    try {
      const path = mode === "signup" ? "/auth/signup" : "/auth/login";
      const body: any = { username: username.trim(), password };
      if (mode === "signup") {
        body.age = age;
        body.avatar = avatar;
        body.language = language;
      }
      const { data } = await API.post(path, body);
      await saveAuth(data.token, data.user);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Hoot!", e?.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.c} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.flag}>🦉</Text>
            <Text style={styles.title} testID="auth-title">Azaadi Tales</Text>
            <Text style={styles.subtitle}>
              {mode === "signup" ? "Begin your freedom story!" : "Welcome back, brave heart!"}
            </Text>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              testID="tab-signup"
              style={[styles.tab, mode === "signup" && styles.tabActive]}
              onPress={() => setMode("signup")}
            >
              <Text style={[styles.tabTxt, mode === "signup" && styles.tabTxtActive]}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="tab-login"
              style={[styles.tab, mode === "login" && styles.tabActive]}
              onPress={() => setMode("login")}
            >
              <Text style={[styles.tabTxt, mode === "login" && styles.tabTxtActive]}>Log In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              testID="input-username"
              value={username}
              onChangeText={setUsername}
              placeholder="e.g. brave_tiger"
              placeholderTextColor={C.textMuted}
              autoCapitalize="none"
              style={styles.input}
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              testID="input-password"
              value={password}
              onChangeText={setPassword}
              placeholder="At least 4 characters"
              placeholderTextColor={C.textMuted}
              secureTextEntry
              style={styles.input}
            />

            {mode === "signup" && (
              <>
                <Text style={styles.label}>Age</Text>
                <View style={styles.row}>
                  {[6, 8, 10, 12, 14].map((a) => (
                    <TouchableOpacity
                      key={a}
                      testID={`age-${a}`}
                      style={[styles.chip, age === a && styles.chipActive]}
                      onPress={() => setAge(a)}
                    >
                      <Text style={[styles.chipTxt, age === a && styles.chipTxtActive]}>{a}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Pick Your Avatar</Text>
                <View style={styles.row}>
                  {AVATARS.map((a) => (
                    <TouchableOpacity
                      key={a}
                      testID={`avatar-${a}`}
                      style={[styles.avatar, avatar === a && styles.avatarActive]}
                      onPress={() => setAvatar(a)}
                    >
                      <Text style={{ fontSize: 28 }}>{a}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Language</Text>
                <View style={styles.row}>
                  <TouchableOpacity
                    testID="lang-en"
                    style={[styles.chip, language === "en" && styles.chipActive]}
                    onPress={() => setLanguage("en")}
                  >
                    <Text style={[styles.chipTxt, language === "en" && styles.chipTxtActive]}>English</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="lang-hi"
                    style={[styles.chip, language === "hi" && styles.chipActive]}
                    onPress={() => setLanguage("hi")}
                  >
                    <Text style={[styles.chipTxt, language === "hi" && styles.chipTxtActive]}>हिंदी</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <TouchableOpacity
              testID="submit-btn"
              style={[styles.cta, loading && { opacity: 0.6 }]}
              onPress={submit}
              disabled={loading}
            >
              <Text style={styles.ctaTxt}>
                {loading ? "..." : mode === "signup" ? "Start My Adventure 🚀" : "Log In 🔓"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  scroll: { padding: 20, paddingBottom: 60 },
  header: { alignItems: "center", marginVertical: 16 },
  flag: { fontSize: 64 },
  title: { fontSize: 36, fontWeight: "900", color: C.navy, letterSpacing: -1 },
  subtitle: { fontSize: 15, fontWeight: "600", color: C.textSecondary, marginTop: 4 },
  tabs: { flexDirection: "row", gap: 12, marginVertical: 16 },
  tab: {
    flex: 1, paddingVertical: 14, borderRadius: 999, borderWidth: 2,
    borderColor: C.navy, backgroundColor: C.white, alignItems: "center",
  },
  tabActive: { backgroundColor: C.saffron },
  tabTxt: { fontSize: 15, fontWeight: "800", color: C.navy },
  tabTxtActive: { color: C.white },
  card: {
    backgroundColor: C.white, borderRadius: 24, padding: 20, borderWidth: 2,
    borderColor: C.navy, ...SHADOW,
  },
  label: { fontSize: 13, fontWeight: "800", color: C.navy, marginTop: 14, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  input: {
    borderWidth: 2, borderColor: C.navy, borderRadius: 16, padding: 14,
    fontSize: 16, color: C.text, backgroundColor: C.cream,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999,
    borderWidth: 2, borderColor: C.navy, backgroundColor: C.white,
  },
  chipActive: { backgroundColor: C.green, borderColor: C.green },
  chipTxt: { fontSize: 14, fontWeight: "800", color: C.navy },
  chipTxtActive: { color: C.white },
  avatar: {
    width: 56, height: 56, borderRadius: 16, borderWidth: 2,
    borderColor: C.navy, backgroundColor: C.white,
    alignItems: "center", justifyContent: "center",
  },
  avatarActive: { backgroundColor: C.gold, borderColor: C.gold },
  cta: {
    marginTop: 22, backgroundColor: C.saffron, paddingVertical: 18,
    borderRadius: 999, alignItems: "center", borderWidth: 2, borderColor: C.navy,
    ...SHADOW,
  },
  ctaTxt: { fontSize: 17, fontWeight: "900", color: C.white, letterSpacing: 0.3 },
});
