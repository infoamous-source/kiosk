import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Globe, ChevronDown, ChevronRight, UserCircle } from 'lucide-react';
import TrackCard from '../components/gateway/TrackCard';
import { tracks } from '../data/tracks';
import { useVisibility } from '../contexts/VisibilityContext';
import { useAuth } from '../contexts/AuthContext';
import { useEnrollments } from '../contexts/EnrollmentContext';
import PendingEnrollmentBanner from '../components/enrollment/PendingEnrollmentBanner';
import KkakdugiCharacter from '../components/brand/KkakdugiCharacter';
import KkakdugiMascot from '../components/brand/KkakdugiMascot';
import { SchoolPatternBg, PencilIcon, StarIcon } from '../components/brand/SchoolIllustrations';

const languages = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', label: 'ภาษาไทย', flag: '🇹🇭' },
  { code: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'mn', label: 'Монгол', flag: '🇲🇳' },
  { code: 'uz', label: 'Oʻzbekcha', flag: '🇺🇿' },
  { code: 'ne', label: 'नेपाली', flag: '🇳🇵' },
  { code: 'tl', label: 'Filipino', flag: '🇵🇭' },
  { code: 'my', label: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'km', label: 'ភាសាខ្មែរ', flag: '🇰🇭' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export default function GatewayPage() {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { enrollments, isLoading: enrollLoading } = useEnrollments();
  const { isTrackVisible } = useVisibility();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  // 이미 로그인 + 마케팅 등록된 사용자 → 자동으로 허브로 이동
  useEffect(() => {
    if (authLoading || enrollLoading) return;
    if (isAuthenticated && enrollments.some(e => e.school_id === 'marketing')) {
      navigate('/marketing/hub', { replace: true });
    }
  }, [isAuthenticated, enrollments, authLoading, enrollLoading, navigate]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-kk-bg relative overflow-hidden">
      {/* 학교 노트 패턴 배경 */}
      <SchoolPatternBg className="opacity-40" />

      {/* Pending Enrollment 알림 배너 */}
      <PendingEnrollmentBanner />

      {/* ── 헤더 ── */}
      <header className="relative py-4 px-4 sm:py-6 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <KkakdugiMascot size={44} className="drop-shadow-sm" />
            <div>
              <h1 className="text-xl font-bold text-kk-brown">깍두기 학교</h1>
              <p className="text-xs text-kk-red">{t('gateway.subtitle', '이주민/유학생을 위한 교육 학교')}</p>
            </div>
          </div>

          {/* 내 학생증 + 언어 선택기 */}
          <div className="flex items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-kk-cream/60 transition-colors text-sm font-medium text-kk-brown"
            >
              <UserCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t('sidebar.profile', '내 학생증')}</span>
            </button>
          )}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-kk-cream/60 transition-colors text-sm font-medium text-kk-brown"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.label}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-kk-warm py-2 min-w-[180px] max-h-[400px] overflow-y-auto z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-kk-cream/50 transition-colors ${
                      lang.code === i18n.language ? 'text-kk-red-deep font-semibold bg-kk-cream/40' : 'text-kk-brown'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* ── 히어로 섹션 ── */}
      <section className="relative py-6 px-4 sm:py-10 sm:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* 장식: 연필, 별 */}
          <div className="hidden sm:block absolute top-8 left-[10%] animate-[wiggle_3s_ease-in-out_infinite]">
            <PencilIcon size={32} className="opacity-50" />
          </div>
          <div className="hidden sm:block absolute top-12 right-[12%] animate-[wiggle_3s_ease-in-out_infinite_0.5s]">
            <StarIcon size={28} className="opacity-40" />
          </div>

          {/* 캐릭터 */}
          <div className="mb-4">
            <KkakdugiCharacter size="half" animated />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-kk-cream text-kk-red-deep rounded-full text-sm font-semibold mb-4 border border-kk-warm">
            <span>🎓</span>
            <span>{t('gateway.badge', '이주민/유학생을 위한 교육')}</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-kk-brown mb-4 leading-tight">
            {t('gateway.title', '당신의 성장을 함께합니다')}
          </h2>

          <p className="text-base sm:text-lg text-kk-brown/60 max-w-2xl mx-auto mb-2">
            {t('gateway.description', '디지털 기초부터 취업 역량까지, 한국 생활에 필요한 모든 교육을 한 곳에서')}
          </p>
        </div>
      </section>

      {/* ── "깍두기 학교란?" 배너 버튼 ── */}
      <section className="relative px-4 sm:px-8 mb-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/about')}
            className="btn-chalkboard w-full py-4 px-6 rounded-2xl flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">📋</span>
              <div className="text-left">
                <span className="text-lg font-bold">깍두기 학교란?</span>
                <p className="text-sm opacity-70 hidden sm:block">우리 학교의 이야기와 학과를 소개합니다</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-60 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── 학과 카드 그리드 ── */}
      <section className="relative pb-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-kk-brown/50 text-center mb-4">
            {t('gateway.selectPrompt', '아래에서 학과를 선택하세요')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {tracks
              .filter((track) => isTrackVisible(track.id))
              .map((track, index) => (
              <TrackCard key={track.id} track={track} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer className="relative py-8 border-t border-kk-warm/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <KkakdugiMascot size={20} />
            <span className="text-sm text-kk-brown/40 font-medium">깍두기 학교</span>
          </div>
          <p className="text-xs text-kk-brown/30">
            {t('gateway.footer', '© 2024 깍두기 학교. 이주민/유학생을 위한 교육 플랫폼')}
          </p>
        </div>
      </footer>
    </div>
  );
}
