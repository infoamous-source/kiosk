/**
 * 깍두기 마스코트 — 심플 아이콘 버전
 * 로고, 네비게이션, 뱃지 등 작은 사이즈용
 */

interface KkakdugiMascotProps {
  size?: number;
  className?: string;
}

export default function KkakdugiMascot({ size = 40, className = '' }: KkakdugiMascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      {/* 몸통 */}
      <rect x="10" y="18" width="44" height="38" rx="6" ry="6"
        fill="#fef3dc" stroke="#d4a060" strokeWidth="2.5" />

      {/* 양념 레이어 */}
      <path d="M10 28 Q10 18 16 18 L48 18 Q54 18 54 28
               L53 32 Q48 36 43 33 Q37 29 32 34
               Q27 38 22 33 Q17 29 12 33 Z"
        fill="#c43025" stroke="#9a2520" strokeWidth="2.5" strokeLinejoin="round" />

      {/* 분홍 중간층 */}
      <path d="M10 32 Q10 30 13 29 L51 29 Q54 30 54 32
               L53 35 Q48 38 43 36 Q37 33 32 36
               Q27 39 22 36 Q17 33 12 36 Z"
        fill="#f0a090" stroke="none" />

      {/* 교복 하단 */}
      <path d="M10 46 L10 50 Q10 56 16 56 L48 56 Q54 56 54 50 L54 46 Z"
        fill="#2c3e6b" stroke="#1a2440" strokeWidth="2.5" />

      {/* 넥타이 */}
      <path d="M30 46 L32 48 L34 46 L33 54 Q32 55 31 54 Z"
        fill="#c43025" stroke="#9a2520" strokeWidth="1" strokeLinejoin="round" />

      {/* 눈 */}
      <circle cx="24" cy="37" r="3.5" fill="#fff" stroke="#4a3a2e" strokeWidth="1.5" />
      <circle cx="25" cy="37.5" r="2" fill="#1a1a1a" />
      <circle cx="23" cy="36" r="1" fill="#fff" opacity="0.9" />

      <circle cx="40" cy="37" r="3.5" fill="#fff" stroke="#4a3a2e" strokeWidth="1.5" />
      <circle cx="41" cy="37.5" r="2" fill="#1a1a1a" />
      <circle cx="39" cy="36" r="1" fill="#fff" opacity="0.9" />

      {/* 입 */}
      <path d="M29 42 Q32 45 35 42" fill="none" stroke="#4a3a2e" strokeWidth="1.5" strokeLinecap="round" />

      {/* 볼터치 */}
      <circle cx="20" cy="40" r="3.5" fill="#f4a08a" opacity="0.5" />
      <circle cx="44" cy="40" r="3.5" fill="#f4a08a" opacity="0.5" />

      {/* 졸업모 */}
      <polygon points="32,6 48,13 32,17 16,13" fill="#3a3a3a" stroke="#2a2a2a" strokeWidth="1" />
      <rect x="26" y="14" width="12" height="6" rx="1" fill="#3a3a3a" stroke="#2a2a2a" strokeWidth="1" />
      <circle cx="32" cy="9" r="1.5" fill="#4a4a4a" />
      <path d="M32 9 Q37 8 39 13 Q40 15 39 17" fill="none" stroke="#4a4a4a" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="39" cy="18" r="1.2" fill="#4a4a4a" />
    </svg>
  );
}
