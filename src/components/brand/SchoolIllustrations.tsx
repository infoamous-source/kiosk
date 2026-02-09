/**
 * 학교 관련 SVG 일러스트 모음
 * 학교 배경, 사물, 공부 관련 아이템들
 */

interface IllustProps {
  size?: number;
  className?: string;
}

// 연필 아이콘
export function PencilIcon({ size = 24, className = '' }: IllustProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" fill="#f7c88a" stroke="#d4a060" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M15 5l4 4" stroke="#d4a060" strokeWidth="1.5" />
      <path d="M2 22l1.5-5.5L17 3" stroke="none" />
      <path d="M7.5 20.5L2 22l1.5-5.5" fill="#f4a08a" />
    </svg>
  );
}

// 노트/공책 아이콘
export function NotebookIcon({ size = 24, className = '' }: IllustProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="2" width="16" height="20" rx="2" fill="#fef3dc" stroke="#d4a060" strokeWidth="1.5" />
      <line x1="8" y1="2" x2="8" y2="22" stroke="#e8816b" strokeWidth="1.5" />
      <line x1="10" y1="7" x2="18" y2="7" stroke="#d4a060" strokeWidth="1" opacity="0.4" />
      <line x1="10" y1="10" x2="18" y2="10" stroke="#d4a060" strokeWidth="1" opacity="0.4" />
      <line x1="10" y1="13" x2="16" y2="13" stroke="#d4a060" strokeWidth="1" opacity="0.4" />
      <circle cx="6" cy="6" r="1" fill="#e8816b" />
      <circle cx="6" cy="10" r="1" fill="#e8816b" />
      <circle cx="6" cy="14" r="1" fill="#e8816b" />
    </svg>
  );
}

// 칠판 아이콘
export function ChalkboardIcon({ size = 24, className = '' }: IllustProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="3" width="20" height="14" rx="1" fill="#2d5a3d" stroke="#1a3d2a" strokeWidth="1.5" />
      <rect x="4" y="5" width="16" height="10" rx="0.5" fill="#3a7a52" />
      <line x1="6" y1="8" x2="14" y2="8" stroke="#fef3dc" strokeWidth="1" opacity="0.8" />
      <line x1="6" y1="11" x2="11" y2="11" stroke="#fef3dc" strokeWidth="1" opacity="0.6" />
      <rect x="9" y="17" width="6" height="1.5" rx="0.5" fill="#d4a060" />
      <rect x="7" y="18.5" width="10" height="2" rx="0.5" fill="#b8903e" />
    </svg>
  );
}

// 책 아이콘
export function BookIcon({ size = 24, className = '' }: IllustProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="#fef3dc" stroke="#d4a060" strokeWidth="1.5" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" fill="#e8816b" stroke="#c43025" strokeWidth="1.5" />
      <path d="M8 6h8M8 10h6" stroke="#fef3dc" strokeWidth="1" opacity="0.7" strokeLinecap="round" />
    </svg>
  );
}

// 가방 아이콘
export function BackpackIcon({ size = 24, className = '' }: IllustProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1Z" fill="#2c3e6b" stroke="#1a2440" strokeWidth="1.2" />
      <rect x="5" y="6" width="14" height="16" rx="3" fill="#2c3e6b" stroke="#1a2440" strokeWidth="1.5" />
      <rect x="8" y="12" width="8" height="5" rx="1" fill="#fef3dc" stroke="#d4a060" strokeWidth="1" />
      <line x1="12" y1="12" x2="12" y2="17" stroke="#d4a060" strokeWidth="0.8" />
    </svg>
  );
}

