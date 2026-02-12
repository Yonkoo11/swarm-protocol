import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS } from '../design/tokens';
import { HexGrid } from '../components/HexGrid';
import type { HexCell, NectarChannel } from '../components/HexGrid';

// Full colony with diverse states
const COLONY_CELLS: Array<{ col: number; row: number; state: HexCell['state']; fillLevel: number }> = [
  // Active tasks
  { col: 5, row: 8, state: 'active', fillLevel: 0.8 },
  { col: 7, row: 9, state: 'active', fillLevel: 0.6 },
  { col: 9, row: 10, state: 'filling', fillLevel: 0.4 },
  { col: 4, row: 12, state: 'active', fillLevel: 0.9 },
  { col: 8, row: 14, state: 'filling', fillLevel: 0.3 },
  { col: 6, row: 16, state: 'active', fillLevel: 0.7 },
  { col: 10, row: 11, state: 'filling', fillLevel: 0.5 },
  { col: 12, row: 12, state: 'active', fillLevel: 0.4 },
  // Completed
  { col: 6, row: 10, state: 'sage', fillLevel: 1 },
  { col: 3, row: 11, state: 'sage', fillLevel: 1 },
  { col: 8, row: 12, state: 'sage', fillLevel: 1 },
  { col: 5, row: 14, state: 'sage', fillLevel: 1 },
  { col: 7, row: 15, state: 'sage', fillLevel: 1 },
  { col: 9, row: 13, state: 'sage', fillLevel: 1 },
  { col: 4, row: 16, state: 'sage', fillLevel: 1 },
  { col: 10, row: 15, state: 'sage', fillLevel: 1 },
  { col: 3, row: 13, state: 'sage', fillLevel: 1 },
  { col: 5, row: 17, state: 'sage', fillLevel: 1 },
  // Dispute
  { col: 11, row: 13, state: 'dispute', fillLevel: 0.7 },
  // More in-progress
  { col: 7, row: 11, state: 'filling', fillLevel: 0.2 },
  { col: 6, row: 18, state: 'filling', fillLevel: 0.6 },
  { col: 8, row: 17, state: 'active', fillLevel: 0.5 },
];

const CHANNELS = [
  // Task tree (parent -> children)
  { from: { col: 5, row: 8 }, to: { col: 6, row: 10 } },
  { from: { col: 5, row: 8 }, to: { col: 7, row: 9 } },
  { from: { col: 7, row: 9 }, to: { col: 8, row: 12 } },
  // Another cluster
  { from: { col: 4, row: 12 }, to: { col: 3, row: 11 } },
  { from: { col: 4, row: 12 }, to: { col: 5, row: 14 } },
  // Dispute link
  { from: { col: 9, row: 13 }, to: { col: 11, row: 13 } },
  // Worker connections
  { from: { col: 6, row: 16 }, to: { col: 7, row: 15 } },
  { from: { col: 8, row: 14 }, to: { col: 9, row: 13 } },
  { from: { col: 10, row: 11 }, to: { col: 10, row: 15 } },
];

const FEATURES = [
  { label: 'Task Trees', desc: 'Subtask decomposition with cascading payments' },
  { label: 'Quality Bonds', desc: 'Workers stake USDC as delivery guarantee' },
  { label: 'Agent Jury', desc: '3-juror dispute resolution' },
];

export const TheNetwork: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in with zoom-out
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(frame, [0, 40], [1.15, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade out
  const fadeOut = interpolate(frame, [220, 240], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Cells
  const cells: HexCell[] = COLONY_CELLS.map((c) => ({
    col: c.col,
    row: c.row,
    state: c.state,
    fillLevel: c.fillLevel,
  }));

  // Channels
  const channels: NectarChannel[] = CHANNELS.map((ch) => ({
    fromCell: ch.from,
    toCell: ch.to,
    flowProgress: 1,
  }));

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      {/* Colony grid with scale */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <HexGrid
          opacity={0.04}
          revealProgress={1}
          cells={cells}
          channels={channels}
        />
      </div>

      {/* Feature labels - left-aligned, stacked, factual */}
      {FEATURES.map((feat, i) => {
        const delay = 50 + i * 18;
        const featOpacity = interpolate(frame, [delay, delay + 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const featY = interpolate(frame, [delay, delay + 12], [12, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 80,
              top: 1180 + i * 150,
              opacity: featOpacity,
              transform: `translateY(${featY}px)`,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 48,
                fontWeight: 600,
                color: COLORS.textPrimary,
                marginBottom: 6,
              }}
            >
              {feat.label}
            </div>
            <div
              style={{
                fontFamily: FONTS.body,
                fontSize: 36,
                fontWeight: 400,
                color: COLORS.textSecondary,
                maxWidth: 550,
              }}
            >
              {feat.desc}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
