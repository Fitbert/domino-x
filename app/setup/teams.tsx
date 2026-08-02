import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { colors, radii, spacing, typography } from '../../src/theme/tokens';
import { PaperBackground } from '../../src/components/PaperBackground';
import { NotebookHeader } from '../../src/components/NotebookHeader';
import { tapLight } from '../../src/utils/haptics';
import { useSetupWizard } from './_layout';

/**
 * Step 3 (teams mode only): name the teams. Since GameConfig has no separate
 * team-grouping field, each team's name is folded into its players' names on
 * the Names step (e.g. "Sharks · Alex") — a lightweight way to keep team
 * identity visible on the scorecard without changing the locked data model.
 */
export default function TeamsStep() {
  const { setup, setPlayerNames } = useSetupWizard();
  const [teamNames, setTeamNames] = useState<string[]>(
    Array.from({ length: setup.teamCount }, (_, i) => `Team ${i + 1}`),
  );

  const playersPerTeam = setup.playerCount / setup.teamCount;

  const handleNext = () => {
    tapLight();
    // Seed placeholder player names grouped by team; names.tsx lets the
    // player edit each one before starting the game.
    const seeded: string[] = [];
    teamNames.forEach((teamName, teamIndex) => {
      for (let p = 0; p < playersPerTeam; p += 1) {
        seeded.push(`${teamName.trim() || `Team ${teamIndex + 1}`} · Player ${p + 1}`);
      }
    });
    setPlayerNames(seeded);
    router.push('/setup/names');
  };

  return (
    <PaperBackground>
      <NotebookHeader
        title="Name the Teams"
        subtitle={`${playersPerTeam} players per team`}
        onBack={() => router.back()}
        step={{ current: 3, total: 5 }}
      />
      <View style={styles.container}>
        {teamNames.map((name, i) => (
          <View key={i} style={styles.field}>
            <Text style={styles.label}>Team {i + 1}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) =>
                setTeamNames((prev) => prev.map((n, idx) => (idx === i ? text : n)))
              }
              placeholder={`Team ${i + 1}`}
              placeholderTextColor={colors.paperShadow}
              maxLength={20}
              returnKeyType="done"
            />
          </View>
        ))}

        <Pressable style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonLabel}>Continue</Text>
        </Pressable>
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.pencilGray,
    fontWeight: typography.weights.medium as any,
  },
  input: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold as any,
    color: colors.dominoBlack,
    paddingVertical: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: colors.paperShadow,
  },
  button: {
    marginTop: 'auto',
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.notebookWhite,
  },
});
