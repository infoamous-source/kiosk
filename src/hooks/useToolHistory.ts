import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  createActivityLog,
  getActivityLogs,
  type ActivityLogRow,
} from '../services/activityLogService';

interface ToolHistoryEntry {
  toolId: string;
  timestamp: string;
  action: string;
}

export function useToolHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<ToolHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load tool-related activity logs from Supabase
  useEffect(() => {
    if (!user?.id) {
      setHistory([]);
      return;
    }

    setIsLoading(true);
    getActivityLogs(user.id, 200)
      .then((rows: ActivityLogRow[]) => {
        // Convert rows that have toolId metadata to ToolHistoryEntry format
        const entries: ToolHistoryEntry[] = rows
          .filter((r) => r.metadata && (r.metadata as Record<string, unknown>).toolId)
          .map((r) => ({
            toolId: (r.metadata as Record<string, string>).toolId,
            timestamp: r.created_at,
            action: r.action,
          }));
        setHistory(entries);
      })
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  const addEntry = useCallback(
    (toolId: string, action: string) => {
      if (!user?.id) return;

      // Fire-and-forget to Supabase
      createActivityLog({
        userId: user.id,
        action,
        metadata: { toolId },
      });

      // Optimistic local update
      setHistory((prev) => {
        const newEntry: ToolHistoryEntry = {
          toolId,
          timestamp: new Date().toISOString(),
          action,
        };
        const updated = [newEntry, ...prev];
        if (updated.length > 200) {
          return updated.slice(0, 200);
        }
        return updated;
      });
    },
    [user?.id],
  );

  const getToolUsageCount = useCallback(
    (toolId: string): number => {
      return history.filter((h) => h.toolId === toolId).length;
    },
    [history],
  );

  const getRecentHistory = useCallback(
    (limit: number = 10): ToolHistoryEntry[] => {
      return history.slice(0, limit);
    },
    [history],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    isLoading,
    addEntry,
    getToolUsageCount,
    getRecentHistory,
    clearHistory,
  };
}
