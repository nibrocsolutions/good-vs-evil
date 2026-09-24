import type { Level } from "../types";

const STORAGE_KEY = "good-vs-evil.progress.v1";

export interface Progress {
  completedLevelIds: string[];
}

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function emptyProgress(): Progress {
  return { completedLevelIds: [] };
}

export function loadProgress(storage: KeyValueStore): Progress {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyProgress();
    const ids = (parsed as { completedLevelIds?: unknown }).completedLevelIds;
    if (!Array.isArray(ids)) return emptyProgress();
    const completedLevelIds = [
      ...new Set(ids.filter((id): id is string => typeof id === "string" && id.length > 0)),
    ];
    return { completedLevelIds };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: Progress, storage: KeyValueStore): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function completeLevel(progress: Progress, levelId: string): Progress {
  if (progress.completedLevelIds.includes(levelId)) return progress;
  return { completedLevelIds: [...progress.completedLevelIds, levelId] };
}

export function isLevelUnlocked(level: Level, levels: Level[], progress: Progress): boolean {
  if (level.order <= 1) return true;
  const previous = levels.find((item) => item.order === level.order - 1);
  if (!previous) return false;
  return progress.completedLevelIds.includes(previous.id);
}

export function canPlayLevel(level: Level, levels: Level[], progress: Progress): boolean {
  return (
    progress.completedLevelIds.includes(level.id) ||
    isLevelUnlocked(level, levels, progress)
  );
}
