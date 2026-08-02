export const STROKE_VALUE = 5;
export const STROKES_PER_BLOCK = 10;
export const BLOCK_VALUE = STROKE_VALUE * STROKES_PER_BLOCK; // 50

export const SCORE_INCREMENTS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50] as const;

export const DEFAULT_WINNING_SCORE = 250;
export const WINNING_SCORE_OPTIONS = [100, 150, 200, 250, 300, 500] as const;

/** Number of strokes drawn (0-10) within the block a running total currently sits in. */
export function strokesInCurrentBlock(total: number): number {
  return Math.floor((total % BLOCK_VALUE) / STROKE_VALUE);
}

/** Number of fully completed 50-point blocks. */
export function completedBlocks(total: number): number {
  return Math.floor(total / BLOCK_VALUE);
}
