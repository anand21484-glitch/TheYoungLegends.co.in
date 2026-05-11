/**
 * Animated SVG monument silhouettes for the Story Reader background.
 * Each archetype is a flat silhouette + small animated overlays
 * (sun/clouds/flag-waving) using react-native-reanimated.
 */
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Rect, Polygon, Ellipse, G, Line } from "react-native-svg";
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing,
} from "react-native-reanimated";

type MonumentKey =
  | "red_fort"
  | "india_gate"
  | "jhansi_fort"
  | "sabarmati"
  | "jallianwala"
  | "charminar"
  | "kashmiri_gate"
  | "gateway_india"
  | "ashoka_pillar";

const W = 360;
const H = 140;

// --- Sub-shapes returning <Svg> children only ---

function RedFort() {
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Ground */}
      <Rect x="0" y={H - 22} width={W} height="22" fill="#5A1E0A" opacity={0.6} />
      {/* Main wall */}
      <Rect x="40" y="58" width="280" height={H - 80} fill="#7C2C12" />
      {/* Battlements */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Rect key={i} x={40 + i * 23} y="50" width="14" height="10" fill="#7C2C12" />
      ))}
      {/* Central dome */}
      <Ellipse cx={W / 2} cy="50" rx="30" ry="22" fill="#7C2C12" />
      <Rect x={W / 2 - 30} y="50" width="60" height="18" fill="#7C2C12" />
      <Path d={`M ${W / 2} 16 L ${W / 2 + 4} 32 L ${W / 2 - 4} 32 Z`} fill="#7C2C12" />
      {/* Side mini domes */}
      <Ellipse cx={W / 2 - 70} cy="56" rx="14" ry="10" fill="#7C2C12" />
      <Ellipse cx={W / 2 + 70} cy="56" rx="14" ry="10" fill="#7C2C12" />
      {/* Arches */}
      {[0, 1, 2].map((i) => (
        <Path
          key={i}
          d={`M ${100 + i * 60} ${H - 22} L ${100 + i * 60} 100 Q ${120 + i * 60} 78 ${140 + i * 60} 100 L ${140 + i * 60} ${H - 22} Z`}
          fill="#3D0F00"
          opacity={0.7}
        />
      ))}
    </Svg>
  );
}

function IndiaGate() {
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Rect x="0" y={H - 18} width={W} height="18" fill="#8B7355" opacity={0.6} />
      {/* Single archway */}
      <Rect x={W / 2 - 70} y="30" width="140" height={H - 48} fill="#C9A37C" />
      {/* Inner arch cutout */}
      <Path
        d={`M ${W / 2 - 35} ${H - 18} L ${W / 2 - 35} 80 Q ${W / 2} 50 ${W / 2 + 35} 80 L ${W / 2 + 35} ${H - 18} Z`}
        fill="#5C4632"
      />
      {/* Top crown */}
      <Rect x={W / 2 - 80} y="22" width="160" height="12" fill="#C9A37C" />
      <Rect x={W / 2 - 60} y="10" width="120" height="14" fill="#C9A37C" />
    </Svg>
  );
}

function JhansiFort() {
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Rect x="0" y={H - 18} width={W} height="18" fill="#4A3520" opacity={0.7} />
      {/* Hill */}
      <Path d={`M 20 ${H - 18} L 80 60 L 280 60 L 340 ${H - 18} Z`} fill="#6B4423" />
      {/* Walls */}
      <Rect x="80" y="50" width="200" height="60" fill="#8B5A2B" />
      {/* Battlements */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Rect key={i} x={80 + i * 17} y="42" width="10" height="10" fill="#8B5A2B" />
      ))}
      {/* Tower */}
      <Rect x={W / 2 - 20} y="22" width="40" height="40" fill="#A0673B" />
      <Polygon points={`${W / 2 - 22},22 ${W / 2},6 ${W / 2 + 22},22`} fill="#A0673B" />
      {/* Door */}
      <Path d={`M ${W / 2 - 12} 110 L ${W / 2 - 12} 88 Q ${W / 2} 76 ${W / 2 + 12} 88 L ${W / 2 + 12} 110 Z`} fill="#3D2914" />
    </Svg>
  );
}

