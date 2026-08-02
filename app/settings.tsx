import { StyleSheet, Switch, Text, View } from 'react-native';

import { colors, spacing, typography } from '../src/theme/tokens';
import { useSettingsStore } from '../src/store/settingsStore';
import { PaperBackground } from '../src/components/PaperBackground';
import { NotebookHeader } from '../src/components/NotebookHeader';

/**
 * Haptics/audio toggles. Placeholder plain switches; Vertical D wires real
 * sound preview on toggle and an accessibility pass.
 */
export default function SettingsScreen() {
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);
  const audioEnabled = useSettingsStore((s) => s.audioEnabled);
  const setHapticsEnabled = useSettingsStore((s) => s.setHapticsEnabled);
  const setAudioEnabled = useSettingsStore((s) => s.setAudioEnabled);

  return (
    <PaperBackground>
      <NotebookHeader title="Settings" />
      <View style={styles.row}>
        <Text style={styles.label}>Haptics</Text>
        <Switch value={hapticsEnabled} onValueChange={setHapticsEnabled} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Sound</Text>
        <Switch value={audioEnabled} onValueChange={setAudioEnabled} />
      </View>
    </PaperBackground>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.md,
    color: colors.dominoBlack,
  },
});
