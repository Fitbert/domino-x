import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../theme/tokens';
import { tapLight } from '../utils/haptics';

export interface NotebookHeaderProps {
  title: string;
  /** Optional small caption shown under the title. */
  subtitle?: string;
  /** Renders a back chevron on the left when provided. */
  onBack?: () => void;
  /** Optional step indicator for multi-screen flows, e.g. { current: 2, total: 4 }. */
  step?: { current: number; total: number };
}

/**
 * Shared screen header, styled like the top of a notebook page: bold title,
 * an optional back affordance, an optional step-progress dial, and a thin
 * ruled line closing the block off from the page below.
 */
export function NotebookHeader({ title, subtitle, onBack, step }: NotebookHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable
            hitSlop={12}
            onPress={() => {
              tapLight();
              onBack();
            }}
            style={styles.backButton}
          >
            <Text style={styles.backGlyph}>‹</Text>
          </Pressable>
        ) : (
          <View style={styles.backSpacer} />
        )}

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        {step ? (
          <Text style={styles.stepLabel}>
            {step.current}/{step.total}
          </Text>
        ) : (
          <View style={styles.backSpacer} />
        )}
      </View>

      {step ? (
        <View style={styles.dots}>
          {Array.from({ length: step.total }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i < step.current ? styles.dotFilled : styles.dotEmpty]}
            />
          ))}
        </View>
      ) : null}

      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paperShadow,
  },
  backSpacer: {
    width: 36,
    height: 36,
  },
  backGlyph: {
    fontSize: 22,
    color: colors.dominoBlack,
    marginTop: -2,
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.dominoBlack,
    letterSpacing: 0.3,
  },
  subtitle: {
    marginTop: 2,
    fontSize: typography.sizes.sm,
    color: colors.pencilGray,
  },
  stepLabel: {
    width: 36,
    textAlign: 'right',
    fontSize: typography.sizes.xs,
    color: colors.pencilGray,
    fontFamily: typography.fontFamily.medium,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  dot: {
    height: 4,
    width: 20,
    borderRadius: radii.pill,
  },
  dotFilled: {
    backgroundColor: colors.accentBlue,
  },
  dotEmpty: {
    backgroundColor: colors.paperShadow,
  },
  rule: {
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: colors.paperShadow,
    marginTop: spacing.md,
  },
});
