import { useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import type { Player, ScoreEntry } from '../types/domino';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { useGameStore } from '../store/gameStore';
import { tapLight } from '../utils/haptics';

export interface HistoryDrawerProps {
  player: Player | null;
  visible: boolean;
  onClose: () => void;
}

/**
 * Expanded per-player score history, newest first, plus an "Undo last score"
 * affordance that calls the shared store's `undoLast()` (the same action
 * FloatingUndo uses — undo is always "the most recent entry across the whole
 * game", not scoped to whichever player's drawer happens to be open).
 *
 * TODO(per-entry edit): each row renders from one `ScoreEntry` via
 * `HistoryRow`, keyed by `entry.id`. A future tap-to-edit/tap-to-delete
 * affordance for an individual entry can hang directly off that row without
 * restructuring this list — deliberately not building that now since it's
 * out of scope, but keeping the row a discrete, entry-keyed component so it
 * doesn't require a rewrite later.
 */
export function HistoryDrawer({ player, visible, onClose }: HistoryDrawerProps) {
  const activeGame = useGameStore((s) => s.activeGame);
  const undoLast = useGameStore((s) => s.undoLast);
  const lastUndone = useGameStore((s) => s.lastUndone);

  const hasAnyHistory = !!activeGame?.players.some((p) => p.history.length > 0);
  const canUndo = hasAnyHistory && !activeGame?.winnerId;

  const newestFirst = useMemo(() => {
    if (!player) return [];
    return [...player.history].reverse();
  }, [player]);

  const handleUndo = () => {
    if (!canUndo) return;
    tapLight();
    undoLast();
  };

  return (
    <Modal visible={visible && !!player} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Swallow taps on the sheet itself so they don't bubble to the backdrop's onClose. */}
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={styles.name}>{player?.name}</Text>
            <Text style={styles.score}>{player?.score}</Text>
          </View>

          <Text style={styles.sectionLabel}>History</Text>

          {newestFirst.length === 0 ? (
            <Text style={styles.empty}>No scores yet.</Text>
          ) : (
            <ScrollView style={styles.list} contentContainerStyle={styles.chipRow}>
              {newestFirst.map((entry) => (
                <HistoryRow key={entry.id} entry={entry} />
              ))}
            </ScrollView>
          )}

          {lastUndone && (
            <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)} style={styles.toast}>
              <Text style={styles.toastText} numberOfLines={1}>
                Undid +{lastUndone.amount} for {lastUndone.playerName}
              </Text>
            </Animated.View>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Undo last score"
            style={({ pressed }) => [
              styles.undoButton,
              !canUndo && styles.undoButtonDisabled,
              pressed && canUndo && styles.undoButtonPressed,
            ]}
            onPress={handleUndo}
            disabled={!canUndo}
            hitSlop={8}
          >
            <Text style={[styles.undoLabel, !canUndo && styles.undoLabelDisabled]}>Undo last score</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function HistoryRow({ entry }: { entry: ScoreEntry }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>+{entry.amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,17,17,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.notebookWhite,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    maxHeight: '70%',
    gap: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.paperShadow,
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  name: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.dominoBlack,
  },
  score: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.accentBlue,
  },
  sectionLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fontFamily.semibold,
    color: colors.pencilGray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    flexGrow: 0,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.paperShadow,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.semibold,
    color: colors.pencilGray,
  },
  empty: {
    fontSize: typography.sizes.sm,
    color: colors.pencilGray,
    paddingVertical: spacing.md,
  },
  toast: {
    alignSelf: 'center',
    backgroundColor: colors.dominoBlack,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
  },
  toastText: {
    color: colors.notebookWhite,
    fontSize: typography.sizes.xs,
    fontFamily: typography.fontFamily.medium,
  },
  undoButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.dominoBlack,
    alignItems: 'center',
  },
  undoButtonPressed: {
    opacity: 0.85,
  },
  undoButtonDisabled: {
    backgroundColor: colors.paperShadow,
  },
  undoLabel: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.semibold,
    color: colors.notebookWhite,
  },
  undoLabelDisabled: {
    color: colors.pencilGray,
  },
});
