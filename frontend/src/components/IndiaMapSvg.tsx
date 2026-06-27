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
    <Svg width={width} height={height} viewBox="0 0 400 450" pointerEvents="none">
      <G>
        {/* Main India outline — equirectangular: x=(lon-68)/29*400, y=(37-lat)/29*450 */}
        <Path
          d="M 83 23 L 110 18 L 128 16 L 160 24
             L 172 78 L 172 124
             L 207 155 L 276 155 L 291 155 L 318 155 L 353 147 L 393 140
             L 372 186 L 358 202 L 345 225 L 338 241
             L 269 241
             L 252 265 L 234 280 L 207 303 L 172 342
             L 158 420 L 131 448
             L 118 436 L 108 403 L 95 374 L 80 334
             L 66 279 L 66 248
             L 58 233 L 36 250 L 20 233
             L 14 217 L 7 206 L 11 198 L 7 192
             L 35 109 L 69 78
             L 83 23 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Andaman Islands */}
        <Path
          d="M 343 372 L 347 366 L 351 372 L 347 378 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <Path
          d="M 341 388 L 345 382 L 349 388 L 345 394 Z"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
      </G>
    </Svg>
  );
};
