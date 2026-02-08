// ─── 마케팅 학교 타입 정의 ───

/** 6교시 커리큘럼 교시 ID */
export type PeriodId = 'aptitude-test' | 'market-scanner' | 'edge-maker' | 'viral-card-maker' | 'perfect-planner' | 'roas-simulator';

/** 교시 정보 */
export interface SchoolPeriod {
  id: PeriodId;
  period: number;           // 1~6
  nameKey: string;           // i18n 키
  descriptionKey: string;    // i18n 키
  icon: string;              // lucide 아이콘 이름
  color: string;             // tailwind 색상
  toolRoute: string;         // 도구 라우트
}

/** 스탬프 진행도 */
export interface StampProgress {
  periodId: PeriodId;
  completed: boolean;
  completedAt?: string;      // ISO date string
}

/** 졸업 상태 */
export interface GraduationStatus {
  isGraduated: boolean;
  graduatedAt?: string;      // ISO date string
  review?: string;           // "선생님께 한마디"
  proExpiresAt?: string;     // Pro 도구 만료일 (졸업 후 180일)
}

/** 적성검사 결과 (추후 구체화) */
export interface AptitudeResult {
  completedAt: string;
  answers: Record<string, string>;
  resultType?: string;
}

/** 시뮬레이션 (졸업과제) 결과 */
export interface SimulationResult {
  completedAt: string;
  roas?: number;
  budget?: number;
  revenue?: number;
}

/** 학생의 학교 전체 진행도 (localStorage에 저장) */
export interface SchoolProgress {
  stamps: StampProgress[];
  graduation: GraduationStatus;
  aptitudeResult?: AptitudeResult;
  simulationResult?: SimulationResult;
  enrolledAt: string;        // 입학일
}

// ─── 커리큘럼 상수 ───

export const SCHOOL_CURRICULUM: SchoolPeriod[] = [
  {
    id: 'aptitude-test',
    period: 1,
    nameKey: 'school.periods.aptitudeTest.name',
    descriptionKey: 'school.periods.aptitudeTest.description',
    icon: 'ClipboardCheck',
    color: 'rose',
    toolRoute: '/marketing/school/tools/aptitude-test',
  },
  {
    id: 'market-scanner',
    period: 2,
    nameKey: 'school.periods.marketScanner.name',
    descriptionKey: 'school.periods.marketScanner.description',
    icon: 'Radar',
    color: 'blue',
    toolRoute: '/marketing/school/tools/market-scanner',
  },
  {
    id: 'edge-maker',
    period: 3,
    nameKey: 'school.periods.edgeMaker.name',
    descriptionKey: 'school.periods.edgeMaker.description',
    icon: 'Zap',
    color: 'amber',
    toolRoute: '/marketing/school/tools/edge-maker',
  },
  {
    id: 'viral-card-maker',
    period: 4,
    nameKey: 'school.periods.viralCardMaker.name',
    descriptionKey: 'school.periods.viralCardMaker.description',
    icon: 'Share2',
    color: 'purple',
    toolRoute: '/marketing/school/tools/viral-card-maker',
  },
  {
    id: 'perfect-planner',
    period: 5,
    nameKey: 'school.periods.perfectPlanner.name',
    descriptionKey: 'school.periods.perfectPlanner.description',
    icon: 'CalendarCheck',
    color: 'emerald',
    toolRoute: '/marketing/school/tools/perfect-planner',
  },
  {
    id: 'roas-simulator',
    period: 6,
    nameKey: 'school.periods.roasSimulator.name',
    descriptionKey: 'school.periods.roasSimulator.description',
    icon: 'TrendingUp',
    color: 'orange',
    toolRoute: '/marketing/school/tools/roas-simulator',
  },
];

/** Pro 도구 사용 가능 기간 (일) */
export const PRO_DURATION_DAYS = 180;

/** 총 교시 수 */
export const TOTAL_PERIODS = SCHOOL_CURRICULUM.length;
