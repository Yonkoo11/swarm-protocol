import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS } from '../design/tokens';
import { HexGrid } from '../components/HexGrid';
import type { HexCell } from '../components/HexGrid';

// Living colony in background, slowly dimming
const BG_CELLS: HexCell[] = [
  { col: 4, row: 8, state: 'active', fillLevel: 0.5 },
  { col: 6, row: 9, state: 'sage', fillLevel: 1 },
  { col: 8, row: 10, state: 'filling', fillLevel: 0.3 },
  { col: 5, row: 11, state: 'active', fillLevel: 0.7 },
  { col: 7, row: 12, state: 'sage', fillLevel: 1 },
  { col: 9, row: 11, state: 'filling', fillLevel: 0.4 },
  { col: 3, row: 13, state: 'sage', fillLevel: 1 },
  { col: 6, row: 14, state: 'active', fillLevel: 0.6 },
  { col: 10, row: 13, state: 'filling', fillLevel: 0.5 },
  { col: 5, row: 15, state: 'sage', fillLevel: 1 },
  { col: 8, row: 16, state: 'active', fillLevel: 0.4 },
  { col: 7, row: 17, state: 'sage', fillLevel: 1 },
];

export const Close: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade to black
  const fadeOut = interpolate(frame, [130, 180], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Colony slowly dims
  const colonyOpacity = interpolate(frame, [0, 150], [0.04, 0.015], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // HIVEMIND - appears confidently
  const titleOpacity = interpolate(frame, [15, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleScale = interpolate(frame, [15, 28], [0.97, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "on Base" - subtle, delayed
  const baseOpacity = interpolate(frame, [45, 58], [0, 0.6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      {/* Living colony background */}
      <HexGrid
        opacity={colonyOpacity}
        revealProgress={1}
        cells={BG_CELLS}
        pulseCenter={{ x: 540, y: 960 }}
      />

      {/* Subtle warm glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '42%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.amberGlow05} 0%, transparent 65%)`,
          transform: 'translate(-50%, -50%)',
          opacity: titleOpacity * 0.6,
        }}
      />

      {/* HIVEMIND */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
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

      {/* on Base */}
      <div
        style={{
          position: 'absolute',
          top: '49%',
          width: '100%',
          textAlign: 'center',
          opacity: baseOpacity,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 40,
            fontWeight: 400,
            color: COLORS.textTertiary,
          }}
        >
          on Base
        </div>
      </div>
    </AbsoluteFill>
  );
};
