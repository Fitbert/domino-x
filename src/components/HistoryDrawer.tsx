import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Player } from '../types/domino';
import { colors, spacing, typography } from '../theme/tokens';

export interface HistoryDrawerProps {
  player: Player | null;
  visible: boolean;
  onClose: () => void;
}

/**
 * Expanded per-player score history. Placeholder plain list; Vertical C adds
 * the slide-up drawer motion and per-entry undo-last affordance.
 */
export function HistoryDrawer({ player, visible, onClose }: HistoryDrawerProps) {
  return (
    <Modal visible={visible && !!player} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{player?.name}</Text>
          <FlatList
            data={player?.history ?? []}
            keyExtractor={(entry) => entry.id}
            renderItem={({ item }) => <Text style={styles.entry}>+{item.amount}</Text>}
          />
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.notebookWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    maxHeight: '60%',
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
    color: colors.dominoBlack,
    marginBottom: spacing.sm,
  },
  entry: {
    fontSize: typography.sizes.md,
    color: colors.pencilGray,
    paddingVertical: spacing.xs,
  },
});
