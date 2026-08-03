import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { colors, radii, spacing, typography } from '../../src/theme/tokens';
import { WINNING_SCORE_OPTIONS } from '../../src/domino/constants';
import { PaperBackground } from '../../src/components/PaperBackground';
import { NotebookHeader } from '../../src/components/NotebookHeader';
import { useGameStore } from '../../src/store/gameStore';
import { tapLight, completeSuccess } from '../../src/utils/haptics';
import { useSetupWizard } from './_layout';

/** Final step: pick the race-to target, then start the real game. */
export default function WinningScoreStep() {
  const { setup, setWinningScore } = useSetupWizard();
  const startGame = useGameStore((s) => s.startGame);
  const totalSteps = 4;

  const [selected, setSelected] = useState(setup.winningScore);

  const handleStart = () => {
    completeSuccess();
    setWinningScore(selected);
    startGame({
      mode: setup.mode,
      playerNames: setup.playerNames,
      memberNames: setup.mode === 'teams' ? setup.teamMembers : undefined,
      winningScore: selected,
    });
    router.replace('/game');
  };

  return (
    <PaperBackground>
      <NotebookHeader
        title="Winning Score"
        subtitle="Race to..."
        onBack={() => router.back()}
        step={{ current: totalSteps, total: totalSteps }}
      />
      <View style={styles.container}>
        <View style={styles.grid}>
          {WINNING_SCORE_OPTIONS.map((score, i) => {
            const isSelected = score === selected;
            return (
              <Animated.View key={score} entering={FadeInUp.delay(i * 55).springify().damping(15)}>
                <Pressable
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => {
                    tapLight();
                    setSelected(score);
                  }}
                >
                  <Text style={[styles.chipValue, isSelected && styles.chipValueSelected]}>{score}</Text>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        <Pressable style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startLabel}>Start Game</Text>
        </Pressable>
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  chip: {
    width: 88,
    height: 88,
    borderRadius: radii.lg,
    backgroundColor: colors.notebookWhite,
    borderWidth: 1,
    borderColor: colors.paperShadow,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.dominoBlack,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  chipSelected: {
    backgroundColor: colors.accentBlue,
    borderColor: colors.accentBlue,
  },
  chipValue: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.dominoBlack,
  },
  chipValueSelected: {
    color: colors.notebookWhite,
  },
  startButton: {
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.dominoBlack,
    alignItems: 'center',
  },
  startLabel: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.bold,
    color: colors.notebookWhite,
    letterSpacing: 0.5,
  },
});
