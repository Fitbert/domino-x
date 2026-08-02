import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing } from '../theme/tokens';

export interface FloatingUndoProps {
  visible: boolean;
  onUndo: () => void;
}

/**
 * Always-visible undo affordance. Placeholder plain button; Vertical C wires
 * this to a full reverse animation (score, strip, running total) via the
 * game store and adds enter/exit motion.
 */
export function FloatingUndo({ visible, onUndo }: FloatingUndoProps) {
  if (!visible) return null;
  return (
    <Pressable style={styles.button} onPress={onUndo}>
      <Text style={styles.label}>Undo</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: spacing.lg,
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    backgroundColor: colors.dominoBlack,
  },
  label: {
    color: colors.notebookWhite,
    fontWeight: '600',
  },
});
