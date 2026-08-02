import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme/tokens';

export interface GameProgressProps {
  current: number;
  target: number;
}

/** Leader-vs-target progress indicator. Placeholder text; Vertical C adds an animated bar. */
export function GameProgress({ current, target }: GameProgressProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {current} / {target}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  text: {
    fontSize: typography.sizes.sm,
    color: colors.pencilGray,
  },
});
