import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Image, ArrowRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logPortfolioActivity } from '../../../utils/portfolioLogger';
import type { AdImageStyle } from '../../../types/marketing';

const styleGradients: Record<AdImageStyle, string> = {
  realistic: 'from-gray-700 to-gray-900',
  illustration: 'from-pink-400 to-purple-500',
  '3d': 'from-cyan-400 to-blue-600',
  popart: 'from-yellow-400 via-red-400 to-pink-500',
};

export default function SNSAdMakerTool() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const styleOptions: { value: AdImageStyle; label: string; emoji: string }[] = [
    { value: 'realistic', label: t('marketing.tools.snsAdMaker.styleRealistic'), emoji: '📷' },
    { value: 'illustration', label: t('marketing.tools.snsAdMaker.styleIllustration'), emoji: '🎨' },
    { value: '3d', label: t('marketing.tools.snsAdMaker.style3d'), emoji: '🧊' },
    { value: 'popart', label: t('marketing.tools.snsAdMaker.stylePopart'), emoji: '🌈' },
  ];

  const stylePatterns: Record<AdImageStyle, string> = {
    realistic: t('marketing.tools.snsAdMaker.styleRealisticDesc'),
    illustration: t('marketing.tools.snsAdMaker.styleIllustrationDesc'),
    '3d': t('marketing.tools.snsAdMaker.style3dDesc'),
    popart: t('marketing.tools.snsAdMaker.stylePopartDesc'),
  };

  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState<AdImageStyle>('realistic');
  const [copyText, setCopyText] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const canGenerate = subject.trim().length > 0;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setShowPreview(true);

    logPortfolioActivity(
      'sns-ad-maker', 'mk-07', 'SNS Ad Maker',
      { subject, style, copyText },
      { generated: true, isMockData: true },
      true
    );
  };

  const handleReset = () => {
    setShowPreview(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mt-6 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('marketing.tools.back', '뒤로 가기')}</span>
      </button>

      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] rounded-2xl p-4 md:p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Image className="w-6 h-6 md:w-8 md:h-8" />
          <h1 className="text-xl md:text-2xl font-bold">{t('marketing.tools.snsAdMaker.title', 'SNS 광고 메이커')}</h1>
        </div>
        <p className="text-blue-100">{t('marketing.tools.snsAdMaker.description', '인스타그램 광고 이미지를 만들어보세요')}</p>
      </div>

      {/* Tip: Link to K-Copywriter */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-700">
          {t('marketing.tools.snsAdMaker.noCopyMessage')}{' '}
          <button
            onClick={() => navigate('/marketing/tools/k-copywriter')}
            className="text-blue-600 hover:underline font-semibold"
          >
            {t('marketing.tools.snsAdMaker.createCopyLink')}
          </button>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Settings Panel */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6">
          <h2 className="font-bold text-gray-800 mb-4">{t('marketing.tools.snsAdMaker.settingsTitle')}</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.tools.snsAdMaker.subjectLabel')}</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('marketing.tools.snsAdMaker.subjectPlaceholder')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('marketing.tools.snsAdMaker.styleLabel')}</label>
              <div className="grid grid-cols-2 gap-2">
                {styleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStyle(opt.value)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      style === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl block">{opt.emoji}</span>
                    <span className={`text-sm font-medium ${style === opt.value ? 'text-blue-600' : 'text-gray-700'}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.tools.snsAdMaker.copyLabel')}</label>
              <textarea
                value={copyText}
                onChange={(e) => setCopyText(e.target.value)}
                placeholder={t('marketing.tools.snsAdMaker.copyPlaceholder')}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                canGenerate
                  ? 'bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] hover:shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {t('marketing.tools.snsAdMaker.generatePreview')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Instagram Preview */}
        <div>
          <h2 className="font-bold text-gray-800 mb-4">{t('marketing.tools.snsAdMaker.instagramPreview')}</h2>

          {showPreview ? (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              {/* Instagram Header */}
              <div className="flex items-center gap-3 p-3 border-b border-gray-100">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t('marketing.tools.snsAdMaker.brandName')}</p>
                  <p className="text-xs text-gray-400">{t('marketing.tools.snsAdMaker.sponsored')}</p>
                </div>
              </div>

              {/* Image Area */}
              <div className={`relative aspect-square bg-gradient-to-br ${styleGradients[style]} flex flex-col items-center justify-center p-4 md:p-8`}>
                {/* Style indicator */}
                <div className="absolute top-3 right-3 bg-black/30 px-2 py-1 rounded text-white text-xs">
                  {stylePatterns[style]}
                </div>

                {/* Main visual */}
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {style === 'realistic' ? '📸' : style === 'illustration' ? '🎨' : style === '3d' ? '🧊' : '🎉'}
                  </div>
                  <p className="text-white font-bold text-xl mb-2">{subject}</p>
                  {copyText && (
                    <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                      <p className="text-white font-medium text-sm leading-relaxed">{copyText}</p>
                    </div>
                  )}
                </div>

                {/* Mock watermark */}
                <div className="absolute bottom-3 left-3 bg-black/20 px-2 py-1 rounded text-white/60 text-xs">
                  {t('marketing.tools.snsAdMaker.mockPreview')}
                </div>
              </div>

              {/* Instagram Actions */}
              <div className="p-3">
                <div className="flex gap-4 mb-2">
                  <span className="text-xl">❤️</span>
                  <span className="text-xl">💬</span>
                  <span className="text-xl">📤</span>
                </div>
                <p className="text-sm">
                  {t('marketing.tools.snsAdMaker.likes', { count: 123 })}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-semibold">{t('marketing.tools.snsAdMaker.brandName')}</span>{' '}
                  {copyText || subject}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl aspect-square flex flex-col items-center justify-center text-gray-400">
              <Image className="w-16 h-16 mb-3 opacity-50" />
              <p className="font-medium text-center px-4">{t('marketing.tools.snsAdMaker.emptyMessage')}</p>
            </div>
          )}

          {showPreview && (
            <button
              onClick={handleReset}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              {t('marketing.tools.snsAdMaker.resetButton')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
