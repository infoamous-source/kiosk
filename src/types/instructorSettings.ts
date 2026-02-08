import type { TrackId } from './track';

// ─── 강사 ON/OFF 설정 타입 ───

/** 단일 항목의 ON/OFF 상태 */
export interface VisibilityItem {
  visible: boolean;
}

/** 트랙별 설정 (모듈 + 툴) */
export interface TrackVisibility {
  visible: boolean;
  modules: Record<string, VisibilityItem>;
  tools: Record<string, VisibilityItem>;
}

/** 강사가 저장하는 전체 설정 */
export interface InstructorSettings {
  refCode: string;
  updatedAt: string;
  tracks: Record<TrackId, TrackVisibility>;
}

/** localStorage 키 생성 */
export function getSettingsKey(refCode: string): string {
  return `kiosk-instructor-settings-${refCode}`;
}

/** 기본 설정 생성 (전부 ON) */
export function createDefaultSettings(refCode: string): InstructorSettings {
  return {
    refCode,
    updatedAt: new Date().toISOString(),
    tracks: {
      'digital-basics': {
        visible: true,
        modules: {},
        tools: {},
      },
      marketing: {
        visible: true,
        modules: {},
        tools: {},
      },
      career: {
        visible: true,
        modules: {},
        tools: {},
      },
    },
  };
}
