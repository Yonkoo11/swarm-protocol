import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { COLORS } from '../design/tokens';

export const AmberGlow: React.FC<{
  x?: number;
  y?: number;
  size?: number;
  intensity?: number;
}> = ({ x = 50, y = 50, size = 600, intensity = 0.15 }) => {
  const frame = useCurrentFrame();

  // Gentle breathing
  const breathe = 1 + Math.sin(frame * 0.03) * 0.08;
  const drift = Math.sin(frame * 0.01) * 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x + drift}%`,
        top: `${y}%`,
        width: size * breathe,
        height: size * breathe,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.amberGlow} 0%, ${COLORS.amberGlow10} 40%, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
        opacity: intensity,
        pointerEvents: 'none',
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse at center, transparent 40%, rgba(14, 13, 11, 0.6) 100%)',
      pointerEvents: 'none',
    }}
  />
);
