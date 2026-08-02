# Domino X

A premium digital domino scorepad — a tabletop companion, not a calculator.
Built with Expo Router, TypeScript, React Native Reanimated/Skia, Zustand, and MMKV.

## Getting started

```bash
npm install
npm run start   # or: npm run ios / npm run android
```

## Architecture

- `app/` — Expo Router screens (file-based routing)
- `src/components/` — UI components (PlayerCard, DominoX, DominoScoreStrip, ...)
- `src/store/` — Zustand game state (`useGameStore`)
- `src/storage/` — MMKV persistence wrapper
- `src/theme/` — design tokens (colors, typography, spacing)
- `src/domino/` — domino scoring rules/constants
- `src/types/` — shared TypeScript contracts