function Sabarmati() {
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Rect x="0" y={H - 18} width={W} height="18" fill="#7A8A56" opacity={0.6} />
      {/* Small hut */}
      <Rect x={W / 2 - 50} y="70" width="100" height="50" fill="#D9C39A" />
      <Polygon points={`${W / 2 - 60},70 ${W / 2},32 ${W / 2 + 60},70`} fill="#B07A3A" />
      <Rect x={W / 2 - 8} y="90" width="16" height="30" fill="#5A3B1E" />
      {/* Side trees */}
      <Circle cx="50" cy="90" r="22" fill="#3A6B2A" />
      <Rect x="46" y="100" width="8" height="22" fill="#5A3B1E" />
      <Circle cx={W - 50} cy="90" r="22" fill="#3A6B2A" />
      <Rect x={W - 54} y="100" width="8" height="22" fill="#5A3B1E" />
      {/* Charkha wheel */}
      <Circle cx={W / 2 + 80} cy="108" r="10" fill="none" stroke="#5A3B1E" strokeWidth="2" />
      <Line x1={W / 2 + 70} y1="108" x2={W / 2 + 90} y2="108" stroke="#5A3B1E" strokeWidth="1.5" />
      <Line x1={W / 2 + 80} y1="98" x2={W / 2 + 80} y2="118" stroke="#5A3B1E" strokeWidth="1.5" />
    </Svg>
  );
}

function Jallianwala() {
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Rect x="0" y={H - 18} width={W} height="18" fill="#7C2C12" opacity={0.6} />
      {/* Eternal flame pillar */}
      <Rect x={W / 2 - 18} y="40" width="36" height={H - 58} fill="#A8362E" />
      <Rect x={W / 2 - 26} y={H - 18} width="52" height="4" fill="#5A1E0A" />
      {/* Flame */}
      <Path d={`M ${W / 2} 20 Q ${W / 2 - 12} 36 ${W / 2 - 8} 44 Q ${W / 2} 38 ${W / 2 + 8} 44 Q ${W / 2 + 12} 36 ${W / 2} 20 Z`} fill="#FFB300" />
      <Path d={`M ${W / 2} 26 Q ${W / 2 - 6} 38 ${W / 2 - 4} 42 Q ${W / 2} 38 ${W / 2 + 4} 42 Q ${W / 2 + 6} 38 ${W / 2} 26 Z`} fill="#FF6F00" />
      {/* Side walls */}
      <Rect x="30" y={H - 50} width="60" height="32" fill="#A8362E" opacity={0.7} />
      <Rect x={W - 90} y={H - 50} width="60" height="32" fill="#A8362E" opacity={0.7} />
    </Svg>
  );
}

function Charminar() {
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Rect x="0" y={H - 18} width={W} height="18" fill="#7A6052" opacity={0.6} />
      {/* Main square base */}
      <Rect x={W / 2 - 70} y="60" width="140" height={H - 78} fill="#C49B5C" />
      {/* 4 minarets */}
      {[-1, 1].map((side) => [-1, 1].map((dx) => (
        <G key={`${side}-${dx}`}>
          <Rect x={W / 2 + side * 70 - 7 + dx * 0} y={28} width="14" height={H - 46} fill="#B0824A" />
          <Ellipse cx={W / 2 + side * 70} cy="22" rx="10" ry="8" fill="#B0824A" />
          <Path d={`M ${W / 2 + side * 70} 8 L ${W / 2 + side * 70 + 3} 20 L ${W / 2 + side * 70 - 3} 20 Z`} fill="#B0824A" />
        </G>
      )))}
      {/* Central arch */}
      <Path d={`M ${W / 2 - 28} ${H - 18} L ${W / 2 - 28} 90 Q ${W / 2} 70 ${W / 2 + 28} 90 L ${W / 2 + 28} ${H - 18} Z`} fill="#7A5230" />
    </Svg>
  );
}

