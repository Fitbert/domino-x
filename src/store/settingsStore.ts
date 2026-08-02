import { create } from 'zustand';
import { loadJSON, saveJSON, STORAGE_KEYS } from '../storage/mmkv';

interface Settings {
  hapticsEnabled: boolean;
  audioEnabled: boolean;
}

interface SettingsStore extends Settings {
  setHapticsEnabled: (enabled: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  hydrate: () => void;
}

const DEFAULT_SETTINGS: Settings = { hapticsEnabled: true, audioEnabled: true };

function persist(settings: Settings) {
  saveJSON(STORAGE_KEYS.settings, settings);
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULT_SETTINGS,

  hydrate: () => {
    const stored = loadJSON<Settings>(STORAGE_KEYS.settings);
    if (stored) set(stored);
  },

  setHapticsEnabled: (hapticsEnabled) => {
    set({ hapticsEnabled });
    persist({ hapticsEnabled, audioEnabled: get().audioEnabled });
  },

  setAudioEnabled: (audioEnabled) => {
    set({ audioEnabled });
    persist({ hapticsEnabled: get().hapticsEnabled, audioEnabled });
  },
}));
