import { create } from 'zustand';
import type { GameConfig, NewGameOptions, Player, ScoreEntry, ScoreIncrement } from '../types/domino';
import { loadJSON, saveJSON, removeKey, STORAGE_KEYS } from '../storage/mmkv';

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function makePlayers(names: string[]): Player[] {
  return names.map((name) => ({ id: makeId(), name, score: 0, history: [] }));
}

interface GameStore {
  activeGame: GameConfig | null;
  completedGames: GameConfig[];

  startGame: (options: NewGameOptions) => void;
  addScore: (playerId: string, amount: ScoreIncrement) => void;
  undoLast: () => void;
  rematch: () => void;
  endActiveGame: () => void;
  hydrate: () => void;
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
      players: makePlayers(options.playerNames),
      createdAt: Date.now(),
      winnerId: null,
      completedAt: null,
    };
    persistActiveGame(game);
    set({ activeGame: game });
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
        timestamp: Date.now(),
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

    let latestEntry: ScoreEntry | null = null;
    for (const player of activeGame.players) {
      const last = player.history[player.history.length - 1];
      if (last && (!latestEntry || last.timestamp > latestEntry.timestamp)) {
        latestEntry = last;
      }
    }
    if (!latestEntry) return;

    const players = activeGame.players.map((player) => {
      if (player.id !== latestEntry!.playerId) return player;
      const history = player.history.slice(0, -1);
      return { ...player, score: player.score - latestEntry!.amount, history };
    });

    const updatedGame: GameConfig = { ...activeGame, players, winnerId: null, completedAt: null };
    persistActiveGame(updatedGame);
    set({ activeGame: updatedGame });
  },

  rematch: () => {
    const { activeGame } = get();
    if (!activeGame) return;
    get().startGame({
      mode: activeGame.mode,
      playerNames: activeGame.players.map((p) => p.name),
      winningScore: activeGame.winningScore,
    });
  },

  endActiveGame: () => {
    persistActiveGame(null);
    set({ activeGame: null });
  },
}));
