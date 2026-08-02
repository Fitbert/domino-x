import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

import { useSettingsStore } from '../store/settingsStore';

type SoundName = 'graphite-stroke' | 'page-turn' | 'card-tap' | 'success-tone' | 'win-cheer';

/**
 * Resolves the bundled asset for a sound name.
 *
 * IMPORTANT: `require()` calls wrapped in try/catch are treated by Metro as
 * "optional" dependencies -- bundling succeeds even when the target file does
 * not exist on disk (verified against this project's Metro/Expo SDK 57
 * config). That is exactly what we want here: there are no real audio assets
 * in the repo yet, so every one of these currently resolves to `null` and
 * every `play*` function below silently no-ops. The moment a real file lands
 * at `assets/sounds/{name}.mp3`, this same code picks it up and plays it --
 * no further code changes required. See the follow-up note in the PR
 * description for sourcing the actual .mp3 files.
 */
function loadSource(name: SoundName): number | null {
  try {
    switch (name) {
      case 'graphite-stroke':
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require('../../assets/sounds/graphite-stroke.mp3');
      case 'page-turn':
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require('../../assets/sounds/page-turn.mp3');
      case 'card-tap':
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require('../../assets/sounds/card-tap.mp3');
      case 'success-tone':
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require('../../assets/sounds/success-tone.mp3');
      case 'win-cheer':
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require('../../assets/sounds/win-cheer.mp3');
      default:
        return null;
    }
  } catch {
    return null;
  }
}

const players = new Map<SoundName, AudioPlayer | null>();

function getPlayer(name: SoundName): AudioPlayer | null {
  if (players.has(name)) return players.get(name) ?? null;

  const source = loadSource(name);
  if (source === null) {
    players.set(name, null);
    return null;
  }

  try {
    const player = createAudioPlayer(source);
    players.set(name, player);
    return player;
  } catch {
    players.set(name, null);
    return null;
  }
}

function play(name: SoundName): void {
  if (!isAudioEnabled()) return;

  const player = getPlayer(name);
  if (!player) return;

  try {
    // Restart from the top so rapid repeat taps (e.g. quick successive
    // scores) always retrigger the sound rather than doing nothing because
    // playback already reached the end.
    player.seekTo(0).catch(() => {});
    player.play();
  } catch {
    // Audio is a subtle nice-to-have -- never worth crashing the app over.
  }
}

/**
 * Local audio toggle. Delegates to the persisted settings store so there is
 * a single source of truth shared with the Settings screen switch.
 */
export function setAudioEnabled(enabled: boolean): void {
  useSettingsStore.getState().setAudioEnabled(enabled);
}

export function isAudioEnabled(): boolean {
  return useSettingsStore.getState().audioEnabled;
}

/** Pencil-on-paper scratch, for score entry / drawing a stroke. */
export function playGraphiteStroke(): void {
  play('graphite-stroke');
}

/** Notebook page turn, for navigating between screens. */
export function playPageTurn(): void {
  play('page-turn');
}

/** Soft tap, for lightweight taps like selecting a card or button. */
export function playCardTap(): void {
  play('card-tap');
}

/** Gentle chime, for completing a domino block (a full "X"). */
export function playSuccessTone(): void {
  play('success-tone');
}

/** Small celebratory clap/cheer, for the winner modal. */
export function playWinCheer(): void {
  play('win-cheer');
}
