# HiveMind Demo Video - Progress

## Status: DONE - Rendered with Living Hive design + audio + readable fonts

## Output
- **Final**: `out/HiveMindDemo-final.mp4` (QuickTime-compat audio)
- **Raw**: `out/HiveMindDemo.mp4` (Remotion output)
- **Duration**: 35s @ 30fps (1050 frames), 1080x1920, H.264
- **Audio**: "Vastness" from Mixkit, stereo 48kHz 256kbps, fades baked in

## Render Command
```bash
cd ~/Projects/swarm-protocol/video
npx remotion render src/index.ts HiveMindDemo out/HiveMindDemo.mp4 --codec h264 --browser-executable ~/Projects/truthbounty-video/node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell
# Then re-mux for QuickTime:
ffmpeg -y -i out/HiveMindDemo.mp4 -c:v copy -c:a aac -b:a 256k -ar 44100 -ac 2 out/HiveMindDemo-final.mp4
```

## Design Rework (v2)
Completely rewrote all 5 scenes following Living Hive metaphor:
- Hex cells ARE the UI - tasks live IN cells, not on cards
- Amber = nectar = value/USDC flowing through channels
- Sage = completed, warm-red = dispute
- Organic emergence animations (opacity + subtle scale), no spring bounce
- No glassmorphism, no emoji icons, no APPROVED stamps, no padlocks

### Deleted (AI slop)
GlassCard, TaskCard, EscrowLock, UsdcCoin, StatusBadge, PillBadge, FeatureCallout

### Reworked
- HexGrid: now supports cell states (empty/filling/active/sage/dispute), fill levels, nectar channels
- All 5 scenes: hex-cell-centric, organic, minimal text

## Font Size Fixes (v3)
Bumped all secondary/tertiary text for mobile readability:
- Subtitles: 28→36px
- State labels: 20→28px
- USDC labels: 18→26px
- "on Base": 20→26px
- Feature callout titles: 28→34px
- Feature descriptions: 18→24px
- CTA URL: 34→40px
- CTA subtitle: 24→30px
- "Built on Base": 18→24px

## Audio Fix (v3)
- Source: Mixkit "Vastness" (royalty-free ambient track)
- Re-encoded: stereo, 48kHz, 256kbps mp3 (was mono 44100Hz)
- Volume: 1.0 in Remotion (was 0.85)
- Fades baked into mp3: 1.5s in, 2s out
- Rendered output: -10.3 dB mean, 0 dB peak

## Remotion Studio Warning
- The triangle/2 warnings in studio toolbar are bundler warnings (font import related)
- They do NOT affect the render output
- Safe to ignore

## TODO (if needed)
- [ ] Better audio track (Suno-generated warm synth pad)
- [ ] Fine-tune cell positions for each scene
- [ ] Add more cells to colony scene for density
