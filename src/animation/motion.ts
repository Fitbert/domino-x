export const MOTION = {
  cardTap: { scale: 0.98, durationMs: 120 },
  strokeDurationMs: 90,
  blockCompletePulse: { scale: 1.05, durationMs: 150 },
  winnerCardElevateMs: 400,

  // --- DominoX / DominoScoreStrip motion (Vertical A) ---

  /** Bounce when one 5-stroke tally group (25 points, "one X") completes. */
  groupCompletePulse: { scale: 1.05, durationMs: 160 },
  /** Glow fade-in/out timing when a full 50-point block completes. */
  blockGlowPulse: { fadeInMs: 160, fadeOutMs: 420 },
  /** How long a freshly-started block takes to slide in from the right. */
  newBlockSlideInMs: 260,

  /**
   * Running-score count-up. DominoScoreStrip/DominoX don't render the
   * numeric total themselves — PlayerCard (owned separately) reads these
   * values to animate its score digits counting up instead of snapping.
   */
  scoreCountUp: {
    /** Duration of a single +1 step while counting up. */
    stepMs: 45,
    /** Upper bound on total count-up time, no matter how large the delta. */
    maxDurationMs: 900,
  },
} as const;

/** Total duration (ms) to count up by `delta` points, capped at maxDurationMs. */
export function scoreCountUpDurationMs(delta: number): number {
  if (delta <= 0) return 0;
  return Math.min(MOTION.scoreCountUp.maxDurationMs, delta * MOTION.scoreCountUp.stepMs);
}
