import type {
  SchoolProgress,
  AptitudeResult,
  MarketScannerResult,
  EdgeMakerResult,
  SimulationResult,
  PeriodId,
} from '../types/school';
import { SCHOOL_CURRICULUM, PRO_DURATION_DAYS } from '../types/school';

// ─── 스토리지 키 ───

const STORAGE_KEY_PREFIX = 'kiosk7_school_';

function getStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

// ─── 기본값 ───

function createDefaultProgress(): SchoolProgress {
  return {
    stamps: SCHOOL_CURRICULUM.map((p) => ({
      periodId: p.id,
      completed: false,
    })),
    graduation: {
      isGraduated: false,
    },
    enrolledAt: new Date().toISOString(),
  };
}

// ─── CRUD ───

/** 학교 진행도 로드 (없으면 기본값 생성) */
export function loadSchoolProgress(userId: string): SchoolProgress {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      return JSON.parse(raw) as SchoolProgress;
    }
  } catch {
    // 파싱 실패 시 기본값 반환
  }
  const defaultProgress = createDefaultProgress();
  saveSchoolProgress(userId, defaultProgress);
  return defaultProgress;
}

/** 학교 진행도 저장 */
export function saveSchoolProgress(userId: string, progress: SchoolProgress): void {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(progress));
}

// ─── 스탬프 관련 ───

/** 특정 교시 스탬프 획득 */
export function earnStamp(userId: string, periodId: PeriodId): SchoolProgress {
  const progress = loadSchoolProgress(userId);
  const stamp = progress.stamps.find((s) => s.periodId === periodId);
  if (stamp && !stamp.completed) {
    stamp.completed = true;
    stamp.completedAt = new Date().toISOString();
    saveSchoolProgress(userId, progress);
  }
  return progress;
}

/** 획득한 스탬프 수 */
export function getCompletedStampCount(userId: string): number {
  const progress = loadSchoolProgress(userId);
  return progress.stamps.filter((s) => s.completed).length;
}

/** 모든 스탬프 획득 여부 */
export function hasAllStamps(userId: string): boolean {
  const progress = loadSchoolProgress(userId);
  return progress.stamps.every((s) => s.completed);
}

/** 특정 스탬프 획득 여부 */
export function hasStamp(userId: string, periodId: PeriodId): boolean {
  const progress = loadSchoolProgress(userId);
  const stamp = progress.stamps.find((s) => s.periodId === periodId);
  return stamp?.completed ?? false;
}

// ─── 졸업 관련 ───

/** 졸업 가능 여부 (모든 스탬프 + 시뮬레이션 완료) */
export function canGraduate(userId: string): boolean {
  const progress = loadSchoolProgress(userId);
  const allStamps = progress.stamps.every((s) => s.completed);
  const simDone = !!progress.simulationResult;
  return allStamps && simDone && !progress.graduation.isGraduated;
}

/** 졸업 처리 */
export function graduate(userId: string, review: string): SchoolProgress {
  const progress = loadSchoolProgress(userId);
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + PRO_DURATION_DAYS);

  progress.graduation = {
    isGraduated: true,
    graduatedAt: now.toISOString(),
    review,
    proExpiresAt: expiresAt.toISOString(),
  };

  saveSchoolProgress(userId, progress);
  return progress;
}

/** 졸업 여부 */
export function isGraduated(userId: string): boolean {
  const progress = loadSchoolProgress(userId);
  return progress.graduation.isGraduated;
}

/** Pro 도구 사용 가능 여부 (졸업 + 기간 유효) */
export function isProAccessValid(userId: string): boolean {
  const progress = loadSchoolProgress(userId);
  if (!progress.graduation.isGraduated || !progress.graduation.proExpiresAt) {
    return false;
  }
  return new Date() < new Date(progress.graduation.proExpiresAt);
}

/** Pro 남은 일수 */
export function getProRemainingDays(userId: string): number {
  const progress = loadSchoolProgress(userId);
  if (!progress.graduation.proExpiresAt) return 0;
  const diff = new Date(progress.graduation.proExpiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ─── 적성검사 ───

/** 적성검사 결과 저장 */
export function saveAptitudeResult(userId: string, result: AptitudeResult): void {
  const progress = loadSchoolProgress(userId);
  progress.aptitudeResult = result;
  saveSchoolProgress(userId, progress);
}

/** 적성검사 완료 여부 */
export function hasAptitudeResult(userId: string): boolean {
  const progress = loadSchoolProgress(userId);
  return !!progress.aptitudeResult;
}

/** 적성검사 결과 조회 */
export function getAptitudeResult(userId: string): AptitudeResult | undefined {
  const progress = loadSchoolProgress(userId);
  return progress.aptitudeResult;
}

// ─── Market Compass ───

/** Market Scanner 결과 저장 */
export function saveMarketScannerResult(userId: string, result: MarketScannerResult): void {
  const progress = loadSchoolProgress(userId);
  if (!progress.marketCompassData) progress.marketCompassData = {};
  progress.marketCompassData.marketScannerResult = result;
  saveSchoolProgress(userId, progress);
}

/** Market Scanner 결과 조회 */
export function getMarketScannerResult(userId: string): MarketScannerResult | undefined {
  const progress = loadSchoolProgress(userId);
  return progress.marketCompassData?.marketScannerResult;
}

/** Edge Maker 결과 저장 */
export function saveEdgeMakerResult(userId: string, result: EdgeMakerResult): void {
  const progress = loadSchoolProgress(userId);
  if (!progress.marketCompassData) progress.marketCompassData = {};
  progress.marketCompassData.edgeMakerResult = result;
  saveSchoolProgress(userId, progress);
}

/** Edge Maker 결과 조회 */
export function getEdgeMakerResult(userId: string): EdgeMakerResult | undefined {
  const progress = loadSchoolProgress(userId);
  return progress.marketCompassData?.edgeMakerResult;
}

// ─── 시뮬레이션 (졸업과제) ───

/** 시뮬레이션 결과 저장 */
export function saveSimulationResult(userId: string, result: SimulationResult): void {
  const progress = loadSchoolProgress(userId);
  progress.simulationResult = result;
  saveSchoolProgress(userId, progress);
}

/** 시뮬레이션 완료 여부 */
export function hasSimulationResult(userId: string): boolean {
  const progress = loadSchoolProgress(userId);
  return !!progress.simulationResult;
}

// ─── 관리자용: 전체 학생 데이터 조회 ───

/** 모든 학교 데이터 키 조회 */
export function getAllSchoolProgressKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_KEY_PREFIX)) {
      keys.push(key.replace(STORAGE_KEY_PREFIX, ''));
    }
  }
  return keys;
}

/** 특정 사용자의 졸업 리뷰 가져오기 */
export function getGraduationReview(userId: string): string | undefined {
  const progress = loadSchoolProgress(userId);
  return progress.graduation.review;
}

/** 관리자: Pro 기간 연장 */
export function extendProAccess(userId: string, additionalDays: number): void {
  const progress = loadSchoolProgress(userId);
  if (!progress.graduation.isGraduated) return;

  const currentExpiry = progress.graduation.proExpiresAt
    ? new Date(progress.graduation.proExpiresAt)
    : new Date();

  // 만료 후라면 오늘부터, 아니면 기존 만료일부터 연장
  const base = currentExpiry < new Date() ? new Date() : currentExpiry;
  base.setDate(base.getDate() + additionalDays);
  progress.graduation.proExpiresAt = base.toISOString();

  saveSchoolProgress(userId, progress);
}
