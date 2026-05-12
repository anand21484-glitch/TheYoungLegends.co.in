/**
 * Floating Indian-monument silhouettes drifting gently in the background of
 * the story screen. Mixes multiple monuments so every story feels like a tour
 * of India — Red Fort, India Gate, Gateway of India, Charminar, Ashoka pillar,
 * Sabarmati Ashram, etc.
 *
 * Each monument is rendered tiny + semi-transparent and uses Reanimated to
 * drift horizontally, bob vertically, and rotate subtly. Heroically slow so
 * nothing distracts from the story text.
 */
import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing,
} from "react-native-reanimated";
import Svg, {
  Rect, Ellipse, Path, Polygon, Circle, G,
} from "react-native-svg";

const { width: SW, height: SH } = Dimensions.get("window");

// ---------- Tiny monument shapes (kept simple for background use) ----------

function MiniRedFort({ size = 70, color = "#7C2C12" }: any) {
  return (
    <Svg width={size} height={size * 0.6} viewBox="0 0 120 70">
      <Rect x="10" y="30" width="100" height="40" fill={color} />
      <Rect x="20" y="20" width="80" height="14" fill={color} />
      <Ellipse cx="60" cy="20" rx="14" ry="10" fill={color} />
      <Path d="M60 4 L63 14 L57 14 Z" fill={color} />
      <Ellipse cx="32" cy="28" rx="6" ry="5" fill={color} />
      <Ellipse cx="88" cy="28" rx="6" ry="5" fill={color} />
    </Svg>
  );
}

function MiniIndiaGate({ size = 60, color = "#C9A37C" }: any) {
  return (
    <Svg width={size * 0.7} height={size} viewBox="0 0 50 70">
      <Rect x="8" y="14" width="34" height="56" fill={color} />
      <Path d="M17 70 L17 38 Q25 24 33 38 L33 70 Z" fill="#5C4632" opacity={0.6} />
      <Rect x="6" y="10" width="38" height="6" fill={color} />
      <Rect x="11" y="4" width="28" height="6" fill={color} />
    </Svg>
  );
}

function MiniGatewayIndia({ size = 70, color = "#D2B48C" }: any) {
  return (
    <Svg width={size} height={size * 0.7} viewBox="0 0 90 60">
      <Rect x="12" y="20" width="66" height="40" fill={color} />
      <Path d="M30 60 L30 40 Q45 26 60 40 L60 60 Z" fill="#7A5C3F" opacity={0.55} />
      <Ellipse cx="45" cy="18" rx="14" ry="10" fill={color} />
      <Path d="M45 4 L48 14 L42 14 Z" fill={color} />
      <Rect x="4" y="26" width="8" height="34" fill="#C9A574" />
      <Rect x="78" y="26" width="8" height="34" fill="#C9A574" />
    </Svg>
  );
}

function MiniCharminar({ size = 65, color = "#C49B5C" }: any) {
  return (
    <Svg width={size} height={size * 0.85} viewBox="0 0 90 75">
      <Rect x="20" y="30" width="50" height="42" fill={color} />
      {[15, 75].map((x) => (
        <G key={x}>
          <Rect x={x - 3} y={14} width="6" height={58} fill="#B0824A" />
          <Ellipse cx={x} cy={10} rx="6" ry="5" fill="#B0824A" />
          <Path d={`M ${x} 0 L ${x + 2} 10 L ${x - 2} 10 Z`} fill="#B0824A" />
        </G>
      ))}
      <Path d="M30 72 L30 50 Q45 40 60 50 L60 72 Z" fill="#7A5230" opacity={0.55} />
    </Svg>
  );
}

function MiniAshokaPillar({ size = 70, color = "#D4A95F" }: any) {
  return (
    <Svg width={size * 0.4} height={size} viewBox="0 0 30 70">
      <Rect x="11" y="20" width="8" height="46" fill={color} />
      <Rect x="6" y="14" width="18" height="8" fill="#C49B5C" />
      <Circle cx="10" cy="9" r="4" fill={color} />
      <Circle cx="15" cy="9" r="4" fill={color} />
      <Circle cx="20" cy="9" r="4" fill={color} />
      <Rect x="8" y="66" width="14" height="4" fill="#C49B5C" />
    </Svg>
  );
}

function MiniSabarmati({ size = 60, color = "#D9C39A" }: any) {
  return (
    <Svg width={size} height={size * 0.7} viewBox="0 0 70 50">
      <Rect x="15" y="22" width="40" height="22" fill={color} />
      <Polygon points="10,22 35,4 60,22" fill="#B07A3A" />
      <Rect x="32" y="30" width="6" height="14" fill="#5A3B1E" />
      <Circle cx="62" cy="40" r="4" fill="none" stroke="#5A3B1E" strokeWidth="0.8" />
    </Svg>
  );
}

