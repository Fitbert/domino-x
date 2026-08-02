import * as Haptics from 'expo-haptics';

import { useSettingsStore } from '../store/settingsStore';

function isHapticsEnabled(): boolean {
  return useSettingsStore.getState().hapticsEnabled;
}

/** Fires a haptic trigger only when enabled, and never lets a rejected promise surface. */
function fire(trigger: () => Promise<void>): void {
  if (!isHapticsEnabled()) return;
  trigger().catch(() => {});
}

/** Light tap -- selecting a card, toggling a control, tapping a button. */
export function tapLight(): void {
  fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

/** Medium impact -- entering a score. */
export function scoreMedium(): void {
  fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

/** Success notification -- completing a domino block (a full "X"). */
export function completeSuccess(): void {
  fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

/** Heavy impact -- the winner is decided. */
export function winHeavy(): void {
  fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
}
