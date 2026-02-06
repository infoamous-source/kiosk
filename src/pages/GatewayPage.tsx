import { useTranslation } from 'react-i18next';
import { GraduationCap } from 'lucide-react';
import TrackCard from '../components/gateway/TrackCard';
import { tracks } from '../data/tracks';

export default function GatewayPage() {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 간소화된 헤더 */}
      <header className="py-6 px-8">
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
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-6">
            <span>🎓</span>
            <span>{t('gateway.badge')}</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {t('gateway.title')}
          </h2>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-4">
            {t('gateway.description')}
          </p>

          <p className="text-sm text-gray-400">
            {t('gateway.selectPrompt')}
          </p>
        </div>
      </section>

      {/* 트랙 카드 그리드 */}
      <section className="pb-24 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {tracks.map((track, index) => (
            <TrackCard key={track.id} track={track} delay={index * 100} />
          ))}
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-sm text-gray-400">
            {t('gateway.footer')}
          </p>
        </div>
      </footer>
    </div>
  );
}
