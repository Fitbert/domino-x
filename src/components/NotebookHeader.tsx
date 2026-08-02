import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme/tokens';

export interface NotebookHeaderProps {
  title: string;
}

/** Shared screen header. Placeholder; Vertical B adds paper-notebook styling. */
export function NotebookHeader({ title }: NotebookHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.dominoBlack,
  },
});
