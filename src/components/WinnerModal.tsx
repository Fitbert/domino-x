import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Player } from '../types/domino';
import { colors, spacing, typography } from '../theme/tokens';

export interface WinnerModalProps {
  visible: boolean;
  winner: Player | null;
  onRematch: () => void;
  onNewGame: () => void;
  onStatistics: () => void;
}

/**
 * Winner celebration screen. Placeholder plain modal; Vertical D adds
 * background darken, card elevation, tasteful domino-pip confetti, and
 * haptics.winHeavy().
 */
export function WinnerModal({ visible, winner, onRematch, onNewGame, onStatistics }: WinnerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{winner?.name} wins!</Text>
          <Pressable style={styles.button} onPress={onRematch}>
            <Text style={styles.buttonLabel}>Rematch</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onNewGame}>
            <Text style={styles.buttonLabel}>New Game</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onStatistics}>
            <Text style={styles.buttonLabel}>Statistics</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.notebookWhite,
    borderRadius: 24,
    padding: spacing.xl,
    width: '100%',
    gap: spacing.sm,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.dominoBlack,
    marginBottom: spacing.md,
  },
  button: {
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.paperShadow,
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.dominoBlack,
  },
});
