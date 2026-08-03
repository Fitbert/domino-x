import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { Player } from '../types/domino';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';
import { MOTION } from '../animation/motion';
import { tapLight } from '../utils/haptics';
import { DominoScoreStrip } from './DominoScoreStrip';

export interface PlayerCardProps {
  player: Player;
  isWinner?: boolean;
  /** This player/team's seat color (see theme/tokens accentForIndex). Defaults to the app accent blue. */
  accentColor?: string;
  onScorePress: () => void;
  onHistoryPress: () => void;
}

/** Score count-up duration. Not present in src/animation/motion.ts (which
 * only covers card-tap/stroke/winner timings), so a sensible dedicated
 * value is used here. */
const SCORE_COUNT_MS = 420;

/**
 * A player's card: large playing card lying on the notebook. Name and
 * running score up top, the DominoX strip beneath, a History affordance in
 * the corner. Taps depress the whole card (scale 0.98, spring back) with a
 * light haptic; the score counts up rather than jumping to the new value.
 */
export function PlayerCard({
  player,
  isWinner,
  accentColor = colors.accentBlue,
  onScorePress,
  onHistoryPress,
}: PlayerCardProps) {
  const pressed = useSharedValue(0);
  const winnerLift = useSharedValue(isWinner ? 1 : 0);
  const animatedScore = useSharedValue(player.score);
  const previousScore = useRef(player.score);
  const [displayScore, setDisplayScore] = useState(player.score);

  useEffect(() => {
    if (player.score !== previousScore.current) {
      previousScore.current = player.score;
      animatedScore.value = withTiming(player.score, { duration: SCORE_COUNT_MS });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.score]);

  useAnimatedReaction(
    () => Math.round(animatedScore.value),
    (value, previous) => {
      if (value !== previous) {
        runOnJS(setDisplayScore)(value);
      }
    },
  );

  useEffect(() => {
    winnerLift.value = withTiming(isWinner ? 1 : 0, { duration: MOTION.winnerCardElevateMs });
  }, [isWinner, winnerLift]);

  const cardStyle = useAnimatedStyle(() => {
    const pressScale = 1 - pressed.value * (1 - MOTION.cardTap.scale);
    const winnerScale = 1 + winnerLift.value * 0.015;
    return {
      transform: [{ scale: pressScale * winnerScale }],
      shadowOpacity: 0.08 + winnerLift.value * 0.08,
      shadowRadius: 12 + winnerLift.value * 8,
    };
  });

  return (
    <Animated.View
      style={[styles.card, isWinner && [styles.winnerCard, { borderColor: accentColor }], cardStyle]}
    >
      <Pressable
        onPressIn={() => {
          pressed.value = withTiming(1, { duration: MOTION.cardTap.durationMs });
        }}
        onPressOut={() => {
          pressed.value = withSpring(0, { damping: 14, stiffness: 220 });
        }}
        onPress={() => {
          tapLight();
          onScorePress();
        }}
      >
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <View style={[styles.accentDot, { backgroundColor: accentColor }]} />
            <View style={styles.nameColumn}>
              <Text style={styles.name} numberOfLines={1}>
                {player.name}
              </Text>
              {player.members && player.members.length > 0 ? (
                <Text style={styles.members} numberOfLines={1}>
                  {player.members.join(' & ')}
                </Text>
              ) : null}
            </View>
          </View>
          <Text style={[styles.score, { color: accentColor }]}>{displayScore}</Text>
        </View>
        <View style={styles.stripWrap}>
          <DominoScoreStrip score={player.score} glowColor={accentColor} />
        </View>
      </Pressable>

      <Pressable onPress={onHistoryPress} hitSlop={8} style={styles.historyRow}>
        <Text style={styles.historyLabel}>History</Text>
        <Text style={styles.historyChevron}>›</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.notebookWhite,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: colors.dominoBlack,
    shadowOffset: shadows.card.shadowOffset,
    borderWidth: 1,
    borderColor: colors.paperShadow,
  },
  winnerCard: {
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginRight: spacing.sm,
  },
  accentDot: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
  },
  nameColumn: {
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.dominoBlack,
  },
  members: {
    fontSize: typography.sizes.sm,
    color: colors.pencilGray,
    marginTop: 1,
  },
  score: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.fontFamily.bold,
    fontVariant: ['tabular-nums'],
  },
  stripWrap: {
    minHeight: 32,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 2,
  },
  historyLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.pencilGray,
  },
  historyChevron: {
    fontSize: typography.sizes.sm,
    color: colors.pencilGray,
  },
});
