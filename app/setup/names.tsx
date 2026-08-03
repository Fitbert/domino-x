import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { colors, radii, spacing, typography } from '../../src/theme/tokens';
import { PaperBackground } from '../../src/components/PaperBackground';
import { NotebookHeader } from '../../src/components/NotebookHeader';
import { tapLight } from '../../src/utils/haptics';
import { useSetupWizard } from './_layout';

function seedNames(setup: { playerCount: number; playerNames: string[] }): string[] {
  if (setup.playerNames.length === setup.playerCount) return setup.playerNames;
  return Array.from({ length: setup.playerCount }, (_, i) => `Player ${i + 1}`);
}

/** Step 3 (individual mode only): who's playing — one text field per player, notebook-ruled. */
export default function NamesStep() {
  const { setup, setPlayerNames } = useSetupWizard();

  const [names, setNames] = useState<string[]>(() => seedNames(setup));

  const allFilled = names.every((n) => n.trim().length > 0);

  const handleNext = () => {
    if (!allFilled) return;
    tapLight();
    setPlayerNames(names.map((n) => n.trim()));
    router.push('/setup/winning-score');
  };

  return (
    <PaperBackground>
      <NotebookHeader
        title="Who's Playing?"
        subtitle="Tap a line to edit a name"
        onBack={() => router.back()}
        step={{ current: 3, total: 4 }}
      />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {names.map((name, i) => (
          <View key={i} style={styles.field}>
            <Text style={styles.index}>{i + 1}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) =>
                setNames((prev) => prev.map((n, idx) => (idx === i ? text : n)))
              }
              placeholder={`Player ${i + 1}`}
              placeholderTextColor={colors.paperShadow}
              maxLength={24}
              returnKeyType="next"
            />
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
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  index: {
    width: 24,
    fontSize: typography.sizes.sm,
    color: colors.pencilGray,
    fontFamily: typography.fontFamily.medium,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontFamily: typography.fontFamily.semibold,
    color: colors.dominoBlack,
    paddingVertical: spacing.sm,
    borderBottomWidth: 2,
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
    fontFamily: typography.fontFamily.semibold,
    color: colors.notebookWhite,
  },
});
