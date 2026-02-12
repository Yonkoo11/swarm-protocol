import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion';
import { FontLoader } from './design/fonts';
import { COLORS } from './design/tokens';
import { NoiseOverlay } from './components/NoiseOverlay';
import { Vignette } from './components/AmberGlow';
import { Brand } from './scenes/01-Brand';
import { TheMechanic } from './scenes/02-TheMechanic';
import { TheNetwork } from './scenes/03-TheNetwork';
import { Close } from './scenes/04-Close';

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.deepBg }}>
      <FontLoader />

      <Audio src={staticFile('audio/ambient-hive.mp3')} volume={1} />

      {/* Scene 1: Brand (0-5s) */}
      <Sequence from={0} durationInFrames={150}>
        <Brand />
      </Sequence>

      {/* Scene 2: The Mechanic (5-16s) */}
      <Sequence from={150} durationInFrames={330}>
        <TheMechanic />
      </Sequence>

      {/* Scene 3: The Network (16-24s) */}
      <Sequence from={480} durationInFrames={240}>
        <TheNetwork />
      </Sequence>

      {/* Scene 4: Close (24-30s) */}
      <Sequence from={720} durationInFrames={180}>
        <Close />
      </Sequence>

      <Vignette />
      <NoiseOverlay opacity={0.035} />
    </AbsoluteFill>
  );
};
