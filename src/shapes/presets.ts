import type { IconProject } from "./types";

export type PresetConfig = Omit<IconProject, "sourceImage">;

export interface SavedPreset {
  id: string;
  name: string;
  config: PresetConfig;
  savedAt: number;
}

const STORAGE_KEY = "rniconhub-presets";

export function loadPresets(): SavedPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedPreset[]) : [];
  } catch {
    return [];
  }
}

export function savePreset(name: string, config: PresetConfig): SavedPreset[] {
  const presets = loadPresets().filter((p) => p.name !== name);
  presets.unshift({ id: `${Date.now()}`, name, config, savedAt: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  return presets;
}

export function deletePreset(id: string): SavedPreset[] {
  const presets = loadPresets().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  return presets;
}
