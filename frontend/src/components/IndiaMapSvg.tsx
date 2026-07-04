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
    // NW Kashmir
    "M 83 26 L 100 18 L 124 17 L 145 20 L 159 26",
    // North: Himachal → Uttarakhand → Nepal border
    "L 165 55 L 172 86 L 172 138",
    // Nepal → NE bump: Sikkim → Bhutan → Arunachal
    "L 190 148 L 207 155 L 240 158 L 276 160 L 310 158 L 340 152 L 365 148 L 393 155",
    // NE south: Nagaland → Manipur → Mizoram
    "L 385 175 L 372 207 L 359 224 L 348 245 L 338 259",
    // West Bengal coast → Odisha
    "L 310 255 L 285 255 L 269 259",
    // East coast: AP → Tamil Nadu → Kanyakumari tip
    "L 258 280 L 245 300 L 234 318 L 218 345 L 200 372",
    "L 180 410 L 162 450 L 148 475 L 131 498",
    // West coast: Kerala → Karnataka → Goa → Maharashtra
    "L 120 488 L 108 455 L 96 420 L 82 378",
    "L 68 318 L 62 285 L 62 268",
    // Saurashtra peninsula
    "L 48 262 L 33 278 L 18 272 L 14 258",
    // Kutch → Pakistan border → NW up to Kashmir
    "L 7 240 L 7 214 L 20 180 L 35 121 L 55 86 L 69 60 L 83 26 Z",
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
