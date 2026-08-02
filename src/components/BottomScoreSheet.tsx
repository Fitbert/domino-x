import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { SCORE_INCREMENTS } from '../domino/constants';
import type { ScoreIncrement } from '../types/domino';
import { colors, radii, spacing } from '../theme/tokens';
import { ScoreButton } from './ScoreButton';

export interface BottomScoreSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (amount: ScoreIncrement) => void;
}

const SHEET_TRAVEL = 420;
const DISMISS_THRESHOLD = 90;
const SPRING = { damping: 18, stiffness: 220, mass: 0.9 };

/**
 * Gesture-driven bottom sheet for the +5..+50 score grid. Springs up from
 * the bottom edge of the notebook; drag the handle down (or tap the
 * backdrop) to dismiss. Falls back to a plain fade backdrop, no native
 * modal slide, so the two animations don't fight each other.
 */
export function BottomScoreSheet({ visible, onClose, onSelect }: BottomScoreSheetProps) {
  const [mounted, setMounted] = useState(visible);
  const translateY = useSharedValue(SHEET_TRAVEL);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.value = withSpring(0, SPRING);
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else if (mounted) {
      translateY.value = withTiming(SHEET_TRAVEL, { duration: 220 });
      backdropOpacity.value = withTiming(0, { duration: 180 }, (finished) => {
        if (finished) runOnJS(setMounted)(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const close = () => {
    translateY.value = withTiming(SHEET_TRAVEL, { duration: 200 });
    backdropOpacity.value = withTiming(0, { duration: 160 }, (finished) => {
      if (finished) runOnJS(setMounted)(false);
    });
    onClose();
  };

  const pan = Gesture.Pan()
    .onChange((e) => {
      const next = translateY.value + e.changeY;
      translateY.value = Math.max(0, next);
    })
    .onEnd((e) => {
      if (translateY.value > DISMISS_THRESHOLD || e.velocityY > 800) {
        translateY.value = withTiming(SHEET_TRAVEL, { duration: 200 });
        backdropOpacity.value = withTiming(0, { duration: 160 }, (finished) => {
          if (finished) runOnJS(setMounted)(false);
        });
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, SPRING);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, DISMISS_THRESHOLD], [1, 0.5], Extrapolation.CLAMP),
  }));

  if (!mounted) return null;

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={close} statusBarTranslucent>
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>

        <Animated.View style={[styles.sheet, sheetStyle]}>
          {/* Pan is scoped to the handle strip only, so it never steals taps
              away from the ScoreButton grid below. */}
          <GestureDetector gesture={pan}>
            <View style={styles.handleZone}>
              <Animated.View style={[styles.handle, handleStyle]} />
            </View>
          </GestureDetector>
          <View style={styles.grid}>
            {SCORE_INCREMENTS.map((amount) => (
              <ScoreButton
                key={amount}
                amount={amount}
                onPress={(a) => {
                  onSelect(a);
                  close();
                }}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(17,17,17,0.35)',
  },
  sheet: {
    backgroundColor: colors.notebookWhite,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.dominoBlack,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  handleZone: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: colors.paperShadow,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
});
