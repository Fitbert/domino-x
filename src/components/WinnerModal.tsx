import { useEffect, useMemo } from 'react';
import { AccessibilityInfo, Modal, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import type { Player } from '../types/domino';
import { colors, radii, shadows, spacing, typography } from '../theme/tokens';
import { tapLight, winHeavy } from '../utils/haptics';
import { playWinCheer } from '../utils/audio';

export interface WinnerModalProps {
  visible: boolean;
  winner: Player | null;
  onRematch: () => void;
  onNewGame: () => void;
  onStatistics: () => void;
}

/**
 * Winner celebration screen: the background darkens, the card rises in with
 * a soft spring, and a handful of muted domino-pip shapes drift in behind it
 * -- a tasteful nod to confetti, never casino-flashy. Fires `haptics.winHeavy()`
 * and a subtle win-cheer sound (both settings-gated) the moment it appears.
 */
export function WinnerModal({ visible, winner, onRematch, onNewGame, onStatistics }: WinnerModalProps) {
  useEffect(() => {
    if (!visible) return;
    winHeavy();
    playWinCheer();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      accessibilityViewIsModal
      onRequestClose={() => {}}
    >
      {visible ? <WinnerModalContent winner={winner} onRematch={onRematch} onNewGame={onNewGame} onStatistics={onStatistics} /> : null}
    </Modal>
  );
}

interface WinnerModalContentProps {
  winner: Player | null;
  onRematch: () => void;
  onNewGame: () => void;
  onStatistics: () => void;
}

function WinnerModalContent({ winner, onRematch, onNewGame, onStatistics }: WinnerModalContentProps) {
  const reducedMotion = useReducedMotion();

  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(reducedMotion ? 1 : 0.9);
  const cardTranslateY = useSharedValue(reducedMotion ? 0 : 16);

  useEffect(() => {
    backdropOpacity.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.quad) });
    if (reducedMotion) {
      cardScale.value = 1;
      cardTranslateY.value = 0;
      return;
    }
    cardScale.value = withDelay(60, withSpring(1, { damping: 14, stiffness: 140 }));
    cardTranslateY.value = withDelay(60, withSpring(0, { damping: 16, stiffness: 140 }));
  }, [backdropOpacity, cardScale, cardTranslateY, reducedMotion]);

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(winner ? `${winner.name} wins the game` : 'Game won');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
    transform: [{ scale: cardScale.value }, { translateY: cardTranslateY.value }],
  }));

  return (
    <Animated.View style={[styles.backdrop, backdropStyle]}>
      {!reducedMotion ? <PipConfetti /> : null}

      <Animated.View
        style={[styles.card, cardStyle]}
        accessibilityRole="none"
      >
        <Text style={styles.eyebrow}>Game over</Text>
        <Text
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel={winner ? `${winner.name} wins the game` : 'A player wins the game'}
        >
          {winner?.name ?? 'Winner'} wins!
        </Text>

        <View style={styles.buttonGroup}>
          <CelebrationButton
            label="Rematch"
            hint="Start a new game with the same players and score"
            onPress={onRematch}
            variant="primary"
          />
          <CelebrationButton label="New Game" hint="Set up a fresh game from scratch" onPress={onNewGame} />
          <CelebrationButton label="Statistics" hint="View game history and stats" onPress={onStatistics} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

interface CelebrationButtonProps {
  label: string;
  hint?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

function CelebrationButton({ label, hint, onPress, variant = 'secondary' }: CelebrationButtonProps) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const isPrimary = variant === 'primary';
  const buttonStyle: StyleProp<ViewStyle> = [styles.button, isPrimary && styles.buttonPrimary];

  return (
    <Animated.View style={style}>
      <Pressable
        style={buttonStyle}
        onPressIn={() => {
          tapLight();
          scale.value = withTiming(0.96, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12, stiffness: 220 });
        }}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={hint}
        hitSlop={8}
      >
        <Text style={[styles.buttonLabel, isPrimary && styles.buttonLabelPrimary]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

/** A handful of muted domino-pip shapes that drift gently in and settle -- not confetti-bright, just a wink at the tile face. */
function PipConfetti() {
  const pieces = useMemo(() => buildPipPieces(), []);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {pieces.map((piece) => (
        <PipPiece key={piece.id} piece={piece} />
      ))}
    </View>
  );
}

interface PipPieceConfig {
  id: number;
  leftPercent: number;
  startTopPercent: number;
  endTopPercent: number;
  size: number;
  dotCount: 1 | 2 | 3;
  color: string;
  delay: number;
  rotation: number;
}

function buildPipPieces(): PipPieceConfig[] {
  const palette = [colors.accentBlue, colors.pencilGray, colors.dominoBlack];
  const dotCounts: Array<1 | 2 | 3> = [1, 2, 3];
  const count = 10;
  return Array.from({ length: count }, (_, i) => {
    const seed = (i * 37 + 11) % 100;
    return {
      id: i,
      leftPercent: 6 + ((i * 9 + seed) % 88),
      startTopPercent: -12 - ((i * 13) % 20),
      endTopPercent: 8 + ((i * 17 + seed) % 55),
      size: 14 + (i % 3) * 4,
      dotCount: dotCounts[i % dotCounts.length],
      color: palette[i % palette.length],
      delay: (i % 6) * 70,
      rotation: ((i % 5) - 2) * 12,
    };
  });
}

function PipPiece({ piece }: { piece: PipPieceConfig }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      piece.delay,
      withSequence(
        withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }),
        withTiming(0.85, { duration: 900, easing: Easing.inOut(Easing.quad) })
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => {
    const top = piece.startTopPercent + (piece.endTopPercent - piece.startTopPercent) * progress.value;
    const opacity = progress.value < 0.15 ? progress.value / 0.15 : 1 - (progress.value - 0.15) * 0.15;
    return {
      position: 'absolute',
      left: `${piece.leftPercent}%`,
      top: `${top}%`,
      opacity: Math.max(0, Math.min(0.4, opacity)),
      transform: [{ rotate: `${piece.rotation}deg` }],
    };
  });

  const dotRadius = piece.size * 0.09;
  const positions = pipDotPositions(piece.dotCount, piece.size);

  return (
    <Animated.View style={style}>
      <Svg width={piece.size} height={piece.size} viewBox={`0 0 ${piece.size} ${piece.size}`}>
        {positions.map(([cx, cy], idx) => (
          <Circle key={idx} cx={cx} cy={cy} r={dotRadius} fill={piece.color} />
        ))}
      </Svg>
    </Animated.View>
  );
}

function pipDotPositions(count: 1 | 2 | 3, size: number): Array<[number, number]> {
  const mid = size / 2;
  const q = size * 0.28;
  if (count === 1) return [[mid, mid]];
  if (count === 2)
    return [
      [mid - q, mid - q],
      [mid + q, mid + q],
    ];
  return [
    [mid - q, mid - q],
    [mid, mid],
    [mid + q, mid + q],
  ];
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,17,17,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.notebookWhite,
    borderRadius: radii.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 420,
    gap: spacing.sm,
    alignItems: 'center',
    ...shadows.card,
  },
  eyebrow: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fontFamily.semibold,
    color: colors.pencilGray,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.dominoBlack,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  buttonGroup: {
    width: '100%',
    gap: spacing.sm,
  },
  button: {
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.paperShadow,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonPrimary: {
    backgroundColor: colors.accentBlue,
  },
  buttonLabel: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.semibold,
    color: colors.dominoBlack,
  },
  buttonLabelPrimary: {
    color: colors.notebookWhite,
  },
});
