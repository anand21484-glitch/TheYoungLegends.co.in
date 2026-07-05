// Entry point — checks for an existing profile and routes immediately.
// New users land on the name-entry welcome screen (name.tsx).
// Returning users skip straight to the tabs.

import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hasProfile } from "../src/data/localStore";
import { C } from "../src/theme";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem("parents_message_seen");
      if (!seen) {
        router.replace("/parents-message" as any);
        return;
      }
      const has = await hasProfile();
      if (has) {
        router.replace("/(tabs)" as any);
      } else {
        router.replace("/name" as any);
      }
    })();
  }, []);

  return (
    <View
      testID="splash-screen"
      style={{ flex: 1, backgroundColor: C.cream, alignItems: "center", justifyContent: "center" }}
    >
      <ActivityIndicator color={C.saffron} size="large" />
    </View>
  );
}
