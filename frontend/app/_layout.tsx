import { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts, FredokaOne_400Regular } from "@expo-google-fonts/fredoka-one";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_900Black,
} from "@expo-google-fonts/nunito";
import { View, ActivityIndicator } from "react-native";
import { C } from "../src/theme";
import { Local } from "../src/data/localStore";
import { ErrorBoundary } from "../src/components/ErrorBoundary";

// Catch JS errors thrown outside React's render cycle (inside setTimeout
// callbacks, animation chains, async functions) so they get logged instead
// of silently crashing the app. Runs once when this file first loads.
const g = global as any;
if (g.ErrorUtils) {
  const defaultHandler = g.ErrorUtils.getGlobalHandler();
  g.ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    console.error("Global JS error:", error, "fatal:", isFatal);
    defaultHandler(error, isFatal);
  });
}

export default function RootLayout() {
  useEffect(() => {
    Local.touchDailyStreak();
  }, []);

  const [fontsLoaded] = useFonts({
    FredokaOne_400Regular,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: C.cream, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={C.saffron} size="large" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="parents-message" />
            <Stack.Screen name="name" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="story/[id]" />
            <Stack.Screen name="quiz/[id]" />
            <Stack.Screen name="hunts/index" />
            <Stack.Screen name="hunts/[id]" />
            <Stack.Screen name="timeline" />
            <Stack.Screen name="jigsaw/index" />
            <Stack.Screen name="jigsaw/[id]" />
            <Stack.Screen name="battlecry/index" />
            <Stack.Screen name="battlecry/[id]" />
            <Stack.Screen name="parent-view" />
            <Stack.Screen name="ask/[id]" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
