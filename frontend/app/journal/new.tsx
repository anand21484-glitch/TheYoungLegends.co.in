import { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

export default function NewPost() {
  const router = useRouter();
  const params = useLocalSearchParams<{ story_id?: string }>();
  const [stories, setStories] = useState<any[]>([]);
  const [storyId, setStoryId] = useState<string | undefined>(params.story_id);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/stories").then((r) => setStories(r.data)).catch(() => {});
  }, []);

  const submit = async () => {
    if (text.trim().length < 5) {
      Alert.alert("Hoot!", "Write a bit more (at least 5 characters)");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/journal", { text: text.trim(), story_id: storyId });
      if (!data.ok) {
        Alert.alert("Azaadi says 🦉", data.message + "\n\nReason: " + data.reason);
      } else {
        const msg = data.status === "pending"
          ? "Sent to your parent for approval ✅"
          : "Posted to the community! 🎉";
        Alert.alert("Wonderful!", msg);
        router.back();
      }
    } catch (e: any) {
      Alert.alert("Oops", e?.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.c} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.topBar}>
          <TouchableOpacity testID="np-back" onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color={C.navy} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Write Reflection</Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 18 }} keyboardShouldPersistTaps="handled">
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>💡 Reflection Prompts</Text>
            <Text style={styles.tipTxt}>• What did you learn from this hero?</Text>
            <Text style={styles.tipTxt}>• How will you apply this in your life today?</Text>
            <Text style={styles.tipTxt}>• Share kindly — Azaadi reviews every post 🦉</Text>
          </View>

          <Text style={styles.label}>About which story? (optional)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
            <TouchableOpacity
              testID="story-pick-none"
              style={[styles.pill, !storyId && styles.pillActive]}
              onPress={() => setStoryId(undefined)}
            >
              <Text style={[styles.pillTxt, !storyId && styles.pillTxtActive]}>None</Text>
            </TouchableOpacity>
            {stories.map((s) => (
              <TouchableOpacity
                key={s.id}
                testID={`story-pick-${s.id}`}
                style={[styles.pill, storyId === s.id && styles.pillActive]}
                onPress={() => setStoryId(s.id)}
              >
                <Text style={[styles.pillTxt, storyId === s.id && styles.pillTxtActive]}>{s.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Your reflection</Text>
          <TextInput
            testID="post-input"
            multiline
            value={text}
            onChangeText={setText}
            placeholder="Today I learned..."
            placeholderTextColor={C.textMuted}
            style={styles.textarea}
            maxLength={800}
          />
          <Text style={styles.counter}>{text.length} / 800</Text>

          <TouchableOpacity
            testID="post-submit"
            style={[styles.cta, loading && { opacity: 0.6 }]}
            onPress={submit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={C.white} /> : <Text style={styles.ctaTxt}>Share My Reflection 🚀</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  topBar: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 8,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: C.white,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "900", color: C.navy },
  tipCard: {
    backgroundColor: "#FFF8E7", borderRadius: 18, padding: 14,
    borderWidth: 2, borderColor: C.navy, marginBottom: 18, ...SHADOW,
  },
  tipTitle: { fontSize: 14, fontWeight: "900", color: C.navy, marginBottom: 6 },
  tipTxt: { fontSize: 13, color: C.textSecondary, fontWeight: "600", lineHeight: 19 },
  label: { fontSize: 12, fontWeight: "900", color: C.navy, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    borderWidth: 2, borderColor: C.navy, backgroundColor: C.white, marginRight: 8,
  },
  pillActive: { backgroundColor: C.green, borderColor: C.green },
  pillTxt: { fontSize: 12, fontWeight: "800", color: C.navy },
  pillTxtActive: { color: C.white },
  textarea: {
    minHeight: 160, borderWidth: 2, borderColor: C.navy, borderRadius: 18,
    padding: 14, fontSize: 15, color: C.text, backgroundColor: C.white,
    textAlignVertical: "top", ...SHADOW,
  },
  counter: { fontSize: 11, color: C.textMuted, fontWeight: "700", textAlign: "right", marginTop: 6 },
  cta: {
    backgroundColor: C.saffron, padding: 18, borderRadius: 999, alignItems: "center",
    marginTop: 18, borderWidth: 2, borderColor: C.navy, ...SHADOW,
  },
  ctaTxt: { color: C.white, fontWeight: "900", fontSize: 16 },
});
