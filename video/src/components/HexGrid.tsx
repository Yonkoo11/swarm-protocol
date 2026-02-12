import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../design/tokens';

const HEX_SIZE = 40;
const HEX_GAP = 4;

// Pointy-top hex path
const hexPath = (cx: number, cy: number, size: number): string => {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    points.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
  }
  return `M${points.join('L')}Z`;
};

export type CellState = 'empty' | 'filling' | 'active' | 'sage' | 'dispute';

export interface HexCell {
  col: number;
  row: number;
  state: CellState;
  fillLevel?: number; // 0-1, how full the cell is with amber
  label?: string;
  id?: string;
}

export interface NectarChannel {
  fromCell: { col: number; row: number };
  toCell: { col: number; row: number };
  flowProgress: number; // 0-1
  color?: string;
}

// Convert grid coords to pixel coords
export const cellToPixel = (
  col: number,
  row: number,
  offsetX = 0,
  offsetY = 0
): { x: number; y: number } => {
  const hexW = (HEX_SIZE + HEX_GAP) * Math.sqrt(3);
  const hexH = (HEX_SIZE + HEX_GAP) * 1.5;
  const x = col * hexW + (row % 2 === 1 ? hexW / 2 : 0) + offsetX;
  const y = row * hexH + offsetY;
  return { x, y };
};

// Fill color for cell states
const getCellFill = (
  state: CellState,
  fillLevel: number,
  frame: number,
  cellIndex: number
): { fill: string; fillOpacity: number; stroke: string; strokeOpacity: number } => {
  const pulse = Math.sin(frame * 0.04 + cellIndex * 0.7) * 0.1;

  switch (state) {
    case 'empty':
      return {
        fill: 'none',
        fillOpacity: 0,
        stroke: COLORS.amberCore,
        strokeOpacity: 0.06 + pulse * 0.02,
      };
    case 'filling':
      return {
        fill: COLORS.amberDeep,
        fillOpacity: fillLevel * 0.6 + pulse * 0.05,
        stroke: COLORS.amberCore,
        strokeOpacity: 0.2 + fillLevel * 0.3,
      };
    case 'active':
      return {
        fill: COLORS.amberCore,
        fillOpacity: 0.25 + pulse * 0.08,
        stroke: COLORS.amberBright,
        strokeOpacity: 0.6 + pulse * 0.1,
      };
    case 'sage':
      return {
        fill: COLORS.sage,
        fillOpacity: 0.2 + pulse * 0.04,
        stroke: COLORS.sage,
        strokeOpacity: 0.5,
      };
    case 'dispute':
      return {
        fill: COLORS.warmRed,
        fillOpacity: 0.2 + Math.abs(pulse) * 0.1,
        stroke: COLORS.warmRed,
        strokeOpacity: 0.6 + Math.abs(pulse) * 0.15,
      };
  }
};

