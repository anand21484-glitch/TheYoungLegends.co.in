import React from "react";
import Svg, { Path, G } from "react-native-svg";

interface IndiaMapSvgProps {
  width: number;
  height: number;
  fillColor?: string;
  strokeColor?: string;
}

export const IndiaMapSvg: React.FC<IndiaMapSvgProps> = ({
  width,
  height,
  fillColor = "#F4C430",
  strokeColor = "#1A365D",
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 400 450"
      pointerEvents="none"
    >
      <G>
        {/* Main India outline */}
        <Path
          d="M 195 20 L 210 22 L 225 18 L 240 25 L 255 20 L 270 30 L 280 25 L 290 35 L 285 45 L 295 55 L 300 65 L 310 70 L 320 80 L 325 90 L 315 95 L 320 105 L 330 110 L 335 120 L 330 130 L 340 140 L 345 155 L 340 165 L 350 175 L 355 185 L 350 195 L 345 205 L 340 215 L 330 220 L 320 230 L 315 245 L 305 255 L 295 265 L 285 275 L 275 285 L 265 295 L 255 305 L 245 315 L 235 325 L 225 335 L 220 345 L 215 355 L 210 365 L 205 375 L 200 385 L 195 395 L 190 385 L 185 375 L 180 365 L 175 355 L 170 345 L 165 335 L 155 325 L 145 315 L 135 305 L 125 295 L 115 285 L 105 275 L 95 265 L 85 255 L 75 245 L 70 230 L 60 220 L 55 210 L 50 200 L 55 190 L 60 180 L 65 170 L 60 160 L 65 150 L 70 140 L 75 130 L 70 120 L 75 110 L 80 100 L 90 95 L 85 85 L 90 75 L 100 70 L 110 65 L 115 55 L 110 45 L 120 40 L 130 35 L 140 30 L 150 25 L 160 20 L 170 18 L 180 22 L 195 20 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Kashmir region */}
        <Path
          d="M 195 20 L 200 10 L 210 5 L 220 10 L 230 8 L 240 15 L 245 10 L 255 12 L 260 20 L 255 20 L 240 25 L 225 18 L 210 22 L 195 20 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Northeast India */}
        <Path
          d="M 320 80 L 335 75 L 350 80 L 360 90 L 365 100 L 355 105 L 345 100 L 335 95 L 325 90 L 320 80 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Andaman Islands */}
        <Path
          d="M 330 350 L 333 345 L 336 350 L 333 355 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <Path
          d="M 332 360 L 335 355 L 338 360 L 335 365 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
      </G>
    </Svg>
  );
};
