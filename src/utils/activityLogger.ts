import type { ActivityLog, TrackId } from '../types/track';

/**
 * 사용자 활동 로깅 함수 - Future DB 연결 대비
 * 현재는 콘솔과 localStorage에 로깅, 추후 API 연동 예정
 */
export function handleActivityLog(
  action: ActivityLog['action'],
  trackId: TrackId,
  moduleId?: string,
  metadata?: Record<string, string>
): void {
  const log: ActivityLog = {
    userId: getCurrentUserId(),
    trackId,
    moduleId,
    action,
    timestamp: new Date().toISOString(),
    metadata,
  };

  // localStorage에 저장 (임시 저장소)
  saveLogToLocalStorage(log);

  // TODO: API 호출로 대체
  // await fetch('/api/logs', { method: 'POST', body: JSON.stringify(log) });
}

function getCurrentUserId(): string {
  try {
    const authData = localStorage.getItem('kiosk-auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.user?.id || 'anonymous';
    }
  } catch {
    // ignore parse errors
  }
  return 'anonymous';
}

function saveLogToLocalStorage(log: ActivityLog): void {
  try {
    const existing = localStorage.getItem('kiosk-activity-logs');
    const logs: ActivityLog[] = existing ? JSON.parse(existing) : [];
    logs.push(log);
    // 최근 1000개만 유지
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }
    localStorage.setItem('kiosk-activity-logs', JSON.stringify(logs));
  } catch {
    // ignore storage errors
  }
}

export function getActivityLogs(): ActivityLog[] {
  try {
    const logs = localStorage.getItem('kiosk-activity-logs');
    return logs ? JSON.parse(logs) : [];
  } catch {
    return [];
  }
}

export function getLogsByInstructorCode(_instructorCode: string): ActivityLog[] {
  // TODO: DB 연결 시 서버에서 _instructorCode로 필터링
  // 현재는 로컬에서 필터링 불가 (userId만 저장됨)
  return getActivityLogs();
}
