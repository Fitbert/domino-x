import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { ScoreIncrement } from '../types/domino';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { tapLight } from '../utils/haptics';

export interface ScoreButtonProps {
  amount: ScoreIncrement;
  onPress: (amount: ScoreIncrement) => void;
}

/**
 * A single +N tile in the score grid. Sits "lifted" off the sheet at rest
 * (soft shadow) and presses flush into the paper on touch, like a physical
 * domino tile being placed — with a light haptic tap to match.
 */
export function ScoreButton({ amount, onPress }: ScoreButtonProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressed.value, [0, 1], [1, 0.93]);
    const translateY = interpolate(pressed.value, [0, 1], [0, 2]);
    const shadowOpacity = interpolate(pressed.value, [0, 1], [0.14, 0.03]);
    const elevation = interpolate(pressed.value, [0, 1], [4, 1]);
    return {
      transform: [{ scale }, { translateY }],
      shadowOpacity,
      elevation,
    };
  });

  return (
    <Pressable
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 90 });
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 12, stiffness: 180 });
      }}
      onPress={() => {
        tapLight();
        onPress(amount);
      }}
      hitSlop={4}
    >
      <Animated.View style={[styles.button, animatedStyle]}>
        <Text style={styles.label}>+{amount}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: colors.notebookWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.dominoBlack,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: colors.paperShadow,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as any,
    color: colors.dominoBlack,
  },
});
