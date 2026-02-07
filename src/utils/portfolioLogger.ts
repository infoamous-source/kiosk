import type { PortfolioEntry } from '../types/marketing';

const STORAGE_KEY = 'kiosk-portfolio';
const MAX_ENTRIES = 500;

/**
 * 포트폴리오 활동 기록
 * 모든 툴 사용 내역 + AI 성과물을 저장
 * 향후 DB 마이그레이션 대비 구조화
 */
export function logPortfolioActivity(
  toolId: string,
  moduleId: string,
  toolName: string,
  input: Record<string, unknown>,
  output: Record<string, unknown>,
  isMockData: boolean = false
): PortfolioEntry {
  const entry: PortfolioEntry = {
    id: generateId(),
    userId: getCurrentUserId(),
    toolId,
    moduleId,
    toolName,
    input,
    output,
    timestamp: new Date().toISOString(),
    isMockData,
  };

  saveEntry(entry);
  return entry;
}

/**
 * 특정 사용자의 포트폴리오 조회
 */
export function getPortfolioByUser(userId?: string): PortfolioEntry[] {
  const entries = getAllEntries();
  if (!userId) return entries;
  return entries.filter((e) => e.userId === userId);
}

/**
 * 특정 툴의 사용 이력 조회
 */
export function getPortfolioByTool(toolId: string): PortfolioEntry[] {
  return getAllEntries().filter((e) => e.toolId === toolId);
}

/**
 * 특정 모듈의 활동 이력 조회
 */
export function getPortfolioByModule(moduleId: string): PortfolioEntry[] {
  return getAllEntries().filter((e) => e.moduleId === moduleId);
}

/**
 * 포트폴리오 통계
 */
export function getPortfolioStats(): {
  totalEntries: number;
  toolUsage: Record<string, number>;
  aiGenerations: number;
  lastActivity: string | null;
} {
  const entries = getAllEntries();
  const toolUsage: Record<string, number> = {};

  entries.forEach((e) => {
    toolUsage[e.toolId] = (toolUsage[e.toolId] || 0) + 1;
  });

  return {
    totalEntries: entries.length,
    toolUsage,
    aiGenerations: entries.filter((e) => !e.isMockData && (e.toolId === 'k-copywriter' || e.toolId === 'sns-ad-maker')).length,
    lastActivity: entries.length > 0 ? entries[entries.length - 1].timestamp : null,
  };
}

// ─── Internal ───

function getAllEntries(): PortfolioEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveEntry(entry: PortfolioEntry): void {
  try {
    const entries = getAllEntries();
    entries.push(entry);

    // 최대 개수 제한
    if (entries.length > MAX_ENTRIES) {
      entries.splice(0, entries.length - MAX_ENTRIES);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore storage errors
  }
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

function generateId(): string {
  return `pf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}
