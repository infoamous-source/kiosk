import { useState, useCallback, useEffect } from 'react';

interface ToolHistoryEntry {
  toolId: string;
  timestamp: string;
  action: string;
}

const STORAGE_KEY = 'kiosk-tool-history';
const MAX_ENTRIES = 200;

/**
 * 툴 사용 이력 추적 훅
 */
export function useToolHistory() {
  const [history, setHistory] = useState<ToolHistoryEntry[]>(() => loadHistory());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const addEntry = useCallback((toolId: string, action: string) => {
    setHistory((prev) => {
      const newEntry: ToolHistoryEntry = {
        toolId,
        timestamp: new Date().toISOString(),
        action,
      };
      const updated = [...prev, newEntry];
      if (updated.length > MAX_ENTRIES) {
        return updated.slice(-MAX_ENTRIES);
      }
      return updated;
    });
  }, []);

  const getToolUsageCount = useCallback((toolId: string): number => {
    return history.filter((h) => h.toolId === toolId).length;
  }, [history]);

  const getRecentHistory = useCallback((limit: number = 10): ToolHistoryEntry[] => {
    return history.slice(-limit).reverse();
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    history,
    addEntry,
    getToolUsageCount,
    getRecentHistory,
    clearHistory,
  };
}

function loadHistory(): ToolHistoryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
