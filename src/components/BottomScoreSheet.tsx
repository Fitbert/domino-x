import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { SCORE_INCREMENTS } from '../domino/constants';
import type { ScoreIncrement } from '../types/domino';
import { colors, spacing } from '../theme/tokens';
import { ScoreButton } from './ScoreButton';

export interface BottomScoreSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (amount: ScoreIncrement) => void;
}

/**
 * Bottom sheet with the +5..+50 score grid. Placeholder uses a plain RN
 * Modal; Vertical B replaces with a gesture-driven Reanimated bottom sheet
 * (drag to dismiss, spring open/close).
 */
export function BottomScoreSheet({ visible, onClose, onSelect }: BottomScoreSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.grid}>
            {SCORE_INCREMENTS.map((amount) => (
              <ScoreButton
                key={amount}
                amount={amount}
                onPress={(a) => {
                  onSelect(a);
                  onClose();
                }}
              />
            ))}
          </View>
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
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
