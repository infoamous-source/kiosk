/**
 * 깍두기 캐릭터 — 교복 버전 (V4)
 * size: 'full' | 'half' | 'icon' | 'mini'
 * animated: true → 떠다니기 + 눈깜빡임 + 팔흔들기
 */

interface KkakdugiCharacterProps {
  size?: 'full' | 'half' | 'icon' | 'mini';
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  full: { w: 240, h: 290 },
  half: { w: 140, h: 170 },
  icon: { w: 48, h: 58 },
  mini: { w: 28, h: 34 },
};

export default function KkakdugiCharacter({
  size = 'full',
  animated = true,
  className = '',
}: KkakdugiCharacterProps) {
  const { w, h } = sizeMap[size];
  const isSmall = size === 'icon' || size === 'mini';

  return (
    <div className={`inline-flex items-center justify-center ${animated && !isSmall ? 'animate-[floatBounce_2.4s_ease-in-out_infinite]' : ''} ${className}`}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 360 440"
        fill="none"
        className={isSmall ? '' : 'drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)]'}
      >
        <defs>
          <linearGradient id="kkBodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef3dc" />
            <stop offset="100%" stopColor="#fce8c3" />
          </linearGradient>
          <linearGradient id="kkTopGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c43025" />
            <stop offset="50%" stopColor="#d44035" />
            <stop offset="100%" stopColor="#e05545" />
          </linearGradient>
          <linearGradient id="kkMidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0a090" />
            <stop offset="100%" stopColor="#f5c0aa" />
          </linearGradient>
          <radialGradient id="kkCheekGrad">
            <stop offset="0%" stopColor="#f4a08a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f4a08a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="kkBlazerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c3e6b" />
            <stop offset="100%" stopColor="#1e2d52" />
          </linearGradient>
        </defs>

        {/* 다리 */}
        <g className={animated && !isSmall ? 'animate-[stepLeft_2.4s_ease-in-out_infinite]' : ''} style={{ transformOrigin: '148px 348px' }}>
          <line x1="148" y1="348" x2="142" y2="372" stroke="#4a3a2e" strokeWidth="5" strokeLinecap="round" />
          <rect x="132" y="369" width="20" height="15" rx="6" ry="6" fill="#fff" stroke="#e0ddd8" strokeWidth="2.5" />
          <path d="M146 383 L146 392 Q146 400 138 400 L122 400 Q114 400 114 393 L114 390 Q114 385 120 385 L146 385" fill="#c43025" stroke="#9a2520" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M146 383 L146 392 Q146 400 150 400 Q154 400 154 393 L154 388 Q154 383 150 383 Z" fill="#a82820" stroke="#9a2520" strokeWidth="2.5" strokeLinejoin="round" />
        </g>
        <g className={animated && !isSmall ? 'animate-[stepRight_2.4s_ease-in-out_infinite]' : ''} style={{ transformOrigin: '212px 348px' }}>
          <line x1="212" y1="348" x2="218" y2="372" stroke="#4a3a2e" strokeWidth="5" strokeLinecap="round" />
          <rect x="208" y="369" width="20" height="15" rx="6" ry="6" fill="#fff" stroke="#e0ddd8" strokeWidth="2.5" />
          <path d="M214 383 L214 392 Q214 400 222 400 L238 400 Q246 400 246 393 L246 390 Q246 385 240 385 L214 385" fill="#c43025" stroke="#9a2520" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M214 383 L214 392 Q214 400 210 400 Q206 400 206 393 L206 388 Q206 383 210 383 Z" fill="#a82820" stroke="#9a2520" strokeWidth="2.5" strokeLinejoin="round" />
        </g>

        {/* 몸통 */}
        <rect x="48" y="85" width="264" height="265" rx="16" ry="16" fill="url(#kkBodyGrad)" stroke="#d4a060" strokeWidth="5" strokeLinejoin="round" />

        {/* 교복 */}
        <path d="M48 280 L48 334 Q48 350 64 350 L296 350 Q312 350 312 334 L312 280 Z" fill="url(#kkBlazerGrad)" stroke="#1a2440" strokeWidth="5" strokeLinejoin="round" />
        <path d="M145 280 L180 306 L215 280" fill="none" stroke="#1a2440" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M150 280 L180 302 L210 280 Z" fill="#f5f0e8" stroke="none" />
        <path d="M173 290 L180 293 L187 290 L184 326 Q180 332 176 326 Z" fill="#c43025" stroke="#9a2520" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M170 284 L180 293 L190 284 L187 278 Q180 275 173 278 Z" fill="#c43025" stroke="#9a2520" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="168" cy="318" r="3" fill="#d4a060" stroke="#b8903e" strokeWidth="1.5" />
        <circle cx="168" cy="334" r="3" fill="#d4a060" stroke="#b8903e" strokeWidth="1.5" />

        {/* 분홍 중간층 */}
        <path d="M48 133 Q48 123 58 120 L302 120 Q312 123 312 133 L310 145 Q292 155 274 149 Q252 141 232 153 Q210 163 180 153 Q150 141 130 153 Q110 163 88 151 Q66 141 52 147 Z" fill="url(#kkMidGrad)" stroke="none" />

        {/* 양념 레이어 */}
        <path d="M48 120 Q48 85 64 85 L296 85 Q312 85 312 120 L310 130 Q292 143 274 135 Q252 125 232 137 Q210 149 180 137 Q150 125 130 137 Q110 149 88 137 Q66 125 52 133 Z" fill="url(#kkTopGrad)" stroke="#9a2520" strokeWidth="5" strokeLinejoin="round" />
        <path d="M72 97 Q130 93 180 99 Q230 105 288 97" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" opacity="0.6" strokeLinecap="round" />

        {/* 눈썹 */}
        <path d="M142 176 L126 168" fill="none" stroke="#4a3a2e" strokeWidth="5" strokeLinecap="round" />
        <path d="M218 176 L234 168" fill="none" stroke="#4a3a2e" strokeWidth="5" strokeLinecap="round" />

        {/* 눈 */}
        <g className={animated && !isSmall ? 'animate-[blink_3.5s_ease-in-out_infinite]' : ''} style={{ transformOrigin: '134px 200px' }}>
          <circle cx="134" cy="200" r="16" fill="#fff" stroke="#4a3a2e" strokeWidth="3.5" />
          <circle cx="136" cy="202" r="10" fill="#1a1a1a" />
          <circle cx="130" cy="195" r="5" fill="#fff" opacity="0.9" />
          <circle cx="139" cy="204" r="2.5" fill="#fff" opacity="0.5" />
        </g>
        <g className={animated && !isSmall ? 'animate-[blink_3.5s_ease-in-out_infinite_0.1s]' : ''} style={{ transformOrigin: '226px 200px' }}>
          <circle cx="226" cy="200" r="16" fill="#fff" stroke="#4a3a2e" strokeWidth="3.5" />
          <circle cx="228" cy="202" r="10" fill="#1a1a1a" />
          <circle cx="222" cy="195" r="5" fill="#fff" opacity="0.9" />
          <circle cx="231" cy="204" r="2.5" fill="#fff" opacity="0.5" />
        </g>

        {/* 입 */}
        <path d="M168 240 Q180 252 192 240" fill="none" stroke="#4a3a2e" strokeWidth="4" strokeLinecap="round" />

        {/* 볼터치 */}
        <g className={animated && !isSmall ? 'animate-[cheekGlow_3s_ease-in-out_infinite]' : ''}>
          <ellipse cx="118" cy="230" rx="36" ry="24" fill="url(#kkCheekGrad)" opacity="0.7" />
          <circle cx="108" cy="227" r="2.5" fill="#e8816b" opacity="0.5" />
          <circle cx="118" cy="230" r="2.5" fill="#e8816b" opacity="0.5" />
          <circle cx="128" cy="227" r="2.5" fill="#e8816b" opacity="0.5" />
        </g>
        <g className={animated && !isSmall ? 'animate-[cheekGlow_3s_ease-in-out_infinite_0.5s]' : ''}>
          <ellipse cx="242" cy="230" rx="36" ry="24" fill="url(#kkCheekGrad)" opacity="0.7" />
          <circle cx="232" cy="227" r="2.5" fill="#e8816b" opacity="0.5" />
          <circle cx="242" cy="230" r="2.5" fill="#e8816b" opacity="0.5" />
          <circle cx="252" cy="227" r="2.5" fill="#e8816b" opacity="0.5" />
        </g>

        {/* 팔 */}
        <g className={animated && !isSmall ? 'animate-[waveLeft_2.4s_ease-in-out_infinite]' : ''} style={{ transformOrigin: '48px 260px' }}>
          <line x1="48" y1="260" x2="2" y2="290" stroke="#4a3a2e" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g className={animated && !isSmall ? 'animate-[waveRight_2.4s_ease-in-out_infinite]' : ''} style={{ transformOrigin: '312px 260px' }}>
          <line x1="312" y1="260" x2="358" y2="290" stroke="#4a3a2e" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* 졸업모 */}
        <g className={animated && !isSmall ? 'animate-[capWobble_2.4s_ease-in-out_infinite]' : ''} style={{ transformOrigin: '180px 48px' }}>
          <rect x="140" y="38" width="80" height="10" rx="2" ry="2" fill="#3a3a3a" stroke="#2a2a2a" strokeWidth="1.5" />
          <polygon points="180,28 230,45 180,52 130,45" fill="#3a3a3a" stroke="#2a2a2a" strokeWidth="1.5" />
          <rect x="158" y="48" width="44" height="28" rx="3" ry="3" fill="#3a3a3a" stroke="#2a2a2a" strokeWidth="1.5" />
          <circle cx="180" cy="35" r="3.5" fill="#4a4a4a" stroke="#2a2a2a" strokeWidth="1" />
          <path d="M180 35 Q195 32 205 45 Q208 52 206 62" fill="none" stroke="#4a4a4a" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="206" cy="64" r="3" fill="#4a4a4a" />
        </g>
      </svg>
    </div>
  );
}
