import 'react-native-gesture-handler';
import '../global.css';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

import { colors } from '../src/theme/tokens';
import { useGameStore } from '../src/store/gameStore';
import { useSettingsStore } from '../src/store/settingsStore';
import { useSkiaWebReady } from '../src/hooks/useSkiaWebReady';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const hydrate = useGameStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const [fontsLoaded] = useFonts({});
  const skiaReady = useSkiaWebReady();

  useEffect(() => {
    hydrate();
    hydrateSettings();
  }, [hydrate, hydrateSettings]);

  useEffect(() => {
    if (fontsLoaded && skiaReady) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, skiaReady]);

  if (!skiaReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.notebookWhite },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
