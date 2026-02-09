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

export type PersonaId = 'CEO' | 'PM' | 'CPO' | 'CMO' | 'CSL';

export interface PersonaInfo {
  id: PersonaId;
  emoji: string;
  nameKey: string;
  titleKey: string;
  descriptionKey: string;
  color: string;
  strengths: string[];
}

export interface AptitudeResult {
  completedAt: string;
  answers: Record<string, string>;
  resultType: PersonaId;
  scores: Record<PersonaId, number>;
  questionSetId?: string;  // 'set1' | 'set2' | 'set3'
}

// ─── Market Compass 타입 ───

export interface MarketCompassData {
  marketScannerResult?: MarketScannerResult;
  edgeMakerResult?: EdgeMakerResult;
  viralCardResult?: ViralCardResult;
  perfectPlannerResult?: PerfectPlannerResult;
}

export interface MarketScannerResult {
  completedAt: string;
  input: { itemKeyword: string; targetAge: string; targetGender: string; itemType?: string };
  output: {
    relatedKeywords: string[];
    competitors: CompetitorInfo[];
    painPoints: string[];
    analysisReport?: string;
  };
}

export interface CompetitorInfo {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
}

export interface EdgeMakerResult {
  completedAt: string;
  input: { painPoints: string[]; myStrengths: string[]; competitors?: CompetitorInfo[] };
  output: {
    usp: string;
    brandNames: { name: string; type: 'emotional' | 'intuitive' | 'fun'; reasoning: string }[];
    slogan: string;
    brandMood: { primaryColor: string; secondaryColor: string; tone: string; keywords: string[] };
    brandingReport?: string;
  };
}

// ─── Viral Card Maker (4교시) 타입 ───

export type ViralTone = 'spicy' | 'emotional' | 'informative';
export type ImageStyle = 'illustration' | 'realistic' | 'minimal' | 'popart';

export interface ViralCardSlide {
  step: 'hook' | 'empathy' | 'solution' | 'action';
  stepLabel: string;
  copyText: string;
  imagePrompt: string;
  imageBase64?: string;
  colorScheme: { primary: string; secondary: string; gradient: string };
  designTip: string;
}

export interface ViralCardResult {
  completedAt: string;
  input: {
    productName: string;
    targetPersona: string;
    usp: string;
    tone: ViralTone;
    imageStyle: ImageStyle;
  };
  output: {
    slides: ViralCardSlide[];
    overallStrategy: string;
  };
}

// ─── Perfect Planner (5교시) 타입 ───

export type PlannerMode = 'landing' | 'liveCommerce';

export interface LandingPagePlan {
  headline: string;
  subheadline: string;
  problemSection: { title: string; painPoints: string[] };
  features: { title: string; description: string; benefit: string }[];
  trustSignals: { type: 'review' | 'certification' | 'stats'; content: string }[];
  closingCTA: { mainCopy: string; buttonText: string; urgency: string };
  checklist: string[];
}

export interface LiveCommerceScript {
  opening: { greeting: string; hook: string; todaysOffer: string };
  demoPoints: { timestamp: string; action: string; talkingPoint: string }[];
  qnaHandling: { commonQuestion: string; answer: string }[];
  closing: { finalOffer: string; urgencyTactic: string; farewell: string };
  checklist: string[];
}

export interface PerfectPlannerResult {
  completedAt: string;
  input: {
    productName: string;
    coreTarget: string;
    usp: string;
    strongOffer: string;
  };
  output: {
    landingPage: LandingPagePlan;
    liveCommerce: LiveCommerceScript;
    salesLogic: string;
  };
}

// ─── ROAS Simulator (6교시) 타입 ───

export interface ROASSimulationInput {
  productName: string;
  productPrice: number;
  adBudget: number;
  adChannel: 'instagram' | 'naver' | 'kakao' | 'youtube';
  targetAge: string;
  duration: 7 | 14 | 30;
}

export interface ROASSimulationOutput {
  estimatedImpressions: number;
  estimatedClicks: number;
  estimatedCTR: number;
  estimatedConversions: number;
  estimatedCVR: number;
  estimatedRevenue: number;
  estimatedROAS: number;
  costPerClick: number;
  costPerConversion: number;
  roasGrade: 'excellent' | 'good' | 'average' | 'poor';
  advice: string[];
  channelTip: string;
}

/** 시뮬레이션 (6교시 ROAS) 결과 */
export interface SimulationResult {
  completedAt: string;
  input?: ROASSimulationInput;
  output?: ROASSimulationOutput;
  roas?: number;
  budget?: number;
  revenue?: number;
}

/** 학생의 학교 전체 진행도 (localStorage에 저장) */
export interface SchoolProgress {
  stamps: StampProgress[];
  graduation: GraduationStatus;
  aptitudeResult?: AptitudeResult;
  marketCompassData?: MarketCompassData;
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
