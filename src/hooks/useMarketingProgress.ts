import { useState, useCallback, useEffect } from 'react';
import type { ModuleProgress } from '../types/marketing';

const STORAGE_KEY = 'kiosk-marketing-progress';

/**
 * 마케팅 모듈 진행 상태 관리 훅
 */
export function useMarketingProgress() {
  const [progress, setProgress] = useState<Record<string, ModuleProgress>>(() => loadProgress());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  const markViewed = useCallback((moduleId: string) => {
    setProgress((prev) => ({
      ...prev,
      [moduleId]: {
        ...getDefault(moduleId, prev[moduleId]),
        viewedAt: prev[moduleId]?.viewedAt || new Date().toISOString(),
      },
    }));
  }, []);

  const markToolUsed = useCallback((moduleId: string) => {
    setProgress((prev) => ({
      ...prev,
      [moduleId]: {
        ...getDefault(moduleId, prev[moduleId]),
        toolUsedAt: new Date().toISOString(),
        toolOutputCount: (prev[moduleId]?.toolOutputCount || 0) + 1,
      },
    }));
  }, []);

  const markCompleted = useCallback((moduleId: string) => {
    setProgress((prev) => ({
      ...prev,
      [moduleId]: {
        ...getDefault(moduleId, prev[moduleId]),
        completedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const getModuleProgress = useCallback((moduleId: string): ModuleProgress => {
    return progress[moduleId] || { moduleId, toolOutputCount: 0 };
  }, [progress]);

  const getCompletionRate = useCallback((): number => {
    const moduleIds = ['mk-01', 'mk-02', 'mk-03', 'mk-04', 'mk-05', 'mk-06', 'mk-07'];
    const completed = moduleIds.filter((id) => progress[id]?.completedAt).length;
    return Math.round((completed / moduleIds.length) * 100);
  }, [progress]);

  return {
    progress,
    markViewed,
    markToolUsed,
    markCompleted,
    getModuleProgress,
    getCompletionRate,
  };
}

function loadProgress(): Record<string, ModuleProgress> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function getDefault(moduleId: string, existing?: ModuleProgress): ModuleProgress {
  return existing || { moduleId, toolOutputCount: 0 };
}
