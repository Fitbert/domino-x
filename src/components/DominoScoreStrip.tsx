import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';

import { completedBlocks, strokesInCurrentBlock, STROKES_PER_BLOCK } from '../domino/constants';
import { spacing } from '../theme/tokens';
import { MOTION } from '../animation/motion';
import { DominoX } from './DominoX';

export interface DominoScoreStripProps {
  score: number;
  /** Tint for the block-complete glow pulse; defaults to the app accent blue. */
  glowColor?: string;
}

const BLOCK_SIZE = 64;

/**
 * The "living notebook": every completed 50-point block stays visible
 * left-to-right and never disappears; a fresh, empty block is always
 * present at the end of the strip, sliding in from the right the moment
 * the previous one completes, ready to keep filling.
 *
 * Purely a function of `score` - each DominoX slot keeps a stable key
 * across renders, so it animates its own stroke-by-stroke delta instead of
 * remounting when the strip grows.
 */
export function DominoScoreStrip({ score, glowColor }: DominoScoreStripProps) {
  const clampedScore = Math.max(0, score);
  const completed = completedBlocks(clampedScore);
  const currentStrokes = strokesInCurrentBlock(clampedScore);
  // Always keep one trailing slot for the block currently filling (may be
  // fully empty right after the previous block completes).
  const totalSlots = completed + 1;

  const scrollRef = useRef<ScrollView>(null);
  const slotsRef = useRef(totalSlots);

  useEffect(() => {
    if (totalSlots !== slotsRef.current) {
      slotsRef.current = totalSlots;
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    }
  }, [totalSlots]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {Array.from({ length: totalSlots }).map((_, i) => (
        <Animated.View key={i} entering={SlideInRight.duration(MOTION.newBlockSlideInMs)} style={styles.slot}>
          <DominoX
            strokes={i < completed ? STROKES_PER_BLOCK : currentStrokes}
            size={BLOCK_SIZE}
            glowColor={glowColor}
          />
        </Animated.View>
      ))}
      {/* Trailing spacer keeps the last block from hugging the scroll edge. */}
      <View style={{ width: spacing.xs }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  slot: {},
});
