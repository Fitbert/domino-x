import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '../src/theme/tokens';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.notebookWhite, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold as any, color: colors.dominoBlack },
});