function MiniJhansiFort({ size = 70, color = "#8B5A2B" }: any) {
  return (
    <Svg width={size} height={size * 0.65} viewBox="0 0 100 65">
      <Path d="M10 65 L24 30 L76 30 L90 65 Z" fill="#6B4423" />
      <Rect x="24" y="22" width="52" height="32" fill={color} />
      <Rect x="46" y="6" width="14" height="16" fill="#A0673B" />
      <Polygon points="44,6 53,0 62,6" fill="#A0673B" />
    </Svg>
  );
}

// Lotus flower for variety
function MiniLotus({ size = 36 }: any) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      {[0, 60, 120, 180, 240, 300].map((d) => (
        <Path
          key={d}
          d="M18 18 Q15 4 18 0 Q21 4 18 18 Z"
          fill="#FFB7C5"
          stroke="#D63384"
          strokeWidth={0.5}
          transform={`rotate(${d} 18 18)`}
          opacity={0.85}
        />
      ))}
      <Circle cx="18" cy="18" r="3" fill="#FFD700" />
    </Svg>
  );
}

const SHAPES = [
  MiniRedFort,
  MiniIndiaGate,
  MiniGatewayIndia,
  MiniCharminar,
  MiniAshokaPillar,
  MiniSabarmati,
  MiniJhansiFort,
  MiniLotus,
];

type Item = {
  Shape: any;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
  opacity: number;
  scale: number;
  rotateRange: number;
};

// Pre-compute a deterministic-ish set of floaters per render
function buildItems(): Item[] {
  const items: Item[] = [];
  const used = new Set<number>();
  const total = 7;
  for (let i = 0; i < total; i++) {
    // pick a shape not yet used (or wrap)
    let idx = (i * 3 + 1) % SHAPES.length;
    while (used.has(idx) && used.size < SHAPES.length) {
      idx = (idx + 1) % SHAPES.length;
    }
    used.add(idx);
    const Shape = SHAPES[idx];
    // Distribute roughly in 7 vertical bands
    const yBand = (SH / total) * i + 40;
    const fromLeft = i % 2 === 0;
    items.push({
      Shape,
      startX: fromLeft ? -100 : SW + 80,
      endX: fromLeft ? SW + 80 : -120,
      startY: yBand,
      endY: yBand + (i % 2 === 0 ? -40 : 40),
      duration: 22000 + (i % 4) * 6000,
      delay: i * 1800,
      opacity: 0.1 + (i % 3) * 0.04, // 0.10 – 0.18
      scale: 0.7 + (i % 3) * 0.15,
      rotateRange: i % 2 === 0 ? 12 : -10,
    });
  }
  return items;
}

function Floater({ item }: { item: Item }) {
  const x = useSharedValue(item.startX);
  const y = useSharedValue(item.startY);
  const rot = useSharedValue(0);
  const bob = useSharedValue(0);

  useEffect(() => {
    x.value = withRepeat(
      withSequence(
        withTiming(item.startX, { duration: item.delay }),
        withTiming(item.endX, { duration: item.duration, easing: Easing.linear }),
        withTiming(item.startX, { duration: 0 })
      ),
      -1,
      false
    );
    y.value = withRepeat(
      withSequence(
        withTiming(item.startY, { duration: item.delay }),
        withTiming(item.endY, { duration: item.duration / 2, easing: Easing.inOut(Easing.sin) }),
        withTiming(item.startY, { duration: item.duration / 2, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    rot.value = withRepeat(
      withSequence(
        withTiming(item.rotateRange, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-item.rotateRange, { duration: 4000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    bob.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(-6, { duration: 2200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value + bob.value },
      { rotate: `${rot.value}deg` },
      { scale: item.scale },
    ],
    opacity: item.opacity,
  }));

  const ShapeC = item.Shape;
  return (
    <Animated.View style={[styles.floater, style]} pointerEvents="none">
      <ShapeC />
    </Animated.View>
  );
}

export function FloatingMonuments() {
  // Build items once on mount
  const itemsRef = React.useRef<Item[] | null>(null);
  if (!itemsRef.current) itemsRef.current = buildItems();
  return (
    <View style={styles.wrap} pointerEvents="none">
      {itemsRef.current.map((it, i) => (
        <Floater key={i} item={it} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { ...StyleSheet.absoluteFillObject },
  floater: { position: "absolute", left: 0, top: 0 },
});