export const HexGrid: React.FC<{
  opacity?: number;
  revealProgress?: number;
  pulseCenter?: { x: number; y: number };
  cells?: HexCell[];
  channels?: NectarChannel[];
  gridOffset?: { x: number; y: number };
  cols?: number;
  rows?: number;
}> = ({
  opacity = 0.03,
  revealProgress = 1,
  pulseCenter,
  cells = [],
  channels = [],
  gridOffset = { x: 0, y: 0 },
  cols = 20,
  rows = 35,
}) => {
  const frame = useCurrentFrame();

  const width = 1080;
  const height = 1920;
  const hexW = (HEX_SIZE + HEX_GAP) * Math.sqrt(3);
  const hexH = (HEX_SIZE + HEX_GAP) * 1.5;

  // Build lookup for special cells
  const cellMap = new Map<string, HexCell>();
  for (const cell of cells) {
    cellMap.set(`${cell.row}-${cell.col}`, cell);
  }

  const hexElements: React.ReactElement[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * hexW + (row % 2 === 1 ? hexW / 2 : 0) + gridOffset.x;
      const cy = row * hexH + gridOffset.y;

      if (cx > width + HEX_SIZE || cy > height + HEX_SIZE) continue;
      if (cx < -HEX_SIZE || cy < -HEX_SIZE) continue;

      // Distance from center for reveal
      const dx = cx - width / 2;
      const dy = cy - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
      const normalizedDist = dist / maxDist;

      if (revealProgress < normalizedDist) continue;

      // Check if this is a special cell
      const key = `${row}-${col}`;
      const cellData = cellMap.get(key);
      const cellIndex = row * cols + col;

      if (cellData && cellData.state !== 'empty') {
        const { fill, fillOpacity, stroke, strokeOpacity } = getCellFill(
          cellData.state,
          cellData.fillLevel ?? 1,
          frame,
          cellIndex
        );

        // Filled cell
        hexElements.push(
          <path
            key={key}
            d={hexPath(cx, cy, HEX_SIZE * 0.9)}
            fill={fill}
            fillOpacity={fillOpacity}
            stroke={stroke}
            strokeWidth={1.2}
            strokeOpacity={strokeOpacity}
          />
        );

        // Amber fill level visualization (honey filling from bottom)
        if (cellData.state === 'filling' && (cellData.fillLevel ?? 0) > 0) {
          const level = cellData.fillLevel ?? 0;
          const fillHeight = HEX_SIZE * 0.9 * 2 * level;
          const clipY = cy + HEX_SIZE * 0.9 - fillHeight;
          const clipId = `fill-clip-${key}`;

          hexElements.push(
            <React.Fragment key={`${key}-fill`}>
              <defs>
                <clipPath id={clipId}>
                  <rect
                    x={cx - HEX_SIZE}
                    y={clipY}
                    width={HEX_SIZE * 2}
                    height={fillHeight}
                  />
                </clipPath>
              </defs>
              <path
                d={hexPath(cx, cy, HEX_SIZE * 0.85)}
                fill={COLORS.amberCore}
                fillOpacity={0.3 + level * 0.2}
                clipPath={`url(#${clipId})`}
              />
            </React.Fragment>
          );
        }
      } else {
        // Default empty cell with pulse
        let pulseOpacity = 0;
        if (pulseCenter) {
          const pdx = cx - pulseCenter.x;
          const pdy = cy - pulseCenter.y;
          const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
          const wave = Math.sin(frame * 0.05 - pDist * 0.008);
          pulseOpacity = Math.max(0, wave) * 0.04;
        }

        const shimmer = Math.sin(frame * 0.02 + col * 0.5 + row * 0.3) * 0.01;

        hexElements.push(
          <path
            key={key}
            d={hexPath(cx, cy, HEX_SIZE * 0.9)}
            fill="none"
            stroke={COLORS.amberCore}
            strokeWidth={0.5}
            opacity={opacity + shimmer + pulseOpacity}
          />
        );
      }
    }
  }

  // Render nectar channels between cells
  const channelElements: React.ReactElement[] = [];
  for (let i = 0; i < channels.length; i++) {
    const ch = channels[i];
    const from = cellToPixel(ch.fromCell.col, ch.fromCell.row, gridOffset.x, gridOffset.y);
    const to = cellToPixel(ch.toCell.col, ch.toCell.row, gridOffset.x, gridOffset.y);

    if (ch.flowProgress <= 0) continue;

    const color = ch.color ?? COLORS.amberCore;

    // Static connection line
    channelElements.push(
      <line
        key={`ch-line-${i}`}
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.2}
      />
    );

    // Flowing nectar blob along the line
    if (ch.flowProgress > 0 && ch.flowProgress < 1) {
      const t = ch.flowProgress;
      // Ease: smooth cubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const blobX = from.x + (to.x - from.x) * eased;
      const blobY = from.y + (to.y - from.y) * eased;
      const blobSize = 6 + Math.sin(t * Math.PI) * 4;

      channelElements.push(
        <circle
          key={`ch-blob-${i}`}
          cx={blobX}
          cy={blobY}
          r={blobSize}
          fill={COLORS.amberBright}
          fillOpacity={0.7}
        />
      );

      // Glow around blob
      channelElements.push(
        <circle
          key={`ch-glow-${i}`}
          cx={blobX}
          cy={blobY}
          r={blobSize * 2.5}
          fill={COLORS.amberGlow}
          fillOpacity={0.15}
        />
      );
    }

    // Completed channel: solid amber line
    if (ch.flowProgress >= 1) {
      channelElements.push(
        <line
          key={`ch-done-${i}`}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={color}
          strokeWidth={2}
          strokeOpacity={0.4}
        />
      );
    }
  }

  return (
    <AbsoluteFill>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {hexElements}
        {channelElements}
      </svg>
    </AbsoluteFill>
  );
};
