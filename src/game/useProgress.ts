import { useCallback, useState } from "react";
import {
  completeLevel,
  emptyProgress,
  loadProgress,
  saveProgress,
  type Progress,
} from "./progress";

function browserStorage(): Storage {
  return window.localStorage;
}

export function useProgress(): {
  progress: Progress;
  markComplete: (levelId: string) => void;
  reset: () => void;
} {
  const [progress, setProgress] = useState<Progress>(() => loadProgress(browserStorage()));

  const markComplete = useCallback((levelId: string) => {
    setProgress((current) => {
      const next = completeLevel(current, levelId);
      saveProgress(next, browserStorage());
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const next = emptyProgress();
    saveProgress(next, browserStorage());
    setProgress(next);
  }, []);

  return { progress, markComplete, reset };
}