function KashmiriGate() {
  // Punjab gurudwara-like dome
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Rect x="0" y={H - 18} width={W} height="18" fill="#9B8E4F" opacity={0.6} />
      <Rect x={W / 2 - 90} y="55" width="180" height={H - 73} fill="#E8E2C8" />
      <Ellipse cx={W / 2} cy="50" rx="50" ry="36" fill="#E8E2C8" />
      <Path d={`M ${W / 2} 4 L ${W / 2 + 5} 16 L ${W / 2 - 5} 16 Z`} fill="#D4AF37" />
      <Circle cx={W / 2} cy="22" r="5" fill="#D4AF37" />
      {/* Mini side domes */}
      <Ellipse cx={W / 2 - 70} cy="60" rx="18" ry="14" fill="#E8E2C8" />
      <Ellipse cx={W / 2 + 70} cy="60" rx="18" ry="14" fill="#E8E2C8" />
      {/* Arches */}
      {[0, 1, 2].map((i) => (
        <Path
          key={i}
          d={`M ${110 + i * 50} ${H - 18} L ${110 + i * 50} 90 Q ${130 + i * 50} 72 ${150 + i * 50} 90 L ${150 + i * 50} ${H - 18} Z`}
          fill="#B5A878"
          opacity={0.8}
        />
      ))}
    </Svg>
  );
}

function GatewayIndia() {
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Rect x="0" y={H - 18} width={W} height="18" fill="#6F8A92" opacity={0.6} />
      <Rect x={W / 2 - 80} y="30" width="160" height={H - 48} fill="#D2B48C" />
      {/* Central arch */}
      <Path
        d={`M ${W / 2 - 36} ${H - 18} L ${W / 2 - 36} 70 Q ${W / 2} 38 ${W / 2 + 36} 70 L ${W / 2 + 36} ${H - 18} Z`}
        fill="#7A5C3F"
      />
      {/* Top dome */}
      <Ellipse cx={W / 2} cy="28" rx="24" ry="18" fill="#D2B48C" />
      <Path d={`M ${W / 2} 6 L ${W / 2 + 4} 18 L ${W / 2 - 4} 18 Z`} fill="#D2B48C" />
      {/* Side mini turrets */}
      <Rect x={W / 2 - 90} y="36" width="14" height={H - 54} fill="#C9A574" />
      <Rect x={W / 2 + 76} y="36" width="14" height={H - 54} fill="#C9A574" />
    </Svg>
  );
}

function AshokaPillar() {
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Rect x="0" y={H - 18} width={W} height="18" fill="#6E6259" opacity={0.6} />
      {/* Pillar */}
      <Rect x={W / 2 - 12} y="34" width="24" height={H - 52} fill="#D4A95F" />
      <Rect x={W / 2 - 20} y={H - 26} width="40" height="10" fill="#C49B5C" />
      {/* Capital with 4 lions (stylized triangles) */}
      <Rect x={W / 2 - 30} y="22" width="60" height="14" fill="#C49B5C" />
      <Circle cx={W / 2 - 18} cy="16" r="8" fill="#D4A95F" />
      <Circle cx={W / 2} cy="16" r="8" fill="#D4A95F" />
      <Circle cx={W / 2 + 18} cy="16" r="8" fill="#D4A95F" />
      {/* Chakra disc base */}
      <Circle cx={W / 2} cy="6" r="5" fill="none" stroke="#0A2E5C" strokeWidth="1.5" />
      {/* Side trees */}
      <Circle cx="60" cy="100" r="20" fill="#3A6B2A" />
      <Rect x="56" y="108" width="8" height="18" fill="#5A3B1E" />
      <Circle cx={W - 60} cy="100" r="20" fill="#3A6B2A" />
      <Rect x={W - 64} y="108" width="8" height="18" fill="#5A3B1E" />
    </Svg>
  );
}

