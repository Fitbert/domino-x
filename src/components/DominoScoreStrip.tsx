import { StyleSheet, View } from 'react-native';

import { BLOCK_VALUE, STROKES_PER_BLOCK, completedBlocks, strokesInCurrentBlock } from '../domino/constants';
import { DominoX } from './DominoX';

export interface DominoScoreStripProps {
  score: number;
}

/**
 * The "living notebook": every completed 50-point block stays visible and
 * the strip grows as the game progresses. Placeholder lays out static
 * DominoX blocks; Vertical A adds progressive stroke-reveal animation,
 * complete-block pulse, and horizontal scroll/virtualization for long strips.
 */
export function DominoScoreStrip({ score }: DominoScoreStripProps) {
  const blocks = completedBlocks(score);
  const currentStrokes = strokesInCurrentBlock(score);
  const hasPartialBlock = score % BLOCK_VALUE !== 0 || score === 0;

  return (
    <View style={styles.row}>
      {Array.from({ length: blocks }).map((_, i) => (
        <DominoX key={i} strokes={STROKES_PER_BLOCK} />
      ))}
      {hasPartialBlock && <DominoX key="current" strokes={currentStrokes} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});
