import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Line } from 'react-native-svg';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors, radii, spacing, typography } from '../src/theme/tokens';
import { PaperBackground } from '../src/components/PaperBackground';
import { useGameStore } from '../src/store/gameStore';
import { tapLight } from '../src/utils/haptics';

/**
 * Home: the cover of the notebook. Wordmark and domino mark fade upward on
 * mount, then the action buttons spring in one after another.
 */
export default function HomeScreen() {
  const activeGame = useGameStore((s) => s.activeGame);
  const hasActiveGame = !!activeGame;

  return (
    <PaperBackground>
      <View style={styles.container}>
        <Animated.View
          entering={FadeInDown.duration(650).easing(Easing.out(Easing.cubic))}
          style={styles.hero}
        >
          <DominoMark />
          <Text style={styles.title}>DOMINO X</Text>
          <Text style={styles.subtitle}>The Scorepad You&apos;ll Never Lose</Text>
        </Animated.View>

        <View style={styles.actions}>
          <HomeButton
            index={0}
            label="New Game"
            primary
            onPress={() => router.push('/setup/game-mode')}
          />
          <HomeButton
            index={1}
            label="Resume Game"
            disabled={!hasActiveGame}
            onPress={() => router.push('/game')}
          />
          <HomeButton index={2} label="Statistics" onPress={() => router.push('/statistics')} />
          <HomeButton index={3} label="Settings" onPress={() => router.push('/settings')} />
        </View>
      </View>
    </PaperBackground>
  );
}

function DominoMark() {
  return (
    <Svg width={88} height={132} style={styles.mark}>
      <Line x1={2} y1={2} x2={86} y2={2} stroke={colors.dominoBlack} strokeWidth={2} />
      <Line x1={2} y1={130} x2={86} y2={130} stroke={colors.dominoBlack} strokeWidth={2} />
      <Line x1={2} y1={2} x2={2} y2={130} stroke={colors.dominoBlack} strokeWidth={2} />
      <Line x1={86} y1={2} x2={86} y2={130} stroke={colors.dominoBlack} strokeWidth={2} />
      <Line x1={2} y1={66} x2={86} y2={66} stroke={colors.dominoBlack} strokeWidth={2} />

      {/* top half: 6 pips */}
      {[24, 44, 64].map((cy) => (
        <Circle key={`t-l-${cy}`} cx={26} cy={cy - 3} r={4.5} fill={colors.dominoBlack} />
      ))}
      {[24, 44, 64].map((cy) => (
        <Circle key={`t-r-${cy}`} cx={62} cy={cy - 3} r={4.5} fill={colors.dominoBlack} />
      ))}

      {/* bottom half: 3 pips */}
      <Circle cx={26} cy={90} r={4.5} fill={colors.accentBlue} />
      <Circle cx={44} cy={108} r={4.5} fill={colors.accentBlue} />
      <Circle cx={62} cy={126} r={4.5} fill={colors.accentBlue} />
    </Svg>
  );
}

function HomeButton({
  label,
  primary,
  disabled,
  index,
  onPress,
}: {
  label: string;
  primary?: boolean;
  disabled?: boolean;
  index: number;
  onPress: () => void;
}) {
  const pressed = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.03 }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(250 + index * 90).springify().damping(14)}>
      <Pressable
        disabled={disabled}
        onPressIn={() => {
          pressed.value = withTiming(1, { duration: 90 });
        }}
        onPressOut={() => {
          pressed.value = withSpring(0, { damping: 12, stiffness: 200 });
        }}
        onPress={() => {
          tapLight();
          onPress();
        }}
      >
        <Animated.View
          style={[
            styles.button,
            primary && styles.buttonPrimary,
            disabled && styles.buttonDisabled,
            style,
          ]}
        >
          <Text
            style={[
              styles.buttonLabel,
              primary && styles.buttonLabelPrimary,
              disabled && styles.buttonLabelDisabled,
            ]}
          >
            {label}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  mark: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.fontFamily.bold,
    color: colors.dominoBlack,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.pencilGray,
    marginTop: spacing.xs,
  },
  actions: {
    width: '100%',
    gap: spacing.sm,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.paperShadow,
    alignItems: 'center',
    shadowColor: colors.dominoBlack,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonPrimary: {
    backgroundColor: colors.accentBlue,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonLabel: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.semibold,
    color: colors.dominoBlack,
  },
  buttonLabelPrimary: {
    color: colors.notebookWhite,
  },
  buttonLabelDisabled: {
    color: colors.pencilGray,
  },
});
