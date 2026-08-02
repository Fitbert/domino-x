import { View } from 'react-native';

export interface AnimatedStrokeProps {
  /** 0-1 reveal progress, animated by the parent (DominoX). */
  progress: number;
  color?: string;
}

/**
 * Low-level pencil-stroke primitive. Placeholder no-op view; Vertical A
 * replaces with a Skia Path progressive-reveal (graphite-on-paper look,
 * tiny random imperfections) driven by `progress`.
 */
export function AnimatedStroke(_props: AnimatedStrokeProps) {
  return <View />;
}
