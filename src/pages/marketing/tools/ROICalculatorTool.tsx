import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calculator, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logPortfolioActivity } from '../../../utils/portfolioLogger';

export default function ROICalculatorTool() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [adSpend, setAdSpend] = useState('');
  const [revenue, setRevenue] = useState('');

  const result = useMemo(() => {
    const spend = parseFloat(adSpend);
    const rev = parseFloat(revenue);

    if (isNaN(spend) || isNaN(rev) || spend <= 0) return null;

    const roas = (rev / spend) * 100;
    const profit = rev - spend;
    const roi = ((rev - spend) / spend) * 100;

    return { roas, profit, roi, spend, revenue: rev };
  }, [adSpend, revenue]);

  const getROASMessage = (roas: number) => {
    if (roas >= 500) return { emoji: '🎉', text: t('marketing.tools.roiCalculator.messageGreat'), color: 'text-green-600' };
    if (roas >= 300) return { emoji: '👍', text: t('marketing.tools.roiCalculator.messageGood'), color: 'text-green-600' };
    if (roas >= 200) return { emoji: '😊', text: t('marketing.tools.roiCalculator.messageOk'), color: 'text-blue-600' };
    if (roas >= 100) return { emoji: '😐', text: t('marketing.tools.roiCalculator.messageEven'), color: 'text-yellow-600' };
    return { emoji: '😥', text: t('marketing.tools.roiCalculator.messageLoss'), color: 'text-red-600' };
  };

  const handleCalculate = () => {
    if (result) {
      logPortfolioActivity(
        'roi-calculator', 'mk-06', 'ROI Calculator',
        { adSpend: result.spend, revenue: result.revenue },
        { roas: result.roas, profit: result.profit, roi: result.roi },
        true
      );
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(num));
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
          <Calculator className="w-6 h-6 md:w-8 md:h-8" />
          <h1 className="text-xl md:text-2xl font-bold">{t('marketing.tools.roiCalculator.title', 'ROI 계산기')}</h1>
        </div>
        <p className="text-blue-100">{t('marketing.tools.roiCalculator.description', '광고 수익률을 계산해보세요')}</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-700">
          {t('marketing.tools.roiCalculator.roasInfo')}
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.tools.roiCalculator.adSpendLabel')}</label>
            <input
              type="number"
              value={adSpend}
              onChange={(e) => setAdSpend(e.target.value)}
              placeholder="예: 1000000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none text-lg"
            />
            {adSpend && (
              <p className="text-xs text-gray-400 mt-1">{formatNumber(parseFloat(adSpend) || 0)}{t('marketing.tools.roiCalculator.currencyUnit')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.tools.roiCalculator.revenueLabel')}</label>
            <input
              type="number"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              placeholder="예: 3000000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none text-lg"
            />
            {revenue && (
              <p className="text-xs text-gray-400 mt-1">{formatNumber(parseFloat(revenue) || 0)}{t('marketing.tools.roiCalculator.currencyUnit')}</p>
            )}
          </div>

          <button
            onClick={handleCalculate}
            disabled={!result}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              result
                ? 'bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {t('marketing.tools.roiCalculator.calculateButton')}
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="space-y-4">
          {/* ROAS Card */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-4 md:p-6 text-center">
            <p className="text-sm text-gray-500 mb-2">{t('marketing.tools.roiCalculator.roasLabel')}</p>
            <p className={`text-3xl md:text-5xl font-black ${result.roas >= 100 ? 'text-green-600' : 'text-red-600'}`}>
              {result.roas.toFixed(0)}%
            </p>
            <div className="mt-4">
              {(() => {
                const msg = getROASMessage(result.roas);
                return (
                  <p className={`text-lg font-medium ${msg.color}`}>
                    {msg.emoji} {msg.text}
                  </p>
                );
              })()}
            </div>
          </div>

          {/* Detail Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{t('marketing.tools.roiCalculator.adSpend')}</p>
              <p className="text-lg font-bold text-gray-800">{formatNumber(result.spend)}{t('marketing.tools.roiCalculator.currencyUnit')}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{t('marketing.tools.roiCalculator.revenue')}</p>
              <p className="text-lg font-bold text-gray-800">{formatNumber(result.revenue)}{t('marketing.tools.roiCalculator.currencyUnit')}</p>
            </div>
          </div>

          {/* Profit Card */}
          <div className={`rounded-xl p-4 md:p-5 ${result.profit >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('marketing.tools.roiCalculator.profit')}</p>
                <p className={`text-2xl font-bold ${result.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.profit >= 0 ? '+' : ''}{formatNumber(result.profit)}{t('marketing.tools.roiCalculator.currencyUnit')}
                </p>
              </div>
              {result.profit > 0 ? (
                <TrendingUp className="w-10 h-10 text-green-400" />
              ) : result.profit < 0 ? (
                <TrendingDown className="w-10 h-10 text-red-400" />
              ) : (
                <Minus className="w-10 h-10 text-gray-400" />
              )}
            </div>
          </div>

          {/* ROI */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
            <p className="text-sm text-gray-500 mb-1">{t('marketing.tools.roiCalculator.roiLabel')}</p>
            <p className={`text-2xl font-bold ${result.roi >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {result.roi >= 0 ? '+' : ''}{result.roi.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {result.roi >= 0
                ? t('marketing.tools.roiCalculator.profitPerUnit', { amount: (result.roi / 100).toFixed(2) })
                : t('marketing.tools.roiCalculator.lossPerUnit', { amount: Math.abs(result.roi / 100).toFixed(2) })
              }
            </p>
          </div>

          {/* Visual Bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">{t('marketing.tools.roiCalculator.comparison')}</p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{t('marketing.tools.roiCalculator.adSpend')}</span>
                  <span>{formatNumber(result.spend)}{t('marketing.tools.roiCalculator.currencyUnit')}</span>
                </div>
                <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((result.spend / Math.max(result.spend, result.revenue)) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{t('marketing.tools.roiCalculator.revenue')}</span>
                  <span>{formatNumber(result.revenue)}{t('marketing.tools.roiCalculator.currencyUnit')}</span>
                </div>
                <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((result.revenue / Math.max(result.spend, result.revenue)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              {t('marketing.tools.roiCalculator.tip')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
