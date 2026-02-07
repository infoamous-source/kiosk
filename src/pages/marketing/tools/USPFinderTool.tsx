import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Target, ArrowRight, Copy, CheckCircle, RotateCcw, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logPortfolioActivity } from '../../../utils/portfolioLogger';

interface USPData {
  productName: string;
  competitors: string;
  strengths: string;
  targetNeeds: string;
}

const initialData: USPData = {
  productName: '',
  competitors: '',
  strengths: '',
  targetNeeds: '',
};

const steps = ['내 제품', '경쟁자', '강점', '결과'];

export default function USPFinderTool() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<USPData>(initialData);
  const [copied, setCopied] = useState(false);

  const updateField = (field: keyof USPData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.productName.trim().length > 0;
      case 1: return data.competitors.trim().length > 0;
      case 2: return data.strengths.trim().length > 0 && data.targetNeeds.trim().length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      if (currentStep === 2) {
        logPortfolioActivity(
          'usp-finder', 'mk-03', 'USP Finder',
          { ...data },
          { generated: true },
          true
        );
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const generateUSP = () => {
    return `"${data.productName}"는 ${data.competitors}와 달리, ${data.strengths}합니다. ${data.targetNeeds}을(를) 원하는 고객에게 최고의 선택입니다.`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateUSP());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setData(initialData);
    setCurrentStep(0);
    setCopied(false);
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
          <Target className="w-6 h-6 md:w-8 md:h-8" />
          <h1 className="text-xl md:text-2xl font-bold">{t('marketing.tools.uspFinder.title', 'USP 파인더')}</h1>
        </div>
        <p className="text-blue-100">{t('marketing.tools.uspFinder.description', '나만의 특별한 장점을 찾아보세요')}</p>
      </div>

      {/* Wizard Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <div key={index} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : index + 1}
                </div>
                <span className={`text-xs mt-1.5 whitespace-nowrap ${isCurrent ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mb-5 transition-colors duration-300 ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6">
        {currentStep === 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1단계: 내 제품/서비스는?</h2>
            <p className="text-gray-500 text-sm mb-4">팔고 싶은 물건이나 서비스의 이름을 적어주세요.</p>
            <input
              type="text"
              value={data.productName}
              onChange={(e) => updateField('productName', e.target.value)}
              placeholder="예: 홈메이드 망고 주스"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
            />
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2단계: 경쟁자는 누구?</h2>
            <p className="text-gray-500 text-sm mb-4">비슷한 물건을 파는 다른 곳은 어디인가요?</p>
            <textarea
              value={data.competitors}
              onChange={(e) => updateField('competitors', e.target.value)}
              placeholder="예: 편의점 주스, 카페 스무디, 마트 주스"
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none"
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">3단계: 나만의 강점</h2>
              <p className="text-gray-500 text-sm mb-4">경쟁자와 다른 나만의 특별한 점은?</p>
              <textarea
                value={data.strengths}
                onChange={(e) => updateField('strengths', e.target.value)}
                placeholder="예: 당일 수확한 생망고만 사용, 설탕 무첨가"
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">고객이 원하는 것</h2>
              <p className="text-gray-500 text-sm mb-4">타겟 고객이 가장 원하는 것은?</p>
              <textarea
                value={data.targetNeeds}
                onChange={(e) => updateField('targetNeeds', e.target.value)}
                placeholder="예: 건강한 음료, 신선한 과일 맛"
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">🎉 당신의 USP가 완성됐어요!</h2>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
              <p className="text-lg text-gray-800 leading-relaxed font-medium">
                {generateUSP()}
              </p>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                💡 <strong>팁:</strong> 이 USP를 광고 카피, 소개 페이지, SNS 프로필에 활용해보세요!
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    복사 완료!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    USP 복사하기
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                다시
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep < 3 && (
          <div className="flex gap-3 mt-6">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                이전
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] hover:shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {currentStep === 2 ? 'USP 만들기' : '다음'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
