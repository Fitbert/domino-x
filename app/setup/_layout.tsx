import { createContext, useContext, useMemo, useState } from 'react';
import { Stack } from 'expo-router';

import type { GameMode } from '../../src/types/domino';
import { DEFAULT_WINNING_SCORE } from '../../src/domino/constants';

export interface SetupWizardState {
  mode: GameMode;
  /** Total number of players (not teams — always the flat player count). */
  playerCount: number;
  /** Only meaningful when mode === 'teams'. */
  teamCount: number;
  /** Individual mode: each player's name. Teams mode: each team's name. */
  playerNames: string[];
  /** Teams mode only: each team's member names, aligned by index with playerNames. */
  teamMembers: string[][];
  winningScore: number;
}

interface SetupWizardContextValue {
  setup: SetupWizardState;
  setMode: (mode: GameMode) => void;
  setPlayerCount: (count: number) => void;
  setTeamCount: (count: number) => void;
  setPlayerNames: (names: string[]) => void;
  setTeamMembers: (members: string[][]) => void;
  setWinningScore: (score: number) => void;
}

const DEFAULT_STATE: SetupWizardState = {
  mode: 'individual',
  playerCount: 2,
  teamCount: 2,
  playerNames: [],
  teamMembers: [],
  winningScore: DEFAULT_WINNING_SCORE,
};

const SetupWizardContext = createContext<SetupWizardContextValue | null>(null);

/**
 * Carries the in-progress New Game decisions (mode, player count, names,
 * winning score) across the setup screens without touching the real game
 * store — nothing is persisted until winning-score.tsx calls startGame().
 */
export function useSetupWizard(): SetupWizardContextValue {
  const ctx = useContext(SetupWizardContext);
  if (!ctx) {
    throw new Error('useSetupWizard must be used within the /setup stack');
  }
  return ctx;
}

/**
 * One-decision-per-screen setup flow: game mode -> players -> names (individual)
 * or teams+rosters (teams) -> winning score -> start. Both paths are 4 steps.
 * Each transition slides in from the right; NotebookHeader's step prop renders
 * the progress dots.
 */
export default function SetupLayout() {
  const [setup, setSetup] = useState<SetupWizardState>(DEFAULT_STATE);

  const value = useMemo<SetupWizardContextValue>(
    () => ({
      setup,
      setMode: (mode) => setSetup((s) => ({ ...s, mode })),
      setPlayerCount: (playerCount) => setSetup((s) => ({ ...s, playerCount })),
      setTeamCount: (teamCount) => setSetup((s) => ({ ...s, teamCount })),
      setPlayerNames: (playerNames) => setSetup((s) => ({ ...s, playerNames })),
      setTeamMembers: (teamMembers) => setSetup((s) => ({ ...s, teamMembers })),
      setWinningScore: (winningScore) => setSetup((s) => ({ ...s, winningScore })),
    }),
    [setup],
  );

  return (
    <SetupWizardContext.Provider value={value}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </SetupWizardContext.Provider>
  );
}
