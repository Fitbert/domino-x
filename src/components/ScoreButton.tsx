import { Pressable, StyleSheet, Text } from 'react-native';

import type { ScoreIncrement } from '../types/domino';
import { colors, spacing, typography } from '../theme/tokens';

export interface ScoreButtonProps {
  amount: ScoreIncrement;
  onPress: (amount: ScoreIncrement) => void;
}

/**
 * Single +N score button used in BottomScoreSheet's grid.
 * Placeholder press styling; Vertical B adds the lift/shadow/press/release
 * animation and haptic tap.
 */
export function ScoreButton({ amount, onPress }: ScoreButtonProps) {
  return (
    <Pressable style={styles.button} onPress={() => onPress(amount)}>
      <Text style={styles.label}>+{amount}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexBasis: '18%',
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.paperShadow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.dominoBlack,
  },
});
