import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Rect } from 'react-native-svg';
import Animated, { FadeInUp } from 'react-native-reanimated';

import type { GameMode } from '../../src/types/domino';
import { colors, radii, spacing, typography } from '../../src/theme/tokens';
import { PaperBackground } from '../../src/components/PaperBackground';
import { NotebookHeader } from '../../src/components/NotebookHeader';
import { tapLight } from '../../src/utils/haptics';
import { useSetupWizard } from './_layout';

const TOTAL_STEPS = 4;

/** Step 1: individual vs teams — the one decision this screen asks for. */
export default function GameModeStep() {
  const { setMode, setPlayerCount, setTeamCount } = useSetupWizard();

  const choose = (mode: GameMode) => {
    tapLight();
    setMode(mode);
    if (mode === 'teams') {
      setPlayerCount(4);
      setTeamCount(2);
    } else {
      setPlayerCount(2);
    }
    router.push('/setup/players');
  };

  return (
    <PaperBackground>
      <NotebookHeader
        title="New Game"
        subtitle="How are we playing?"
        step={{ current: 1, total: TOTAL_STEPS }}
      />
      <View style={styles.container}>
        <ModeCard
          index={0}
          icon={<SingleTileIcon />}
          label="Individual"
          description="Every player keeps their own score"
          onPress={() => choose('individual')}
        />
        <ModeCard
          index={1}
          icon={<PairedTileIcon />}
          label="Teams"
          description="Partners share one running score"
          onPress={() => choose('teams')}
        />
      </View>
    </PaperBackground>
  );
}

function ModeCard({
  icon,
  label,
  description,
  onPress,
  index,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  onPress: () => void;
  index: number;
}) {
  return (
    <Animated.View entering={FadeInUp.delay(index * 90).springify().damping(15)}>
      <Pressable style={styles.card} onPress={onPress}>
        {icon}
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </Pressable>
    </Animated.View>
  );
}

function SingleTileIcon() {
  return (
    <Svg width={56} height={40} style={styles.icon}>
      <Rect x={1} y={1} width={54} height={38} rx={8} fill={colors.notebookWhite} stroke={colors.dominoBlack} strokeWidth={2} />
      <Circle cx={18} cy={13} r={3.2} fill={colors.dominoBlack} />
      <Circle cx={38} cy={13} r={3.2} fill={colors.dominoBlack} />
      <Circle cx={18} cy={27} r={3.2} fill={colors.dominoBlack} />
      <Circle cx={38} cy={27} r={3.2} fill={colors.dominoBlack} />
    </Svg>
  );
}

function PairedTileIcon() {
  return (
    <Svg width={70} height={44} style={styles.icon}>
      <Rect x={1} y={5} width={44} height={32} rx={7} fill={colors.notebookWhite} stroke={colors.paperShadow} strokeWidth={2} />
      <Rect x={25} y={1} width={44} height={32} rx={7} fill={colors.notebookWhite} stroke={colors.dominoBlack} strokeWidth={2} />
      <Circle cx={38} cy={11} r={2.8} fill={colors.dominoBlack} />
      <Circle cx={56} cy={11} r={2.8} fill={colors.dominoBlack} />
      <Circle cx={47} cy={17} r={2.8} fill={colors.accentBlue} />
      <Circle cx={38} cy={23} r={2.8} fill={colors.dominoBlack} />
      <Circle cx={56} cy={23} r={2.8} fill={colors.dominoBlack} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.notebookWhite,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.paperShadow,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.dominoBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  icon: {
    marginBottom: spacing.sm,
  },
  cardLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
    color: colors.dominoBlack,
  },
  cardDescription: {
    fontSize: typography.sizes.sm,
    color: colors.pencilGray,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