// 별 아이콘 (보상/성취)
export function StarIcon({ size = 24, className = '' }: IllustProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"
        fill="#f7c88a" stroke="#d4a060" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// 졸업장 아이콘
export function DiplomaIcon({ size = 24, className = '' }: IllustProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="18" height="14" rx="1" fill="#fef3dc" stroke="#d4a060" strokeWidth="1.5" />
      <line x1="7" y1="8" x2="17" y2="8" stroke="#d4a060" strokeWidth="1" opacity="0.5" />
      <line x1="7" y1="11" x2="17" y2="11" stroke="#d4a060" strokeWidth="1" opacity="0.5" />
      <line x1="9" y1="14" x2="15" y2="14" stroke="#d4a060" strokeWidth="1" opacity="0.5" />
      <circle cx="18" cy="18" r="4" fill="#e8816b" stroke="#c43025" strokeWidth="1.5" />
      <path d="M16 18l1.5 1.5 3-3" stroke="#fef3dc" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 학교 종 아이콘
export function SchoolBellIcon({ size = 24, className = '' }: IllustProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2a1 1 0 0 1 1 1v1a6 6 0 0 1 5 5.91V14l2 3H4l2-3v-4.09A6 6 0 0 1 11 4V3a1 1 0 0 1 1-1Z"
        fill="#f7c88a" stroke="#d4a060" strokeWidth="1.5" />
      <path d="M9 17v1a3 3 0 0 0 6 0v-1" stroke="#d4a060" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 학과 아이콘: 디지털 (모니터+코드)
export function DigitalDeptIcon({ size = 48, className = '' }: IllustProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="6" y="6" width="36" height="26" rx="3" fill="#dbeafe" stroke="#3B82F6" strokeWidth="2.5" />
      <rect x="10" y="10" width="28" height="18" rx="1" fill="#eff6ff" />
      <line x1="14" y1="15" x2="24" y2="15" stroke="#3B82F6" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <line x1="14" y1="19" x2="20" y2="19" stroke="#60a5fa" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <line x1="14" y1="23" x2="28" y2="23" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <rect x="18" y="32" width="12" height="3" rx="1" fill="#3B82F6" />
      <rect x="14" y="35" width="20" height="2" rx="1" fill="#93c5fd" />
      <circle cx="34" cy="14" r="2" fill="#3B82F6" opacity="0.5" />
    </svg>
  );
}

// 학과 아이콘: 마케팅 (메가폰+그래프)
export function MarketingDeptIcon({ size = 48, className = '' }: IllustProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* 메가폰 */}
      <path d="M8 18L28 10V34L8 26V18Z" fill="#ede9fe" stroke="#8B5CF6" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="4" y="18" width="6" height="8" rx="2" fill="#8B5CF6" />
      <path d="M28 14L34 12V32L28 30" fill="#c4b5fd" stroke="#8B5CF6" strokeWidth="1.5" />
      {/* 그래프 */}
      <rect x="30" y="30" width="4" height="10" rx="1" fill="#8B5CF6" opacity="0.4" />
      <rect x="36" y="24" width="4" height="16" rx="1" fill="#8B5CF6" opacity="0.6" />
      <rect x="42" y="18" width="4" height="22" rx="1" fill="#8B5CF6" opacity="0.8" />
      <path d="M32 28L38 22L44 16" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="44" cy="16" r="2" fill="#8B5CF6" />
    </svg>
  );
}

// 학과 아이콘: 커리어 (넥타이+서류)
export function CareerDeptIcon({ size = 48, className = '' }: IllustProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* 서류 */}
      <rect x="10" y="6" width="28" height="36" rx="2" fill="#ecfdf5" stroke="#10B981" strokeWidth="2.5" />
      <line x1="16" y1="14" x2="32" y2="14" stroke="#10B981" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <line x1="16" y1="19" x2="28" y2="19" stroke="#10B981" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <line x1="16" y1="24" x2="30" y2="24" stroke="#10B981" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <line x1="16" y1="29" x2="26" y2="29" stroke="#10B981" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
      {/* 넥타이 */}
      <path d="M32 32L36 35L40 32L38 44Q36 46 34 44Z" fill="#10B981" stroke="#059669" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M30 28L36 35L42 28L40 26Q36 24 32 26Z" fill="#10B981" stroke="#059669" strokeWidth="1.5" strokeLinejoin="round" />
      {/* 체크 */}
      <circle cx="36" cy="14" r="5" fill="#10B981" opacity="0.2" />
      <path d="M33 14l2 2 4-4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 배경 패턴: 노트 줄 + 연필/별 (옅은 SVG 반복용)
export function SchoolPatternBg({ className = '' }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="schoolPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          {/* 노트 줄 */}
          <line x1="0" y1="30" x2="60" y2="30" stroke="#d4a060" strokeWidth="0.3" opacity="0.15" />
          <line x1="0" y1="60" x2="60" y2="60" stroke="#d4a060" strokeWidth="0.3" opacity="0.15" />
          {/* 작은 별 */}
          <path d="M50 10l1 2 2 0.3-1.5 1.5 0.4 2-1.9-1-1.9 1 0.4-2L46 12.3l2-0.3z"
            fill="#f7c88a" opacity="0.12" />
          {/* 작은 연필 */}
          <path d="M10 45l3-3 1 1-3 3z" fill="#f7c88a" opacity="0.1" />
          <path d="M14 42l1-1 0.5 0.5-1 1z" fill="#f4a08a" opacity="0.1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#schoolPattern)" />
    </svg>
  );
}
