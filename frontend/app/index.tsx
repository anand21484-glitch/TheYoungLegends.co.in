import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getStoredToken } from "../src/api";
import { C } from "../src/theme";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const t = await getStoredToken();
      const userRaw = await import("@react-native-async-storage/async-storage").then(m => m.default.getItem("user"));
      const u = userRaw ? JSON.parse(userRaw) : null;
      setTimeout(() => {
        if (t && u?.role === "parent") router.replace("/parent" as any);
        else if (t) router.replace("/(tabs)");
        else router.replace("/auth");
      }, 600);
    })();
  }, []);

  return (
    <View style={styles.c} testID="splash-screen">
      <Text style={styles.flag}>🇮🇳</Text>
      <Text style={styles.title}>Azaadi Tales</Text>
      <Text style={styles.subtitle}>Stories of India&apos;s Brave Hearts</Text>
      <ActivityIndicator size="large" color={C.saffron} style={{ marginTop: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: C.cream, alignItems: "center", justifyContent: "center", padding: 24 },
  flag: { fontSize: 72, marginBottom: 8 },
  title: { fontSize: 38, fontWeight: "900", color: C.navy, letterSpacing: -1 },
  subtitle: { fontSize: 16, fontWeight: "600", color: C.textSecondary, marginTop: 8 },
});
