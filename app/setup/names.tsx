import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../src/theme/tokens';

/** Step 2: player names. Placeholder for Vertical B. */
export default function NamesStep() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who&apos;s playing?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.notebookWhite,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.dominoBlack,
  },
});
