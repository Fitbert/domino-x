import type { ReactNode } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '../theme/tokens';

export interface PaperBackgroundProps {
  children: ReactNode;
}

const HOLE_SPACING = 42;
const HOLE_X = 11;
const HOLE_R = 2.75;

/**
 * Full-screen paper backdrop: a soft warm gradient (like light falling on a
 * notebook page) plus a faint spiral-binder hole column down the left edge.
 * Both effects are intentionally subtle — this reads as "paper", not texture
 * wallpaper. Purely decorative and non-interactive.
 */
export function PaperBackground({ children }: PaperBackgroundProps) {
  const { height } = useWindowDimensions();
  const holeCount = Math.max(1, Math.ceil(height / HOLE_SPACING));

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="paperGlow" cx="50%" cy="0%" r="90%">
              <Stop offset="0" stopColor="#FFFDF7" stopOpacity={1} />
              <Stop offset="1" stopColor={colors.notebookWhite} stopOpacity={1} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width="100%" height="100%" fill="url(#paperGlow)" />
          {Array.from({ length: holeCount }).map((_, i) => (
            <Circle
              key={i}
              cx={HOLE_X}
              cy={HOLE_SPACING / 2 + i * HOLE_SPACING}
              r={HOLE_R}
              fill={colors.paperShadow}
              opacity={0.55}
            />
          ))}
        </Svg>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.notebookWhite,
  },
  content: {
    flex: 1,
  },
});
