import { FlatList, StyleSheet, Text } from 'react-native';

import { colors, spacing, typography } from '../src/theme/tokens';
import { useGameStore } from '../src/store/gameStore';
import { PaperBackground } from '../src/components/PaperBackground';
import { NotebookHeader } from '../src/components/NotebookHeader';

/**
 * Completed-games history. Placeholder flat list of past winners;
 * Vertical C builds real aggregate stats (win counts, avg score, streaks).
 */
export default function StatisticsScreen() {
  const completedGames = useGameStore((s) => s.completedGames);

  return (
    <PaperBackground>
      <NotebookHeader title="Statistics" />
      <FlatList
        data={completedGames}
        keyExtractor={(g) => g.id}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
        renderItem={({ item }) => {
          const winner = item.players.find((p) => p.id === item.winnerId);
          return <Text style={styles.row}>{winner ? `${winner.name} won` : 'No winner'}</Text>;
        }}
        ListEmptyComponent={<Text style={styles.empty}>No completed games yet.</Text>}
      />
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  row: {
    fontSize: typography.sizes.md,
    color: colors.pencilGray,
  },
  empty: {
    fontSize: typography.sizes.md,
    color: colors.pencilGray,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
