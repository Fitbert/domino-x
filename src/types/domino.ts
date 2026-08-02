import type { SCORE_INCREMENTS } from '../domino/constants';

export type ScoreIncrement = (typeof SCORE_INCREMENTS)[number];

export type GameMode = 'individual' | 'teams';

export interface ScoreEntry {
  id: string;
  playerId: string;
  amount: ScoreIncrement;
  runningTotal: number;
  timestamp: number;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  history: ScoreEntry[];
}

export interface GameConfig {
  id: string;
  mode: GameMode;
  winningScore: number;
  players: Player[];
  createdAt: number;
  winnerId: string | null;
  completedAt: number | null;
}

export interface NewGameOptions {
  mode: GameMode;
  playerNames: string[];
  winningScore: number;
}
