import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, PenTool, Copy, CheckCircle, Loader2, Sparkles, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateCopy } from '../../../services/gemini/copywriterService';
import { logPortfolioActivity } from '../../../utils/portfolioLogger';
import { isGeminiEnabled } from '../../../services/gemini/geminiClient';
import type { CopywriterOutput } from '../../../types/marketing';

type Tone = 'emotional' | 'fun' | 'serious';

const toneOptions: { value: Tone; label: string; emoji: string; desc: string }[] = [
  { value: 'emotional', label: '감성적', emoji: '💖', desc: '따뜻하고 마음을 움직이는' },
  { value: 'fun', label: '재미있게', emoji: '😄', desc: '유쾌하고 친근한' },
  { value: 'serious', label: '전문적', emoji: '💼', desc: '신뢰감 있고 전문적인' },
];

export default function KCopywriterTool() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [target, setTarget] = useState('');
  const [tone, setTone] = useState<Tone>('emotional');
  const [result, setResult] = useState<CopywriterOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const canGenerate = productName.trim().length > 0;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setResult(null);

    try {
      const output = await generateCopy({ productName, target, tone });
      setResult(output);

      logPortfolioActivity(
        'k-copywriter', 'mk-07', 'K-Copywriter',
        { productName, target, tone },
        { copies: output.copies, isMockData: output.isMockData },
        output.isMockData
      );
    } catch {
      // fallback handled in service
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setResult(null);
    setCopiedIdx(null);
  };

  const aiEnabled = isGeminiEnabled();

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mt-6 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('marketing.tools.back', '뒤로 가기')}</span>
      </button>

      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-2">
          <PenTool className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{t('marketing.tools.kCopywriter.title', 'K-카피라이터')}</h1>
          {aiEnabled && (
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">✨ AI 연결됨</span>
          )}
        </div>
        <p className="text-blue-100">{t('marketing.tools.kCopywriter.description', 'AI가 한국형 광고 카피를 만들어드려요')}</p>
      </div>

      {!aiEnabled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-800">
            💡 AI 비서가 연결되지 않았어요. 샘플 카피를 보여드릴게요!
            <button
              onClick={() => navigate('/marketing')}
              className="ml-1 text-blue-600 hover:underline font-medium"
            >
              AI 비서 연결하기 →
            </button>
          </p>
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">상품/서비스 이름 *</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="예: 홈메이드 망고 주스, 카페 라떼"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">타겟 고객 (선택)</label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="예: 20대 여성, 건강을 중시하는 직장인"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Tone Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">분위기</label>
            <div className="grid grid-cols-3 gap-3">
              {toneOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTone(opt.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    tone === opt.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{opt.emoji}</span>
                  <span className={`text-sm font-semibold block ${tone === opt.value ? 'text-blue-600' : 'text-gray-700'}`}>
                    {opt.label}
                  </span>
                  <span className="text-xs text-gray-400 block">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
              canGenerate && !loading
                ? 'bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                카피 생성 중...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                카피 만들기
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {result.isMockData ? '📝 샘플 카피' : '✨ AI가 만든 카피'}
            </h2>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
              다시 만들기
            </button>
          </div>

          <div className="space-y-3">
            {result.copies.map((copy, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <p className="text-gray-800 text-lg leading-relaxed mb-3">"{copy}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">옵션 {idx + 1}</span>
                  <button
                    onClick={() => handleCopy(copy, idx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        복사 완료!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        복사하기
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {result.isMockData && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                💡 이것은 샘플 카피예요. AI 비서를 연결하면 상품에 맞는 진짜 카피를 만들 수 있어요!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
