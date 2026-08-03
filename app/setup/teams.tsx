import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { colors, radii, spacing, typography } from '../../src/theme/tokens';
import { PaperBackground } from '../../src/components/PaperBackground';
import { NotebookHeader } from '../../src/components/NotebookHeader';
import { tapLight } from '../../src/utils/haptics';
import { useSetupWizard } from './_layout';

/**
 * Step 3 (teams mode): name each team and its roster. A team is ONE scoring
 * entity — this screen produces exactly `teamCount` player names (the teams)
 * plus a member roster per team for display, so the game screen pools score
 * per team instead of per person. Routes straight to winning-score, skipping
 * the individual-mode names step entirely.
 */
export default function TeamsStep() {
  const { setup, setPlayerNames, setTeamMembers } = useSetupWizard();
  const playersPerTeam = setup.playerCount / setup.teamCount;

  const [teamNames, setTeamNames] = useState<string[]>(() =>
    setup.playerNames.length === setup.teamCount
      ? setup.playerNames
      : Array.from({ length: setup.teamCount }, (_, i) => `Team ${i + 1}`),
  );
  const [rosters, setRosters] = useState<string[][]>(() =>
    setup.teamMembers.length === setup.teamCount
      ? setup.teamMembers
      : Array.from({ length: setup.teamCount }, () =>
          Array.from({ length: playersPerTeam }, () => ''),
        ),
  );

  const allFilled =
    teamNames.every((n) => n.trim().length > 0) &&
    rosters.every((roster) => roster.every((n) => n.trim().length > 0));

  const handleNext = () => {
    if (!allFilled) return;
    tapLight();
    setPlayerNames(teamNames.map((n) => n.trim()));
    setTeamMembers(rosters.map((roster) => roster.map((n) => n.trim())));
    router.push('/setup/winning-score');
  };

  return (
    <PaperBackground>
      <NotebookHeader
        title="Name the Teams"
        subtitle={`${playersPerTeam} players per team, one shared score`}
        onBack={() => router.back()}
        step={{ current: 3, total: 4 }}
      />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {teamNames.map((teamName, teamIndex) => (
          <View key={teamIndex} style={styles.teamCard}>
            <TextInput
              style={styles.teamNameInput}
              value={teamName}
              onChangeText={(text) =>
                setTeamNames((prev) => prev.map((n, i) => (i === teamIndex ? text : n)))
              }
              placeholder={`Team ${teamIndex + 1}`}
              placeholderTextColor={colors.paperShadow}
              maxLength={20}
              returnKeyType="next"
            />
            <View style={styles.rosterList}>
              {rosters[teamIndex].map((memberName, memberIndex) => (
                <View key={memberIndex} style={styles.field}>
                  <Text style={styles.index}>{memberIndex + 1}</Text>
                  <TextInput
                    style={styles.input}
                    value={memberName}
                    onChangeText={(text) =>
                      setRosters((prev) =>
                        prev.map((roster, i) =>
                          i === teamIndex
                            ? roster.map((n, j) => (j === memberIndex ? text : n))
                            : roster,
                        ),
                      )
                    }
                    placeholder={`Player ${memberIndex + 1}`}
                    placeholderTextColor={colors.paperShadow}
                    maxLength={24}
                    returnKeyType="next"
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, !allFilled && styles.buttonDisabled]}
          disabled={!allFilled}
          onPress={handleNext}
        >
          <Text style={styles.buttonLabel}>Continue</Text>
        </Pressable>
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  teamCard: {
    backgroundColor: colors.notebookWhite,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.paperShadow,
    padding: spacing.md,
    gap: spacing.md,
  },
  teamNameInput: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
    color: colors.accentBlue,
    paddingVertical: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: colors.paperShadow,
  },
  rosterList: {
    gap: spacing.sm,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  index: {
    width: 20,
    fontSize: typography.sizes.sm,
    color: colors.pencilGray,
    fontWeight: typography.weights.medium as any,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.dominoBlack,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.paperShadow,
  },
  footer: {
    padding: spacing.lg,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.notebookWhite,
  },
});
