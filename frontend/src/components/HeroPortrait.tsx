/**
 * Animated hero portrait. Tries to load AI-generated image from backend;
 * falls back to a stylized initials card if the request fails.
 */
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing,
} from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";
import { C } from "../theme";

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

export function HeroPortrait({ storyId, name, color, size = 160 }: {
  storyId: string; name: string; color: string; size?: number;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [errored, setErrored] = useState(false);

  // Animated breathing / glow halo
  const breathe = useSharedValue(0);
  const halo = useSharedValue(0);
  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) })
      ), -1, false);
    halo.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ), -1, false);
  }, []);

  // Pre-load the image and set src only if ok
  useEffect(() => {
    let cancelled = false;
    const url = `${BASE}/api/stories/${storyId}/portrait`;
    fetch(url, { method: "GET" }).then((r) => {
      if (cancelled) return;
      if (r.ok && r.headers.get("content-type")?.startsWith("image/")) {
        setSrc(url + `?v=1`);
      } else {
        setErrored(true);
      }
    }).catch(() => !cancelled && setErrored(true));
    return () => { cancelled = true; };
  }, [storyId]);

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breathe.value * 0.04 }],
  }));
  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + halo.value * 0.4,
    transform: [{ scale: 1 + halo.value * 0.15 }],
  }));

  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <View style={[styles.wrap, { width: size, height: size }]} pointerEvents="none">
      {/* Soft glow halo */}
      <Animated.View style={[StyleSheet.absoluteFill, haloStyle]}>
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="halo" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor={color} stopOpacity="0.55" />
              <Stop offset="100%" stopColor={color} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="50%" cy="50%" r="50%" fill="url(#halo)" />
        </Svg>
      </Animated.View>

      {/* Animated portrait body */}
      <Animated.View style={[styles.body, { backgroundColor: color, borderRadius: size / 2 }, breatheStyle]}>
        {src && !errored ? (
          <Image
            source={{ uri: src }}
            style={{ width: size - 12, height: size - 12, borderRadius: (size - 12) / 2 }}
            onError={() => setErrored(true)}
          />
        ) : (
          <Text style={[styles.initials, { fontSize: size * 0.32 }]}>{initials}</Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  body: {
    alignItems: "center", justifyContent: "center",
    borderWidth: 4, borderColor: C.white,
    overflow: "hidden",
  },
  initials: { color: C.white, fontWeight: "900", letterSpacing: 2 },
});
