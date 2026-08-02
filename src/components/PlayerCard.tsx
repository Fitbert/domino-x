import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Player } from '../types/domino';
import { colors, spacing, typography } from '../theme/tokens';
import { DominoScoreStrip } from './DominoScoreStrip';

export interface PlayerCardProps {
  player: Player;
  isWinner?: boolean;
  onScorePress: () => void;
  onHistoryPress: () => void;
}

/**
 * A player's card: name, running score, DominoX strip, history button.
 * Placeholder layout; Vertical B replaces with the paper-card look (rounded
 * corners, paper texture, shadow, press feedback via Reanimated + haptics).
 */
export function PlayerCard({ player, isWinner, onScorePress, onHistoryPress }: PlayerCardProps) {
  return (
    <Pressable style={[styles.card, isWinner && styles.winnerCard]} onPress={onScorePress}>
      <View style={styles.header}>
        <Text style={styles.name}>{player.name}</Text>
        <Text style={styles.score}>{player.score}</Text>
      </View>
      <DominoScoreStrip score={player.score} />
      <Pressable onPress={onHistoryPress} hitSlop={8}>
        <Text style={styles.historyLabel}>History</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.notebookWhite,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: colors.dominoBlack,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  winnerCard: {
    borderWidth: 2,
    borderColor: colors.accentBlue,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
    color: colors.dominoBlack,
  },
  score: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.accentBlue,
  },
  historyLabel: {
    fontSize: typography.sizes.sm,
    color: colors.pencilGray,
  },
});
