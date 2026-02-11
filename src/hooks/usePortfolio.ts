import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  createPortfolioEntry,
  getPortfolioEntries,
  getPortfolioStats,
  type PortfolioEntryRow,
} from '../services/portfolioService';

export function usePortfolio() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<PortfolioEntryRow[]>([]);
  const [stats, setStats] = useState<{
    totalEntries: number;
    toolUsage: Record<string, number>;
    aiGenerations: number;
    lastActivity: string | null;
  }>({ totalEntries: 0, toolUsage: {}, aiGenerations: 0, lastActivity: null });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setEntries([]);
      setStats({ totalEntries: 0, toolUsage: {}, aiGenerations: 0, lastActivity: null });
      return;
    }

    setIsLoading(true);
    Promise.all([getPortfolioEntries(user.id), getPortfolioStats(user.id)])
      .then(([entriesData, statsData]) => {
        setEntries(entriesData);
        setStats(statsData);
      })
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  const logActivity = useCallback(
    (
      toolId: string,
      moduleId: string,
      toolName: string,
      input: Record<string, unknown>,
      output: Record<string, unknown>,
      isMockData: boolean = false,
    ) => {
      if (!user?.id) return;

      const id = `pf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      // Fire-and-forget
      createPortfolioEntry({
        id,
        userId: user.id,
        toolId,
        moduleId,
        toolName,
        input,
        output,
        isMockData,
      });
    },
    [user?.id],
  );

  return { logActivity, entries, stats, isLoading };
}
