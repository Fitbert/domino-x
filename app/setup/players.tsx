import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { colors, radii, spacing, typography } from '../../src/theme/tokens';
import { PaperBackground } from '../../src/components/PaperBackground';
import { NotebookHeader } from '../../src/components/NotebookHeader';
import { tapLight } from '../../src/utils/haptics';
import { useSetupWizard } from './_layout';

const INDIVIDUAL_OPTIONS = [2, 3, 4, 5, 6];
const TEAM_OPTIONS = [
  { teams: 2, label: '2 vs 2', players: 4 },
  { teams: 3, label: '3 vs 3', players: 6 },
];
/** Step 2: how many players (or how the teams are sized). */
export default function PlayersStep() {
  const { setup, setPlayerCount, setTeamCount } = useSetupWizard();
  const isTeams = setup.mode === 'teams';
  const totalSteps = isTeams ? 5 : 4;

  const chooseIndividual = (count: number) => {
    tapLight();
    setPlayerCount(count);
    router.push('/setup/names');
  };

  const chooseTeams = (teams: number, players: number) => {
    tapLight();
    setTeamCount(teams);
    setPlayerCount(players);
    router.push('/setup/teams');
  };

  return (
    <PaperBackground>
      <NotebookHeader
        title={isTeams ? 'Team Size' : 'Players'}
        subtitle={isTeams ? 'How many teams?' : 'How many players?'}
        onBack={() => router.back()}
        step={{ current: 2, total: totalSteps }}
      />
      <View style={styles.container}>
        <View style={styles.grid}>
          {isTeams
            ? TEAM_OPTIONS.map((option, i) => (
                <Animated.View key={option.teams} entering={FadeInUp.delay(i * 70).springify().damping(15)}>
                  <Pressable style={styles.chip} onPress={() => chooseTeams(option.teams, option.players)}>
                    <Text style={styles.chipValue}>{option.label}</Text>
                    <Text style={styles.chipCaption}>{option.players} players</Text>
                  </Pressable>
                </Animated.View>
              ))
            : INDIVIDUAL_OPTIONS.map((count, i) => (
                <Animated.View key={count} entering={FadeInUp.delay(i * 55).springify().damping(15)}>
                  <Pressable style={styles.chip} onPress={() => chooseIndividual(count)}>
                    <Text style={styles.chipValue}>{count}</Text>
                    <Text style={styles.chipCaption}>players</Text>
                  </Pressable>
                </Animated.View>
              ))}
        </View>
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  chip: {
    width: 104,
    height: 104,
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
  chipValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.dominoBlack,
  },
  chipCaption: {
    fontSize: typography.sizes.xs,
    color: colors.pencilGray,
    marginTop: 2,
  },
});
