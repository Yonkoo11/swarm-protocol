import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const NoiseOverlay: React.FC<{ opacity?: number }> = ({
  opacity = 0.035,
}) => {
  const frame = useCurrentFrame();
  // Animate seed every 2 frames for film-grain effect
  const seed = Math.floor(frame / 2);

  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
      <svg width="100%" height="100%">
        <filter id={`noise-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves={4}
            seed={seed}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#noise-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
