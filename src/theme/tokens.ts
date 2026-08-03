export const colors = {
  notebookWhite: '#FAF8F3',
  pencilGray: '#2B2B2B',
  dominoBlack: '#111111',
  paperShadow: '#DDD8CF',
  accentBlue: '#3478F6',
} as const;

/**
 * One accent per player/team, assigned by seat order (index into
 * `activeGame.players`) so each score card, DominoX glow, and winner state
 * reads as unmistakably "theirs" at a glance. First entry intentionally
 * matches `colors.accentBlue` so a 2-player individual game — the most
 * common case — looks unchanged for player 1.
 */
export const playerAccents = [
  '#3478F6', // blue
  '#E2643C', // coral
  '#2E9E77', // teal
  '#8B5CF6', // violet
  '#C99A2E', // amber
  '#C2478B', // berry
] as const;

export function accentForIndex(index: number): string {
  return playerAccents[index % playerAccents.length];
}

export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 40,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: colors.dominoBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
} as const;

export const theme = { colors, typography, spacing, radii, shadows } as const;
export type Theme = typeof theme;
