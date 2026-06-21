import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="name" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="story/[id]" />
        <Stack.Screen name="quiz/[id]" />
        <Stack.Screen name="journal/new" />
        <Stack.Screen name="hunts/index" />
        <Stack.Screen name="hunts/[id]" />
        <Stack.Screen name="timeline" />
        <Stack.Screen name="jigsaw/index" />
        <Stack.Screen name="jigsaw/[id]" />
        <Stack.Screen name="battlecry/index" />
        <Stack.Screen name="battlecry/[id]" />
        <Stack.Screen name="map" />
        <Stack.Screen name="parent-view" />
        <Stack.Screen name="ask/[id]" />
      </Stack>
    </SafeAreaProvider>
  );
}
