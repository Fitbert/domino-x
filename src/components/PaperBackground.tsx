import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../theme/tokens';

export interface PaperBackgroundProps {
  children: ReactNode;
}

/** Full-screen paper backdrop. Placeholder flat color; Vertical B adds subtle paper texture. */
export function PaperBackground({ children }: PaperBackgroundProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.notebookWhite,
  },
});
