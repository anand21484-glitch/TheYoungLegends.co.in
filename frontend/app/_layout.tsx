import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts, FredokaOne_400Regular } from "@expo-google-fonts/fredoka-one";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_900Black,
} from "@expo-google-fonts/nunito";
import { View, ActivityIndicator } from "react-native";
import { C } from "../src/theme";

export default function RootLayout() {
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
        <Stack.Screen name="ask/[id]" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
