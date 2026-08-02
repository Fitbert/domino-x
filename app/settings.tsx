import { StyleSheet, Switch, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../src/theme/tokens';
import { useSettingsStore } from '../src/store/settingsStore';
import { PaperBackground } from '../src/components/PaperBackground';
import { NotebookHeader } from '../src/components/NotebookHeader';
import { tapLight } from '../src/utils/haptics';
import { playCardTap } from '../src/utils/audio';

interface SettingRowProps {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

/** One toggle row: label, a short description of what it affects, and a switch. */
function SettingRow({ label, description, value, onValueChange }: SettingRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityRole="switch"
        accessibilityLabel={label}
        accessibilityHint={description}
        accessibilityState={{ checked: value }}
        trackColor={{ false: colors.paperShadow, true: colors.accentBlue }}
        thumbColor={colors.notebookWhite}
      />
    </View>
  );
}

/**
 * Haptics/Sound toggles for the notebook aesthetic. Flipping a switch gives
 * an immediate, tasteful preview of what it controls (a tap for haptics, a
 * soft card-tap sound for audio) so the setting is felt, not just read.
 */
export default function SettingsScreen() {
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);
  const audioEnabled = useSettingsStore((s) => s.audioEnabled);
  const setHapticsEnabled = useSettingsStore((s) => s.setHapticsEnabled);
  const setAudioEnabled = useSettingsStore((s) => s.setAudioEnabled);

  const handleHapticsChange = (value: boolean) => {
    setHapticsEnabled(value);
    if (value) tapLight();
  };

  const handleAudioChange = (value: boolean) => {
    setAudioEnabled(value);
    if (value) playCardTap();
  };

  return (
    <PaperBackground>
      <NotebookHeader title="Settings" />
      <View style={styles.section} accessibilityRole="none">
        <SettingRow
          label="Haptics"
          description="Feel a tap when you score, undo, or win."
          value={hapticsEnabled}
          onValueChange={handleHapticsChange}
        />
        <View style={styles.divider} />
        <SettingRow
          label="Sound"
          description="Subtle notebook sounds for scoring and winning."
          value={audioEnabled}
          onValueChange={handleAudioChange}
        />
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    backgroundColor: colors.notebookWhite,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs / 2,
  },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.dominoBlack,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.pencilGray,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.paperShadow,
  },
});