const SHAPES: Record<MonumentKey, () => React.JSX.Element> = {
  red_fort: RedFort,
  india_gate: IndiaGate,
  jhansi_fort: JhansiFort,
  sabarmati: Sabarmati,
  jallianwala: Jallianwala,
  charminar: Charminar,
  kashmiri_gate: KashmiriGate,
  gateway_india: GatewayIndia,
  ashoka_pillar: AshokaPillar,
};

export function Monument({ monumentKey }: { monumentKey: string }) {
  const Shape = SHAPES[(monumentKey as MonumentKey)] || RedFort;

  // Animated sun rising slowly
  const sun = useSharedValue(0);
  useEffect(() => {
    sun.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const cloud1 = useSharedValue(-60);
  const cloud2 = useSharedValue(W);
  useEffect(() => {
    cloud1.value = withRepeat(
      withTiming(W + 60, { duration: 18000, easing: Easing.linear }),
      -1,
      false
    );
    cloud2.value = withRepeat(
      withTiming(-80, { duration: 24000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const flag = useSharedValue(0);
  useEffect(() => {
    flag.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, []);

  const sunStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: 8 - sun.value * 14 }],
    opacity: 0.7 + sun.value * 0.3,
  }));
  const c1Style = useAnimatedStyle(() => ({ transform: [{ translateX: cloud1.value }] }));
  const c2Style = useAnimatedStyle(() => ({ transform: [{ translateX: cloud2.value }] }));
  const flagStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: 1 - flag.value * 0.2 }, { rotate: `${flag.value * 4 - 2}deg` }],
  }));

  return (
    <View style={styles.wrap} pointerEvents="none">
      {/* Sky-effects overlay using small SVG layers */}
      <Animated.View style={[styles.layer, sunStyle]}>
        <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
          <Circle cx="50" cy="22" r="14" fill="#FFC95C" opacity={0.55} />
          <Circle cx="50" cy="22" r="22" fill="#FFC95C" opacity={0.18} />
        </Svg>
      </Animated.View>
      <Animated.View style={[styles.layer, c1Style]}>
        <Svg width={W * 2} height={H} viewBox={`0 0 ${W * 2} ${H}`}>
          <Ellipse cx={W * 0.2} cy={26} rx="24" ry="10" fill="#FFFFFF" opacity={0.5} />
          <Ellipse cx={W * 0.2 + 18} cy={28} rx="16" ry="8" fill="#FFFFFF" opacity={0.45} />
        </Svg>
      </Animated.View>
      <Animated.View style={[styles.layer, c2Style]}>
        <Svg width={W * 2} height={H} viewBox={`0 0 ${W * 2} ${H}`}>
          <Ellipse cx={W * 1.4} cy={14} rx="20" ry="7" fill="#FFFFFF" opacity={0.4} />
          <Ellipse cx={W * 1.4 + 18} cy={16} rx="14" ry="6" fill="#FFFFFF" opacity={0.35} />
        </Svg>
      </Animated.View>

      {/* Monument */}
      <View style={styles.layer}>
        <Shape />
      </View>

      {/* Tiny waving Indian flag in top-right */}
      <Animated.View style={[styles.flagWrap, flagStyle]}>
        <View style={styles.flagPole} />
        <View style={styles.flag}>
          <View style={[styles.flagBand, { backgroundColor: "#FF9933" }]} />
          <View style={[styles.flagBand, { backgroundColor: "#FFFFFF" }]} />
          <View style={[styles.flagBand, { backgroundColor: "#138808" }]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", height: H, position: "relative" },
  layer: { position: "absolute", left: 0, right: 0, top: 0 },
  flagWrap: {
    position: "absolute", right: 14, top: 8,
    width: 28, height: 50, alignItems: "flex-start",
  },
  flagPole: { position: "absolute", left: 0, top: 0, width: 2, height: 50, backgroundColor: "#3A3A3A" },
  flag: {
    position: "absolute", left: 3, top: 4, width: 22, height: 14,
    borderRadius: 2, overflow: "hidden",
    borderWidth: 0.5, borderColor: "#3A3A3A",
  },
  flagBand: { flex: 1 },
});
