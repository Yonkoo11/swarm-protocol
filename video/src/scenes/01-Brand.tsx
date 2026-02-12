import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS } from '../design/tokens';
import { HexGrid } from '../components/HexGrid';
import type { HexCell } from '../components/HexGrid';

// Cells that emerge organically from center
const EMERGENCE_CELLS: Array<{ col: number; row: number; delay: number }> = [
  // Center cluster (appears first)
  { col: 7, row: 13, delay: 0 },
  { col: 6, row: 13, delay: 3 },
  { col: 8, row: 13, delay: 5 },
  { col: 7, row: 12, delay: 7 },
  { col: 7, row: 14, delay: 9 },
  // Second ring
  { col: 6, row: 12, delay: 14 },
  { col: 8, row: 12, delay: 16 },
  { col: 5, row: 13, delay: 18 },
  { col: 9, row: 13, delay: 20 },
  { col: 6, row: 14, delay: 22 },
  { col: 8, row: 14, delay: 24 },
  // Outer
  { col: 5, row: 11, delay: 30 },
  { col: 9, row: 11, delay: 33 },
  { col: 4, row: 14, delay: 36 },
  { col: 10, row: 14, delay: 38 },
  { col: 7, row: 15, delay: 40 },
  { col: 6, row: 16, delay: 44 },
  { col: 8, row: 16, delay: 46 },
];

export const Brand: React.FC = () => {
  const frame = useCurrentFrame();

  // Build cells based on emergence timing
  const cells: HexCell[] = EMERGENCE_CELLS
    .filter((c) => frame >= c.delay)
    .map((c) => {
      const age = frame - c.delay;
      const fillUp = Math.min(1, age / 20);
      return {
        col: c.col,
        row: c.row,
        state: fillUp > 0.7 ? 'active' as const : 'filling' as const,
        fillLevel: fillUp,
      };
    });

  // Grid reveal expands from center
  const gridReveal = interpolate(frame, [0, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Title: appears sharply, no letter-by-letter gimmick
  const titleOpacity = interpolate(frame, [30, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleScale = interpolate(frame, [30, 40], [0.97, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtitle: functional descriptor
  const subOpacity = interpolate(frame, [50, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scene exit
  const fadeOut = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Hex grid emerging from center */}
      <HexGrid
        opacity={0.03}
        revealProgress={gridReveal}
        cells={cells}
        pulseCenter={{ x: 540, y: 880 }}
      />

      {/* Subtle amber glow behind title area */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '36%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.amberGlow05} 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          opacity: titleOpacity * 0.8,
        }}
      />

      {/* HIVEMIND */}
      <div
        style={{
          position: 'absolute',
          top: '33%',
          width: '100%',
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 128,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: 6,
          }}
        >
          HIVEMIND
        </div>
      </div>

      {/* Functional descriptor */}
      <div
        style={{
          position: 'absolute',
          top: '44%',
          width: '100%',
          textAlign: 'center',
          opacity: subOpacity,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 44,
            fontWeight: 400,
            color: COLORS.textSecondary,
            letterSpacing: 1.5,
          }}
        >
          agent task protocol on Base
        </div>
      </div>
    </AbsoluteFill>
  );
};
