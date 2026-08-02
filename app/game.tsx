import { FlatList, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';

import { colors, spacing, typography } from '../src/theme/tokens';
import { useGameStore } from '../src/store/gameStore';

/**
 * Main game screen placeholder: renders PlayerCards from the store.
 * Vertical B (PlayerCard/BottomScoreSheet) and Vertical A (DominoX/strip)
 * replace the row below with the real card + score components.
 * Vertical C wires FloatingUndo/GameProgress, Vertical D wires WinnerModal.
 */
export default function GameScreen() {
  const activeGame = useGameStore((s) => s.activeGame);

  useEffect(() => {
    if (!activeGame) router.replace('/');
  }, [activeGame]);

  if (!activeGame) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={activeGame.players}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ gap: spacing.md, padding: spacing.md }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.notebookWhite,
  },
  card: {
    backgroundColor: colors.notebookWhite,
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: colors.dominoBlack,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  name: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
    color: colors.dominoBlack,
  },
  score: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold as any,
    color: colors.accentBlue,
  },
});
