import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/**
 * React Native Skia needs its CanvasKit WASM runtime loaded before any
 * <Canvas> mounts on web (native platforms have Skia compiled in already).
 * Without this, DominoX renders nothing and Skia throws on every frame.
 */
export function useSkiaWebReady(): boolean {
  const [ready, setReady] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    let cancelled = false;
    import('@shopify/react-native-skia/lib/module/web/LoadSkiaWeb').then(({ LoadSkiaWeb }) =>
      // Explicit locateFile so the wasm binary resolves correctly under a
      // sub-path deployment (e.g. GitHub Pages project sites), not just root.
      LoadSkiaWeb({ locateFile: (file: string) => new URL(file, document.baseURI).toString() }).then(() => {
        if (!cancelled) setReady(true);
      })
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
