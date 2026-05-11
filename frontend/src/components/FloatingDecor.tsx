/**
 * Floating decorative shapes (lotus, chakra, sparkles, peacock feather)
 * that gently drift across the screen behind the story content.
 */
import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path, Circle } from "react-native-svg";

const { width: SW, height: SH } = Dimensions.get("window");

function Sparkle({ delay = 0, startX, startY, color = "#FFD700", size = 16 }: any) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.7);
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: delay }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: delay }),
        withTiming(1.2, { duration: 700 }),
        withTiming(0.7, { duration: 700 })
      ),
      -1,
      false
    );
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[{ position: "absolute", left: startX, top: startY }, style]} pointerEvents="none">
      <Ionicons name="sparkles" size={size} color={color} />
    </Animated.View>
  );
}

function Lotus() {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32">
      {[0, 60, 120, 180, 240, 300].map((d) => (
        <Path
          key={d}
          d="M16 16 Q14 4 16 0 Q18 4 16 16 Z"
          fill="#FFB7C5"
          stroke="#D63384"
          strokeWidth={0.5}
          opacity={0.85}
          transform={`rotate(${d} 16 16)`}
        />
      ))}
      <Circle cx="16" cy="16" r="3" fill="#FFD700" />
    </Svg>
  );
}

function Chakra() {
  return (
    <Svg width="28" height="28" viewBox="0 0 28 28">
      <Circle cx="14" cy="14" r="11" fill="none" stroke="#0A2E5C" strokeWidth={1.5} opacity={0.7} />
      {Array.from({ length: 12 }).map((_, i) => (
        <Path
          key={i}
          d="M14 14 L 14 4"
          stroke="#0A2E5C"
          strokeWidth={1}
          opacity={0.6}
          transform={`rotate(${i * 30} 14 14)`}
        />
      ))}
      <Circle cx="14" cy="14" r="2" fill="#0A2E5C" />
    </Svg>
  );
}

function Drifter({
  delay = 0, duration = 14000, startX, color = "#FFD700", kind = "lotus",
}: any) {
  const y = useSharedValue(SH);
  const sway = useSharedValue(0);
  const rot = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(SH, { duration: delay }),
        withTiming(-60, { duration, easing: Easing.linear })
      ),
      -1,
      false
    );
    sway.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(-20, { duration: 2500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    rot.value = withRepeat(withTiming(360, { duration: 10000, easing: Easing.linear }), -1, false);
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { translateX: sway.value }, { rotate: `${rot.value}deg` }],
  }));
  return (
    <Animated.View style={[{ position: "absolute", left: startX, opacity: 0.5 }, style]} pointerEvents="none">
      {kind === "lotus" ? <Lotus /> : kind === "chakra" ? <Chakra /> : (
        <Ionicons name="star" size={20} color={color} />
      )}
    </Animated.View>
  );
}

export function FloatingDecor() {
  return (
    <View style={styles.wrap} pointerEvents="none">
      <Drifter startX={SW * 0.1} delay={0} duration={16000} kind="lotus" />
      <Drifter startX={SW * 0.7} delay={3000} duration={18000} kind="chakra" />
      <Drifter startX={SW * 0.35} delay={6000} duration={14000} kind="star" color="#FFD700" />
      <Drifter startX={SW * 0.85} delay={9000} duration={17000} kind="lotus" />
      <Drifter startX={SW * 0.5} delay={2000} duration={20000} kind="chakra" />
      {/* Sparkles */}
      <Sparkle startX={SW * 0.15} startY={SH * 0.15} delay={500} />
      <Sparkle startX={SW * 0.8} startY={SH * 0.25} delay={1500} color="#FFA0B0" />
      <Sparkle startX={SW * 0.4} startY={SH * 0.55} delay={2500} color="#84D9FF" />
      <Sparkle startX={SW * 0.85} startY={SH * 0.65} delay={1000} color="#FFD700" />
      <Sparkle startX={SW * 0.2} startY={SH * 0.75} delay={2000} color="#A8E063" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { ...StyleSheet.absoluteFillObject },
});
