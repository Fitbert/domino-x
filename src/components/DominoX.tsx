import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { BlurMask, Canvas, RoundedRect } from '@shopify/react-native-skia';

import { colors } from '../theme/tokens';
import { STROKES_PER_BLOCK } from '../domino/constants';
import { buildBlockStrokePaths } from '../domino/strokePaths';
import { MOTION } from '../animation/motion';
import { completeSuccess, scoreMedium } from '../utils/haptics';
import { AnimatedStroke } from './AnimatedStroke';

export interface DominoXProps {
  /** Number of pencil strokes drawn in this block, 0-10. 10 = fully complete. */
  strokes: number;
  size?: number;
}

const STROKES_PER_GROUP = STROKES_PER_BLOCK / 2; // 5 strokes = one tally "X" group = 25 points
const STROKE_EASING = Easing.out(Easing.quad);

/**
 * One 50-point domino scoring block (traditional tally pattern): two 5-stroke
 * groups that fill in one stroke at a time, like graphite moving across
 * paper, instead of appearing instantly. Strokes already present when this
 * instance first mounts render immediately (no replay) — only strokes newly
 * added via a later `strokes` prop change animate in.
 *
 * Every 5th stroke (one tally group / 25 points) gets a small confirm bounce
 * + `haptics.scoreMedium()`. The 10th stroke (the full 50-point block) gets
 * a glow pulse + `haptics.completeSuccess()` instead.
 */
export function DominoX({ strokes, size = 64 }: DominoXProps) {
  const clamped = Math.max(0, Math.min(STROKES_PER_BLOCK, Math.round(strokes)));
  const paths = useMemo(() => buildBlockStrokePaths(size), [size]);

  // One shared value per stroke slot (fixed count -> safe to call unconditionally).
  const strokeProgress = [
    useSharedValue(clamped > 0 ? 1 : 0),
    useSharedValue(clamped > 1 ? 1 : 0),
    useSharedValue(clamped > 2 ? 1 : 0),
    useSharedValue(clamped > 3 ? 1 : 0),
    useSharedValue(clamped > 4 ? 1 : 0),
    useSharedValue(clamped > 5 ? 1 : 0),
    useSharedValue(clamped > 6 ? 1 : 0),
    useSharedValue(clamped > 7 ? 1 : 0),
    useSharedValue(clamped > 8 ? 1 : 0),
    useSharedValue(clamped > 9 ? 1 : 0),
  ];

  const blockScale = useSharedValue(1);
  const blockGlow = useSharedValue(0);
  const prevRef = useRef(clamped);

  useEffect(() => {
    const prev = prevRef.current;
    const next = clamped;
    prevRef.current = next;
    if (next === prev) return;

    if (next < prev) {
      // Score decreased (e.g. undo) - snap back instantly, no reverse-erase animation.
      for (let i = next; i < prev; i++) strokeProgress[i].value = 0;
      return;
    }

    for (let i = prev; i < next; i++) {
      const strokeIndex = i;
      const stepDelay = (i - prev) * MOTION.strokeDurationMs;
      strokeProgress[strokeIndex].value = withDelay(
        stepDelay,
        withTiming(1, { duration: MOTION.strokeDurationMs, easing: STROKE_EASING }, (finished) => {
          if (!finished) return;
          const completedCount = strokeIndex + 1;

          if (completedCount === STROKES_PER_BLOCK) {
            blockScale.value = withSequence(
              withTiming(MOTION.blockCompletePulse.scale, { duration: 140 }),
              withTiming(1, { duration: MOTION.blockCompletePulse.durationMs })
            );
            blockGlow.value = withSequence(
              withTiming(1, { duration: MOTION.blockGlowPulse.fadeInMs }),
              withTiming(0, { duration: MOTION.blockGlowPulse.fadeOutMs })
            );
            runOnJS(completeSuccess)();
          } else if (completedCount % STROKES_PER_GROUP === 0) {
            blockScale.value = withSequence(
              withTiming(MOTION.groupCompletePulse.scale, { duration: 90 }),
              withTiming(1, { duration: MOTION.groupCompletePulse.durationMs - 90 })
            );
            runOnJS(scoreMedium)();
          }
        })
      );
    }
    // strokeProgress/blockScale/blockGlow are stable shared-value refs; only `clamped` should retrigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clamped]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: blockScale.value }],
  }));

  const strokeWidth = Math.max(2, size * 0.045);

  return (
    <Animated.View style={[{ width: size, height: size }, containerStyle]}>
      <Canvas style={StyleSheet.absoluteFill}>
        <RoundedRect x={0} y={0} width={size} height={size} r={size * 0.14} color={colors.accentBlue} opacity={blockGlow}>
          <BlurMask blur={size * 0.18} style="normal" />
        </RoundedRect>
        {paths.map((d, i) => (
          <AnimatedStroke key={i} d={d} progress={strokeProgress[i]} strokeWidth={strokeWidth} />
        ))}
      </Canvas>
    </Animated.View>
  );
}
