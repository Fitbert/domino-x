import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { colors, spacing, typography } from '../src/theme/tokens';

/**
 * Placeholder home screen wired to real navigation. Vertical B owns the
 * premium visual pass (logo animation, spring-in buttons, PaperBackground).
 */
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DOMINO X</Text>
      <Text style={styles.subtitle}>The Scorepad You&apos;ll Never Lose</Text>

      <View style={styles.actions}>
        <HomeButton href="/setup/game-mode" label="New Game" primary />
        <HomeButton href="/game" label="Resume Game" />
        <HomeButton href="/statistics" label="Statistics" />
        <HomeButton href="/settings" label="Settings" />
      </View>
    </View>
  );
}

function HomeButton({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
  return (
    <Link href={href} asChild>
      <Pressable style={[styles.button, primary && styles.buttonPrimary]}>
        <Text style={[styles.buttonLabel, primary && styles.buttonLabelPrimary]}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.notebookWhite,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold as any,
    color: colors.dominoBlack,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.pencilGray,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  actions: {
    width: '100%',
    gap: spacing.sm,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.paperShadow,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.accentBlue,
  },
  buttonLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.dominoBlack,
  },
  buttonLabelPrimary: {
    color: colors.notebookWhite,
  },
});
