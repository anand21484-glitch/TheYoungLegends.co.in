import { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { API } from "../../src/api";
import { C, SHADOW } from "../../src/theme";

type Msg = { who: "azaadi" | "kid"; text: string };

const SUGGESTIONS = [
  "Who was Bhagat Singh?",
  "Tell me a brave story!",
  "What is Satyagraha?",
  "Why is Rani Lakshmibai famous?",
];

export default function Azaadi() {
  const [messages, setMessages] = useState<Msg[]>([
    { who: "azaadi", text: "Hoot hoot! 🦉 I'm Azaadi, your wise owl friend. Ask me anything about India's brave freedom fighters!" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await API.get("/me");
        setUser(me.data);
      } catch {}
    })();
  }, []);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || sending) return;
    setInput("");
    setMessages((m) => [...m, { who: "kid", text: msg }]);
    setSending(true);
    try {
      const { data } = await API.post("/chat", { message: msg, language: user?.language || "en" });
      setMessages((m) => [...m, { who: "azaadi", text: data.reply }]);
    } catch (e: any) {
      setMessages((m) => [...m, { who: "azaadi", text: "Oh no, my feathers are tangled. Please try again! 🦉" }]);
    } finally {
      setSending(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    }
  };

  return (
    <SafeAreaView style={styles.c} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.owlAv}>
          <Text style={{ fontSize: 32 }}>🦉</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Azaadi the Owl</Text>
          <Text style={styles.status}>● Wise & online</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          testID="chat-scroll"
        >
          {messages.map((m, i) => (
            <View
              key={i}
              style={[styles.bubbleRow, m.who === "kid" ? styles.right : styles.left]}
              testID={`msg-${i}`}
            >
              <View
                style={[
                  styles.bubble,
                  m.who === "kid" ? styles.bubbleKid : styles.bubbleAzaadi,
                ]}
              >
                <Text style={[styles.bubbleTxt, m.who === "kid" && { color: C.white }]}>
                  {m.text}
                </Text>
              </View>
            </View>
          ))}
          {sending && (
            <View style={[styles.bubbleRow, styles.left]}>
              <View style={[styles.bubble, styles.bubbleAzaadi, { flexDirection: "row", gap: 6 }]}>
                <ActivityIndicator size="small" color={C.navy} />
                <Text style={styles.bubbleTxt}>Azaadi is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {messages.length <= 2 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            style={{ marginBottom: 8 }}
          >
            {SUGGESTIONS.map((s) => (
              <TouchableOpacity
                key={s}
                testID={`sugg-${s}`}
                style={styles.suggestion}
                onPress={() => send(s)}
              >
                <Text style={styles.suggestionTxt}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.inputRow}>
          <TextInput
            testID="chat-input"
            value={input}
            onChangeText={setInput}
            placeholder="Ask Azaadi anything..."
            placeholderTextColor={C.textMuted}
            style={styles.input}
            onSubmitEditing={() => send()}
            returnKeyType="send"
          />
          <TouchableOpacity
            testID="chat-send"
            style={[styles.sendBtn, (!input.trim() || sending) && { opacity: 0.5 }]}
            onPress={() => send()}
            disabled={!input.trim() || sending}
          >
            <Ionicons name="send" size={20} color={C.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream },
  header: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 18, paddingVertical: 14,
    backgroundColor: C.white, borderBottomWidth: 2, borderBottomColor: C.navy,
  },
  owlAv: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: C.gold,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", justifyContent: "center",
  },
  name: { fontSize: 18, fontWeight: "900", color: C.navy },
  status: { fontSize: 12, color: C.green, fontWeight: "700" },
  bubbleRow: { flexDirection: "row", marginVertical: 5 },
  left: { justifyContent: "flex-start" },
  right: { justifyContent: "flex-end" },
  bubble: {
    maxWidth: "82%", paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 20, borderWidth: 2, borderColor: C.navy,
  },
  bubbleAzaadi: { backgroundColor: C.gold, borderTopLeftRadius: 4 },
  bubbleKid: { backgroundColor: C.saffron, borderTopRightRadius: 4 },
  bubbleTxt: { fontSize: 15, lineHeight: 21, color: C.navy, fontWeight: "600" },
  suggestion: {
    backgroundColor: C.white, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 999, borderWidth: 2, borderColor: C.navy,
  },
  suggestionTxt: { fontSize: 13, fontWeight: "800", color: C.navy },
  inputRow: {
    flexDirection: "row", padding: 12, gap: 8, backgroundColor: C.white,
    borderTopWidth: 2, borderTopColor: C.navy, alignItems: "center",
  },
  input: {
    flex: 1, borderWidth: 2, borderColor: C.navy, borderRadius: 999,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15,
    backgroundColor: C.cream, color: C.text,
  },
  sendBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: C.saffron,
    borderWidth: 2, borderColor: C.navy, alignItems: "center", justifyContent: "center",
  },
});
