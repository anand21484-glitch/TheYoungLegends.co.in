import React from "react";
import Svg, { Path, G } from "react-native-svg";

interface IndiaMapSvgProps {
  width: number;
  height: number;
  fillColor?: string;
  strokeColor?: string;
}

// Coordinate formula (matches map.tsx projection):
//   x = (lon - 68) / 29 * 400
//   y = (37 - lat) / 29 * 500
export const IndiaMapSvg: React.FC<IndiaMapSvgProps> = ({
  width,
  height,
  fillColor = "#F4C430",
  strokeColor = "#1A365D",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 400 500" pointerEvents="none">
      <G>
        {/* Main India outline */}
        <Path
          d={[
            // NW Kashmir → N ridge → China border
            "M 83 26 L 110 20 L 124 17 L 159 26",
            // Down to Nepal
            "L 172 86 L 172 138",
            // Nepal → NE states bump (Bhutan, Assam, Arunachal)
            "L 207 172 L 276 172 L 290 172 L 317 172 L 352 164 L 393 155",
            // Back south through NE: Nagaland → Manipur → Mizoram → Myanmar border
            "L 372 207 L 359 224 L 345 250 L 338 259",
            // Across Bangladesh (simplified) to WB coast
            "L 269 259",
            // East coast: Odisha → AP → Tamil Nadu → Kanyakumari
            "L 252 293 L 234 310 L 207 336 L 172 379",
            "L 159 465 L 131 498",
            // West coast: Kerala → Karnataka → Goa → Mumbai
            "L 123 491 L 108 448 L 95 415 L 80 370",
            "L 66 310 L 66 276",
            // Saurashtra peninsula (westward bulge)
            "L 62 268 L 33 278 L 21 268",
            // Gulf of Kutch → Kutch → Pakistan border
            "L 16 248 L 7 233 L 11 224 L 7 214",
            // NW border up to Kashmir
            "L 35 121 L 69 86 L 83 26 Z",
          ].join(" ")}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Andaman Islands — 13°N/93°E and 11.5°N/92.7°E */}
        <Path
          d="M 343 410 L 347 404 L 351 410 L 347 416 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <Path
          d="M 341 427 L 345 421 L 349 427 L 345 433 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
      </G>
    </Svg>
  );
};
