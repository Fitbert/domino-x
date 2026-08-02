export const colors = {
  notebookWhite: '#FAF8F3',
  pencilGray: '#2B2B2B',
  dominoBlack: '#111111',
  paperShadow: '#DDD8CF',
  accentBlue: '#3478F6',
} as const;

export const typography = {
  fontFamily: 'Inter',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 40,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
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
