import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'domino-x-storage' });

export function loadJSON<T>(key: string): T | null {
  const raw = storage.getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

export function removeKey(key: string): void {
  storage.remove(key);
}

export const STORAGE_KEYS = {
  activeGame: 'domino-x/active-game',
  gameHistory: 'domino-x/game-history',
  settings: 'domino-x/settings',
} as const;
