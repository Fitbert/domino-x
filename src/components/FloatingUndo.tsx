import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown } from 'react-native-reanimated';

import { colors, radii, spacing, typography } from '../theme/tokens';
import { useGameStore } from '../store/gameStore';
import { tapLight } from '../utils/haptics';

export interface FloatingUndoProps {
  visible: boolean;
  onUndo: () => void;
}

/** How long the "Undid +N for Name" confirmation lingers before self-clearing. */
const TOAST_DURATION_MS = 1800;

/**
 * Always-visible undo affordance while the active game has scores. Animates
 * in/out with `visible` (Reanimated enter/exit on mount/unmount), and — after
 * a tap — surfaces a brief confirmation sourced from the store's
 * `lastUndone` (set by `undoLast()` itself, so this stays correct even if
 * something else in the app also triggers an undo).
 */
export function FloatingUndo({ visible, onUndo }: FloatingUndoProps) {
  const lastUndone = useGameStore((s) => s.lastUndone);
  const clearLastUndone = useGameStore((s) => s.clearLastUndone);

  // Auto-dismiss the confirmation a short while after it appears.
  useEffect(() => {
    if (!lastUndone) return;
    const timer = setTimeout(() => clearLastUndone(), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [lastUndone, clearLastUndone]);

  if (!visible) return null;

  const handlePress = () => {
    tapLight();
    onUndo();
  };

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(16).stiffness(180)}
      exiting={FadeOutDown.duration(160)}
      style={styles.wrapper}
      pointerEvents="box-none"
    >
      {lastUndone && (
        <Animated.View
          key={lastUndone.timestamp}
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(160)}
          style={styles.toast}
        >
          <Text style={styles.toastText} numberOfLines={1}>
            Undid +{lastUndone.amount} for {lastUndone.playerName}
          </Text>
        </Animated.View>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Undo last score"
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handlePress}
        hitSlop={8}
      >
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>↺</Text>
        </View>
        <Text style={styles.label}>Undo</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: spacing.lg,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: spacing.xs,
  },
  toast: {
    backgroundColor: colors.dominoBlack,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
    maxWidth: '86%',
  },
  toastText: {
    color: colors.notebookWhite,
    fontSize: typography.sizes.xs,
    fontFamily: typography.fontFamily.medium,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: colors.dominoBlack,
    shadowColor: colors.dominoBlack,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: colors.notebookWhite,
    fontSize: typography.sizes.lg,
    lineHeight: typography.sizes.lg,
  },
  label: {
    color: colors.notebookWhite,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.semibold,
  },
});
