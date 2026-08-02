import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/tokens';

export interface DominoXProps {
  /** Number of pencil strokes drawn in this block, 0-10. 10 = fully complete. */
  strokes: number;
  size?: number;
}

/**
 * One 50-point domino scoring block (traditional X-tally pattern).
 * Placeholder box-and-count rendering; Vertical A replaces internals with
 * a Skia hand-drawn pencil-stroke animation while keeping this prop contract.
 */
export function DominoX({ strokes, size = 64 }: DominoXProps) {
  return (
    <View style={[styles.box, { width: size, height: size }]}>
      <Text style={styles.count}>{strokes}/10</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: colors.pencilGray,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    color: colors.pencilGray,
    fontSize: 12,
  },
});
