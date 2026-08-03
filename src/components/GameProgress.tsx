import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, radii, spacing, typography } from '../theme/tokens';

export interface GameProgressProps {
  current: number;
  target: number;
}

/** Progress at/above this fraction gets the "almost there" pulse treatment. */
const CLOSE_THRESHOLD = 0.9;

/**
 * Leader-vs-target progress indicator. A thin ruled track fills toward the
 * winning score with a leading marker, animating smoothly as `current`
 * changes and pulsing gently once the leader is within reach of `target`.
 */
export function GameProgress({ current, target }: GameProgressProps) {
  const safeTarget = target > 0 ? target : 1;
  const pct = Math.min(100, Math.max(0, (current / safeTarget) * 100));
  const isNearOrDone = pct >= CLOSE_THRESHOLD * 100;

  const progress = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(pct, { duration: 420, easing: Easing.out(Easing.cubic) });
  }, [pct]);

  useEffect(() => {
    if (isNearOrDone) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.35, { duration: 550, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 550, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(1, { duration: 200 });
    }
  }, [isNearOrDone]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const markerStyle = useAnimatedStyle(() => ({
    left: `${progress.value}%`,
    transform: [{ translateX: -MARKER_SIZE / 2 }, { scale: pulse.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Leader</Text>
        <Text style={styles.value}>
          {current}
          <Text style={styles.target}> / {target}</Text>
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle, isNearOrDone && styles.fillHot]} />
        <Animated.View style={[styles.marker, markerStyle, isNearOrDone && styles.markerHot]} />
      </View>
    </View>
  );
}

const TRACK_HEIGHT = 8;
const MARKER_SIZE = 16;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  label: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fontFamily.semibold,
    color: colors.pencilGray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.accentBlue,
  },
  target: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.pencilGray,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: radii.pill,
    backgroundColor: colors.paperShadow,
    overflow: 'visible',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: TRACK_HEIGHT,
    borderRadius: radii.pill,
    backgroundColor: colors.accentBlue,
  },
  fillHot: {
    backgroundColor: colors.dominoBlack,
  },
  marker: {
    position: 'absolute',
    top: (TRACK_HEIGHT - MARKER_SIZE) / 2,
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: radii.pill,
    backgroundColor: colors.notebookWhite,
    borderWidth: 2,
    borderColor: colors.accentBlue,
    shadowColor: colors.dominoBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  markerHot: {
    borderColor: colors.dominoBlack,
  },
});
