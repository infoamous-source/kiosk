import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Globe, ChevronDown } from 'lucide-react';
import TrackCard from '../components/gateway/TrackCard';
import { tracks } from '../data/tracks';
import { useVisibility } from '../contexts/VisibilityContext';

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
  const { isTrackVisible } = useVisibility();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 간소화된 헤더 */}
      <header className="py-4 px-4 sm:py-6 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Kiosk Seven</h1>
              <p className="text-xs text-gray-500">{t('gateway.subtitle')}</p>
            </div>
          </div>

          {/* 언어 선택기 */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-600"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.label}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[180px] max-h-[400px] overflow-y-auto z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                      lang.code === i18n.language ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700'
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
      </header>

      {/* 히어로 섹션 */}
      <section className="py-8 px-4 sm:py-16 sm:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-6">
            <span>🎓</span>
            <span>{t('gateway.badge')}</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {t('gateway.title')}
          </h2>

          <p className="text-base sm:text-xl text-gray-500 max-w-2xl mx-auto mb-4">
            {t('gateway.description')}
          </p>

          <p className="text-sm text-gray-400">
            {t('gateway.selectPrompt')}
          </p>
        </div>
      </section>

      {/* 트랙 카드 그리드 */}
      <section className="pb-24 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {tracks
            .filter((track) => isTrackVisible(track.id))
            .map((track, index) => (
            <TrackCard key={track.id} track={track} delay={index * 100} />
          ))}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
          <p className="text-sm text-gray-400">
            {t('gateway.footer')}
          </p>
        </div>
      </footer>
    </div>
  );
}
