import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PartyPopper, Sparkles, ArrowRight, Home } from 'lucide-react';
import KkakdugiCharacter from '@/components/brand/KkakdugiCharacter';

export default function RegisterCompletePage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-kk-cream via-kk-warm to-kk-bg flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* 깍두기 캐릭터 + 축하 아이콘 */}
        <div className="mb-6">
          <KkakdugiCharacter size="half" animated />
        </div>
        <div className="mb-6 relative inline-block">
          <div className="animate-bounce">
            <PartyPopper className="w-28 h-28 mx-auto text-kk-red" strokeWidth={1.5} />
          </div>
          <Sparkles className="w-8 h-8 text-kk-gold absolute -top-2 -right-2 animate-pulse" />
          <Sparkles className="w-6 h-6 text-kk-peach absolute -bottom-1 -left-3 animate-pulse delay-300" />
        </div>

        {/* 메인 메시지 */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {t('registerComplete.title', '학생등록이 완료되었습니다!')}
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          {t('registerComplete.titleEn', 'Registration Complete!')}
        </p>

        {/* 안내 문구 */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-6 mb-8 border border-white/50 shadow-sm">
          <p className="text-gray-700 mb-1">
            {t('registerComplete.subtitle', '나만의 AI 비서를 연결하면 더 스마트하게 학습할 수 있어요')}
          </p>
          <p className="text-sm text-gray-400">
            {t('registerComplete.subtitleEn', 'Connect your AI assistant for a smarter learning experience')}
          </p>
        </div>

        {/* CTA 버튼: AI 비서 연결 */}
        <button
          onClick={() => navigate('/ai-welcome', { state: { schoolId: 'marketing' } })}
          className="group w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-kk-red to-kk-red-deep text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 mb-4"
        >
          <Sparkles className="w-5 h-5" />
          <span>{t('registerComplete.ctaButton', '나만의 AI 비서 연결하기 (Connect My AI Assistant)')}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* 스킵 링크 */}
        <button
          onClick={() => navigate('/marketing/hub')}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          {t('registerComplete.skipLink', '나중에 하기 (Do it later)')}
        </button>
      </div>
    </div>
  );
}
