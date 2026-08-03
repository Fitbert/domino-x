import { create } from 'zustand';
import type { GameConfig, NewGameOptions, Player, ScoreEntry, ScoreIncrement } from '../types/domino';
import { loadJSON, saveJSON, removeKey, STORAGE_KEYS } from '../storage/mmkv';

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function makePlayers(names: string[], memberNames?: string[][]): Player[] {
  return names.map((name, i) => {
    const members = memberNames?.[i];
    return { id: makeId(), name, score: 0, history: [], ...(members?.length ? { members } : {}) };
  });
}

// Monotonic timestamp source for ScoreEntry.timestamp. Two players can tap
// a score button in the same millisecond (fast taps, or programmatic bulk
// entry), and Date.now() alone can collide in that case. `undoLast()` picks
// "the single most-recent entry across all players" by comparing this
// timestamp, so a collision would make that choice ambiguous/non-deterministic.
// Forcing strictly-increasing values here (without changing the ScoreEntry
// shape, which is owned by src/types/domino.ts) removes the ambiguity for
// every entry created during this process's lifetime. `lastTimestamp` resets
// to 0 on cold start, but Date.now() is always far larger than any
// previously-persisted timestamp, so ordering across a hydrate() boundary is
// still preserved.
let lastTimestamp = 0;
function nextTimestamp(): number {
  const now = Date.now();
  lastTimestamp = now > lastTimestamp ? now : lastTimestamp + 1;
  return lastTimestamp;
}

/** Info about the most recently undone entry, for a brief confirmation UI. */
export interface UndoInfo {
  playerId: string;
  playerName: string;
  amount: number;
  timestamp: number;
}

interface GameStore {
  activeGame: GameConfig | null;
  completedGames: GameConfig[];
  /**
   * Additive: set by `undoLast()` right after it reverses an entry, so
   * FloatingUndo / HistoryDrawer can show a "undid +N for Name" confirmation
   * without duplicating the store's own "most recent entry" logic. Existing
   * consumers that don't know about this field are unaffected.
   */
  lastUndone: UndoInfo | null;

  startGame: (options: NewGameOptions) => void;
  addScore: (playerId: string, amount: ScoreIncrement) => void;
  undoLast: () => void;
  rematch: () => void;
  endActiveGame: () => void;
  hydrate: () => void;
  /** Additive: dismiss the `lastUndone` confirmation once it's been shown. */
  clearLastUndone: () => void;
}

function persistActiveGame(game: GameConfig | null) {
  if (game) saveJSON(STORAGE_KEYS.activeGame, game);
  else removeKey(STORAGE_KEYS.activeGame);
}

function persistCompletedGames(games: GameConfig[]) {
  saveJSON(STORAGE_KEYS.gameHistory, games);
}

export const useGameStore = create<GameStore>((set, get) => ({
  activeGame: null,
  completedGames: [],
  lastUndone: null,

  hydrate: () => {
    const activeGame = loadJSON<GameConfig>(STORAGE_KEYS.activeGame);
    const completedGames = loadJSON<GameConfig[]>(STORAGE_KEYS.gameHistory) ?? [];
    set({ activeGame, completedGames });
  },

  startGame: (options) => {
    const game: GameConfig = {
      id: makeId(),
      mode: options.mode,
      winningScore: options.winningScore,
      players: makePlayers(options.playerNames, options.memberNames),
      createdAt: Date.now(),
      winnerId: null,
      completedAt: null,
    };
    persistActiveGame(game);
    set({ activeGame: game, lastUndone: null });
  },

  addScore: (playerId, amount) => {
    const { activeGame } = get();
    if (!activeGame || activeGame.winnerId) return;

    const players = activeGame.players.map((player) => {
      if (player.id !== playerId) return player;
      const runningTotal = player.score + amount;
      const entry: ScoreEntry = {
        id: makeId(),
        playerId,
        amount,
        runningTotal,
        timestamp: nextTimestamp(),
      };
      return { ...player, score: runningTotal, history: [...player.history, entry] };
    });

    const winner = players.find((p) => p.score >= activeGame.winningScore);
    const updatedGame: GameConfig = {
      ...activeGame,
      players,
      winnerId: winner ? winner.id : null,
      completedAt: winner ? Date.now() : null,
    };

    persistActiveGame(updatedGame);
    set({ activeGame: updatedGame });

    if (winner) {
      const completedGames = [...get().completedGames, updatedGame];
      persistCompletedGames(completedGames);
      set({ completedGames });
    }
  },

  undoLast: () => {
    const { activeGame } = get();
    if (!activeGame) return;

    // Find the single most-recent ScoreEntry across all players. Each
    // player's own history is already in insertion order, so only the last
    // element per player is a candidate; entries are timestamped via
    // nextTimestamp() (see above) which is strictly increasing for the
    // lifetime of this process, so this comparison is deterministic even
    // when two players are scored in the same millisecond. The `>=` (rather
    // than `>`) fallback, combined with stable iteration order, also keeps
    // behavior deterministic for any pre-existing persisted data that predates
    // this guarantee and could in theory still carry equal timestamps.
    let latestEntry: ScoreEntry | null = null;
    for (const player of activeGame.players) {
      const last = player.history[player.history.length - 1];
      if (last && (!latestEntry || last.timestamp >= latestEntry.timestamp)) {
        latestEntry = last;
      }
    }
    if (!latestEntry) return;

    const undonePlayer = activeGame.players.find((p) => p.id === latestEntry!.playerId) ?? null;

    const players = activeGame.players.map((player) => {
      if (player.id !== latestEntry!.playerId) return player;
      const history = player.history.slice(0, -1);
      return { ...player, score: player.score - latestEntry!.amount, history };
    });

    const updatedGame: GameConfig = { ...activeGame, players, winnerId: null, completedAt: null };
    persistActiveGame(updatedGame);
    set({
      activeGame: updatedGame,
      lastUndone: {
        playerId: latestEntry.playerId,
        playerName: undonePlayer?.name ?? '',
        amount: latestEntry.amount,
        timestamp: latestEntry.timestamp,
      },
    });
  },

  rematch: () => {
    const { activeGame } = get();
    if (!activeGame) return;
    get().startGame({
      mode: activeGame.mode,
      playerNames: activeGame.players.map((p) => p.name),
      memberNames: activeGame.players.map((p) => p.members ?? []),
      winningScore: activeGame.winningScore,
    });
  },

  endActiveGame: () => {
    persistActiveGame(null);
    set({ activeGame: null, lastUndone: null });
  },

  clearLastUndone: () => set({ lastUndone: null }),
}));
