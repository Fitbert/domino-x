import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import type { GameConfig } from '../src/types/domino';
import { colors, radii, spacing, typography } from '../src/theme/tokens';
import { useGameStore } from '../src/store/gameStore';
import { PaperBackground } from '../src/components/PaperBackground';
import { NotebookHeader } from '../src/components/NotebookHeader';

interface LeaderboardRow {
  name: string;
  wins: number;
  gamesPlayed: number;
}

interface StreakInfo {
  name: string;
  length: number;
}

function completedAtOf(game: GameConfig): number {
  return game.completedAt ?? game.createdAt;
}

function buildLeaderboard(games: GameConfig[]): LeaderboardRow[] {
  const byName = new Map<string, LeaderboardRow>();
  for (const game of games) {
    for (const player of game.players) {
      const row = byName.get(player.name) ?? { name: player.name, wins: 0, gamesPlayed: 0 };
      row.gamesPlayed += 1;
      if (player.id === game.winnerId) row.wins += 1;
      byName.set(player.name, row);
    }
  }
  return Array.from(byName.values()).sort(
    (a, b) => b.wins - a.wins || b.gamesPlayed - a.gamesPlayed || a.name.localeCompare(b.name)
  );
}

/** Average of the winner's final score at the moment each game was won. */
function averageWinningScore(games: GameConfig[]): number | null {
  if (games.length === 0) return null;
  const scores = games.map((game) => {
    const winner = game.players.find((p) => p.id === game.winnerId);
    return winner ? winner.score : game.winningScore;
  });
  return Math.round(scores.reduce((sum, n) => sum + n, 0) / scores.length);
}

/** Longest run of consecutive wins by the same player, in chronological order. */
function longestWinStreak(games: GameConfig[]): StreakInfo | null {
  if (games.length === 0) return null;
  const chronological = [...games].sort((a, b) => completedAtOf(a) - completedAtOf(b));

  let bestName = '';
  let bestLength = 0;
  let currentName = '';
  let currentLength = 0;

  for (const game of chronological) {
    const winner = game.players.find((p) => p.id === game.winnerId);
    const name = winner?.name ?? null;
    if (name && name === currentName) {
      currentLength += 1;
    } else {
      currentName = name ?? '';
      currentLength = name ? 1 : 0;
    }
    if (currentLength > bestLength) {
      bestLength = currentLength;
      bestName = currentName;
    }
  }

  return bestLength > 0 ? { name: bestName, length: bestLength } : null;
}

/**
 * Aggregate stats built from `completedGames`: per-player win counts and win
 * rate, average winning score, longest win streak, and total games played —
 * a clean notebook-style leaderboard rather than a bare list of winners.
 */
export default function StatisticsScreen() {
  const completedGames = useGameStore((s) => s.completedGames);

  const leaderboard = useMemo(() => buildLeaderboard(completedGames), [completedGames]);
  const avgWinningScore = useMemo(() => averageWinningScore(completedGames), [completedGames]);
  const streak = useMemo(() => longestWinStreak(completedGames), [completedGames]);

  const hasGames = completedGames.length > 0;

  return (
    <PaperBackground>
      <NotebookHeader title="Statistics" />

      {!hasGames ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>No completed games yet.</Text>
          <Text style={styles.emptySubtext}>Finish a game to start building your stats.</Text>
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(row) => row.name}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.summaryRow}>
              <StatCard label="Games Played" value={String(completedGames.length)} />
              <StatCard label="Avg. Winning Score" value={avgWinningScore != null ? String(avgWinningScore) : '—'} />
              <StatCard
                label="Longest Streak"
                value={streak ? String(streak.length) : '—'}
                sublabel={streak ? streak.name : undefined}
              />
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={styles.rank}>{index + 1}</Text>
              <Text style={styles.rowName}>{item.name}</Text>
              <View style={styles.rowStats}>
                <Text style={styles.rowWins}>
                  {item.wins} win{item.wins === 1 ? '' : 's'}
                </Text>
                <Text style={styles.rowGames}>
                  {item.gamesPlayed} played · {Math.round((item.wins / item.gamesPlayed) * 100)}%
                </Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </PaperBackground>
  );
}

function StatCard({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sublabel ? (
        <Text style={styles.statSublabel} numberOfLines={1}>
          {sublabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.notebookWhite,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: 2,
    shadowColor: colors.dominoBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.accentBlue,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fontFamily.semibold,
    color: colors.pencilGray,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  statSublabel: {
    fontSize: typography.sizes.xs,
    color: colors.pencilGray,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  rank: {
    width: 20,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.semibold,
    color: colors.pencilGray,
  },
  rowName: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.semibold,
    color: colors.dominoBlack,
  },
  rowStats: {
    alignItems: 'flex-end',
  },
  rowWins: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.accentBlue,
  },
  rowGames: {
    fontSize: typography.sizes.xs,
    color: colors.pencilGray,
  },
  separator: {
    height: 1,
    backgroundColor: colors.paperShadow,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.xs,
  },
  empty: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.semibold,
    color: colors.pencilGray,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: typography.sizes.sm,
    color: colors.pencilGray,
    textAlign: 'center',
  },
});
