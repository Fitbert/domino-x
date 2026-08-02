import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { colors, spacing, typography } from '../../src/theme/tokens';
import { DEFAULT_WINNING_SCORE } from '../../src/domino/constants';
import { useGameStore } from '../../src/store/gameStore';

/** Step 3: winning score + start. Placeholder for Vertical B. */
export default function WinningScoreStep() {
  const startGame = useGameStore((s) => s.startGame);

  const handleStart = () => {
    startGame({
      mode: 'individual',
      playerNames: ['Player 1', 'Player 2'],
      winningScore: DEFAULT_WINNING_SCORE,
    });
    router.replace('/game');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Race to {DEFAULT_WINNING_SCORE}</Text>
      <Pressable style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonLabel}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.notebookWhite,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.dominoBlack,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    backgroundColor: colors.accentBlue,
  },
  buttonLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.notebookWhite,
  },
});
