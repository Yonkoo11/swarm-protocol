import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { COLORS, FONTS } from '../design/tokens';
import { HexGrid, cellToPixel } from '../components/HexGrid';
import type { HexCell, NectarChannel } from '../components/HexGrid';

const TASK_CELL = { col: 7, row: 13 };
const WORKER_CELL = { col: 9, row: 14 };

const CONTEXT_CELLS = [
  { col: 5, row: 11, state: 'sage' as const },
  { col: 6, row: 12, state: 'active' as const },
  { col: 8, row: 12, state: 'filling' as const },
  { col: 10, row: 13, state: 'empty' as const },
  { col: 5, row: 14, state: 'sage' as const },
  { col: 7, row: 15, state: 'empty' as const },
  { col: 6, row: 14, state: 'empty' as const },
];

const NECTAR_SOURCES = [
  { col: 3, row: 11 },
  { col: 4, row: 15 },
  { col: 11, row: 12 },
];

export const TheMechanic: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Fade out
  const fadeOut = interpolate(frame, [315, 330], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === PHASE 1: POST (0-80) ===
  const taskActivation = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fillLevel = interpolate(frame, [10, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const taskTitleOpacity = interpolate(frame, [12, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const usdcOpacity = interpolate(frame, [35, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const nectarFlow = interpolate(frame, [15, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === PHASE 2: CLAIM (80-160) ===
  const agentActivation = interpolate(frame, [85, 105], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const connectionProgress = interpolate(frame, [90, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bondOpacity = interpolate(frame, [110, 122], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === PHASE 3: DELIVER (160-240) ===
  const sageTransition = interpolate(frame, [170, 200], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const paymentFlow = interpolate(frame, [195, 240], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const workerGlow = interpolate(frame, [225, 250], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === PHASE 4: HOLD (240-330) ===
  // Just hold the completed state, let it breathe

  // State label progression
  const states = [
    { label: 'posted', start: 8 },
    { label: 'funded', start: 55 },
    { label: 'claimed', start: 95 },
    { label: 'submitted', start: 170 },
    { label: 'approved', start: 200 },
    { label: 'paid', start: 240 },
  ];
  let currentState = '';
  for (const s of states) {
    if (frame >= s.start) currentState = s.label;
  }
  const stateOpacity = interpolate(frame, [8, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Build cells
  const cells: HexCell[] = [];

  // Context
  for (const c of CONTEXT_CELLS) {
    cells.push({
      col: c.col,
      row: c.row,
      state: c.state,
      fillLevel: c.state === 'filling' ? 0.3 : 1,
    });
  }

  // Task cell
  if (taskActivation > 0) {
    const state = sageTransition > 0.7
      ? 'sage' as const
      : fillLevel > 0.8
        ? 'active' as const
        : 'filling' as const;
    cells.push({
      col: TASK_CELL.col,
      row: TASK_CELL.row,
      state,
      fillLevel,
    });
  }

  // Worker cell
  if (agentActivation > 0) {
    cells.push({
      col: WORKER_CELL.col,
      row: WORKER_CELL.row,
      state: workerGlow > 0.3 ? 'active' : 'filling',
      fillLevel: agentActivation * 0.5 + workerGlow * 0.5,
    });
  }

  // Channels
  const channels: NectarChannel[] = [];

  // Nectar flowing in (funding)
  for (let i = 0; i < NECTAR_SOURCES.length; i++) {
    const stagger = i * 0.15;
    const flowProg = interpolate(nectarFlow, [stagger, stagger + 0.6], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    channels.push({
      fromCell: NECTAR_SOURCES[i],
      toCell: TASK_CELL,
      flowProgress: flowProg,
    });
  }

  // Task-worker connection
  if (connectionProgress > 0) {
    channels.push({
      fromCell: TASK_CELL,
      toCell: WORKER_CELL,
      flowProgress: connectionProgress,
    });
  }

  // Payment flow
  if (paymentFlow > 0) {
    channels.push({
      fromCell: TASK_CELL,
      toCell: WORKER_CELL,
      flowProgress: paymentFlow,
      color: COLORS.amberBright,
    });
  }

  const taskPos = cellToPixel(TASK_CELL.col, TASK_CELL.row);
  const workerPos = cellToPixel(WORKER_CELL.col, WORKER_CELL.row);

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <HexGrid
        opacity={0.035}
        revealProgress={1}
        cells={cells}
        channels={channels}
        pulseCenter={{ x: taskPos.x, y: taskPos.y }}
      />

      {/* Worker glow on payment */}
      {workerGlow > 0 && (
        <div
          style={{
            position: 'absolute',
            left: workerPos.x,
            top: workerPos.y,
            width: 80 + workerGlow * 60,
            height: 80 + workerGlow * 60,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.amberGlowStrong} 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            opacity: workerGlow * 0.3,
          }}
        />
      )}

      {/* Task label - positioned near the cell, not centered */}
      {taskTitleOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(taskPos.x + 55, 520),
            top: taskPos.y - 30,
            opacity: taskTitleOpacity,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 48,
              fontWeight: 600,
              color: COLORS.textPrimary,
              whiteSpace: 'nowrap',
            }}
          >
            Build Token Dashboard
          </div>
        </div>
      )}

      {/* USDC amount */}
      {usdcOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: taskPos.x - 55,
            top: taskPos.y + 48,
            width: 110,
            textAlign: 'center',
            opacity: usdcOpacity,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: 46,
              fontWeight: 600,
              color: COLORS.amberBright,
            }}
          >
            50 USDC
          </div>
        </div>
      )}

      {/* Bond indicator near worker */}
      {bondOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: workerPos.x + 45,
            top: workerPos.y - 12,
            opacity: bondOpacity,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: 38,
              fontWeight: 400,
              color: COLORS.textSecondary,
              whiteSpace: 'nowrap',
            }}
          >
            5 USDC bond
          </div>
        </div>
      )}

      {/* State indicator - bottom, understated */}
      {currentState && (
        <div
          style={{
            position: 'absolute',
            bottom: 340,
            width: '100%',
            textAlign: 'center',
            opacity: stateOpacity,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: 44,
              fontWeight: 500,
              color: COLORS.textTertiary,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            {currentState}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
