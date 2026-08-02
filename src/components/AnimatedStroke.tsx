import { Path } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';

import { colors } from '../theme/tokens';

export interface AnimatedStrokeProps {
  /** SVG path data (`d`) for this single hand-drawn stroke. */
  d: string;
  /** 0-1 reveal progress, animated by the parent (DominoX). */
  progress: SharedValue<number>;
  color?: string;
  strokeWidth?: number;
}

/**
 * Low-level pencil-stroke primitive: a single tally mark progressively
 * revealed via Skia's Path `start`/`end` trim, driven directly by a
 * Reanimated shared value — graphite moving across paper, not a snap-in.
 */
export function AnimatedStroke({ d, progress, color = colors.pencilGray, strokeWidth = 3 }: AnimatedStrokeProps) {
  return (
    <Path
      path={d}
      style="stroke"
      strokeWidth={strokeWidth}
      strokeCap="round"
      strokeJoin="round"
      color={color}
      start={0}
      end={progress}
    />
  );
}
