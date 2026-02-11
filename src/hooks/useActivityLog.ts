import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  createActivityLog,
  getActivityLogs as fetchActivityLogs,
  type ActivityLogRow,
} from '../services/activityLogService';

export function useActivityLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ActivityLogRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setLogs([]);
      return;
    }

    setIsLoading(true);
    fetchActivityLogs(user.id)
      .then(setLogs)
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  const logActivity = useCallback(
    (
      action: string,
      trackId?: string,
      moduleId?: string,
      metadata?: Record<string, unknown>,
    ) => {
      if (!user?.id) return;

      // Fire-and-forget
      createActivityLog({
        userId: user.id,
        trackId,
        moduleId,
        action,
        metadata,
      });
    },
    [user?.id],
  );

  return { logActivity, logs, isLoading };
}
