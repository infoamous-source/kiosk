export type UserRole = 'student' | 'instructor';

// ─── 구독 관련 타입 ───

export type SubscriptionType = 'individual' | 'organization' | 'none';
export type SubscriptionStatus = 'active' | 'expired' | 'none';

export interface SubscriptionInfo {
  type: SubscriptionType;
  status: SubscriptionStatus;
  startDate?: string;
  endDate?: string;
  orgCodeHistory?: string[]; // 이전 기관코드 기록
}

// ─── 사용자 타입 ───

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;       // 기관명 (텍스트)
  instructorCode: string;     // 강사코드 (어떤 강사가 관리)
  orgCode: string;            // 기관코드 (어떤 기관 소속)
  learningPurpose: string;
  createdAt: string;
  // 프로필 추가 정보
  age?: number;
  gender?: 'male' | 'female' | 'other';
  country?: string;
  // 구독 정보
  subscription: SubscriptionInfo;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
