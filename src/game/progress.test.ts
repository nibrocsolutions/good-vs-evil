import { describe, expect, it } from "vitest";
import { LEVELS } from "../data/levels";
import {
  canPlayLevel,
  completeLevel,
  emptyProgress,
  isLevelUnlocked,
  loadProgress,
  saveProgress,
  type KeyValueStore,
} from "./progress";

function memoryStore(): KeyValueStore & { raw: Map<string, string> } {
  const raw = new Map<string, string>();
  return {
    raw,
    getItem(key) {
      return raw.get(key) ?? null;
    },
    setItem(key, value) {
      raw.set(key, value);
    },
  };
}

describe("progress", () => {
  it("unlocks the next story only after the previous one is kept", () => {
    let progress = emptyProgress();
    expect(isLevelUnlocked(LEVELS[0], LEVELS, progress)).toBe(true);
    expect(canPlayLevel(LEVELS[1], LEVELS, progress)).toBe(false);
    progress = completeLevel(progress, LEVELS[0].id);
    expect(canPlayLevel(LEVELS[1], LEVELS, progress)).toBe(true);
    expect(canPlayLevel(LEVELS[2], LEVELS, progress)).toBe(false);
    progress = completeLevel(progress, LEVELS[0].id);
    expect(progress.completedLevelIds).toEqual([LEVELS[0].id]);
  });

  it("round-trips through storage and ignores corrupt data", () => {
    const store = memoryStore();
    saveProgress({ completedLevelIds: ["david-and-goliath", "david-and-goliath"] }, store);
    expect(loadProgress(store).completedLevelIds).toEqual(["david-and-goliath"]);
    store.setItem("good-vs-evil.progress.v1", "{");
    expect(loadProgress(store)).toEqual(emptyProgress());
    store.setItem("good-vs-evil.progress.v1", JSON.stringify({ completedLevelIds: [1, "esther-and-haman", ""] }));
    expect(loadProgress(store).completedLevelIds).toEqual(["esther-and-haman"]);
  });
});
