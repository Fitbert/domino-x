import { Stack } from 'expo-router';

/**
 * One-decision-per-screen setup flow: game mode -> players -> names -> winning score -> start.
 * Vertical B fleshes out the progress indicator and horizontal slide transitions.
 */
export default function SetupLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
  );
}
