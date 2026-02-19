import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight, Home } from 'lucide-react';
import KkakdugiCharacter from '@/components/brand/KkakdugiCharacter';
import { SchoolPatternBg, StarIcon, PencilIcon } from '@/components/brand/SchoolIllustrations';

export default function RegisterCompletePage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-kk-bg relative overflow-hidden flex items-center justify-center p-4">
      <SchoolPatternBg className="opacity-20" />

      <div className="max-w-lg w-full text-center relative">
        {/* 깍두기 캐릭터 + 장식 */}
        <div className="mb-6 relative inline-block">
          <KkakdugiCharacter size="half" animated />
          <div className="absolute -left-6 top-2">
            <StarIcon size={28} className="opacity-40 animate-[floatBounce_2.5s_ease-in-out_infinite]" />
          </div>
          <div className="absolute -right-6 top-6">
            <PencilIcon size={24} className="opacity-40 animate-[floatBounce_3s_ease-in-out_infinite_0.3s]" />
          </div>
          <div className="absolute -left-10 bottom-8">
            <StarIcon size={20} className="opacity-30 animate-[floatBounce_3.5s_ease-in-out_infinite_0.6s]" />
          </div>
          <div className="absolute -right-10 bottom-4">
            <StarIcon size={16} className="opacity-30 animate-[floatBounce_2.8s_ease-in-out_infinite_0.9s]" />
          </div>
        </div>

        {/* 통합 메인 메시지: 입학 축하 + 등록 완료 */}
        <h1 className="text-3xl md:text-4xl font-bold text-kk-brown mb-2">
          {t('congrats.title', '여러분의 입학을 축하합니다!')}
        </h1>
        <p className="text-lg text-kk-brown/60 mb-2">
          {t('registerComplete.title', '학생등록이 완료되었습니다!')}
        </p>
        <p className="text-sm text-gray-400 mb-8">
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
          <span>{t('registerComplete.ctaButton', '나만의 AI 친구 연결하기 (Connect My AI Assistant)')}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* 나중에 하기 → 메인화면으로 이동 */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          {t('registerComplete.skipLink', '나중에 하기 (Do it later)')}
        </button>
      </div>
    </div>
  );
}
