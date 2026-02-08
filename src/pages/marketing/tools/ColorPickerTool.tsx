import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Palette, Copy, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { colorEmotions } from '../../../data/marketing/colorEmotions';
import { logPortfolioActivity } from '../../../utils/portfolioLogger';

export default function ColorPickerTool() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const selectedData = colorEmotions.find((e) => e.id === selectedEmotion);

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleSelectEmotion = (emotionId: string) => {
    setSelectedEmotion(emotionId);
    const emotion = colorEmotions.find((e) => e.id === emotionId);
    if (emotion) {
      logPortfolioActivity(
        'color-picker', 'mk-04', 'Color Picker',
        { emotion: emotionId },
        { mainColor: emotion.mainColor.hex, subColors: emotion.subColors.map((s) => s.hex) },
        true
      );
    }
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
          <Palette className="w-6 h-6 md:w-8 md:h-8" />
          <h1 className="text-xl md:text-2xl font-bold">{t('marketing.tools.colorPicker.title', '감정 컬러 피커')}</h1>
        </div>
        <p className="text-blue-100">{t('marketing.tools.colorPicker.description', '브랜드 감정에 맞는 색상을 찾아보세요')}</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-700">{t('marketing.tools.colorPicker.tipMessage')}</p>
      </div>

      {/* Emotion Selection */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">{t('marketing.tools.colorPicker.selectEmotion')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {colorEmotions.map((emotion) => (
          <button
            key={emotion.id}
            onClick={() => handleSelectEmotion(emotion.id)}
            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
              selectedEmotion === emotion.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div
              className="w-8 h-8 rounded-full mb-2 shadow-inner"
              style={{ backgroundColor: emotion.mainColor.hex }}
            />
            <p className="font-bold text-gray-800 text-sm">{emotion.emotionKo}</p>
            <p className="text-xs text-gray-500 mt-0.5">{emotion.emotion}</p>
          </button>
        ))}
      </div>

      {/* Color Result */}
      {selectedData && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {selectedData.emotionKo} ({selectedData.emotion})
            </h3>
            <p className="text-gray-500 mb-6">{selectedData.description}</p>

            {/* Main Color */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-500 mb-3">{t('marketing.tools.colorPicker.mainColor')}</h4>
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: selectedData.mainColor.hex }}
                  onClick={() => handleCopyHex(selectedData.mainColor.hex)}
                />
                <div>
                  <p className="font-bold text-gray-800">{selectedData.mainColor.nameKo}</p>
                  <p className="text-sm text-gray-500">{selectedData.mainColor.name}</p>
                  <button
                    onClick={() => handleCopyHex(selectedData.mainColor.hex)}
                    className="flex items-center gap-1 mt-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    {copiedHex === selectedData.mainColor.hex ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t('marketing.tools.colorPicker.copiedText')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{selectedData.mainColor.hex}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Sub Colors */}
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-3">{t('marketing.tools.colorPicker.subColors')}</h4>
              <div className="grid grid-cols-3 gap-3">
                {selectedData.subColors.map((color, idx) => (
                  <div
                    key={idx}
                    className="text-center cursor-pointer group"
                    onClick={() => handleCopyHex(color.hex)}
                  >
                    <div
                      className="w-full h-16 rounded-xl shadow-md group-hover:scale-105 transition-transform border border-gray-100"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="text-xs font-medium text-gray-700 mt-2">{color.nameKo}</p>
                    <p className="text-xs text-gray-400">
                      {copiedHex === color.hex ? t('marketing.tools.colorPicker.copiedText') : color.hex}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-500 mb-3">{t('marketing.tools.colorPicker.preview')}</h4>
              <div
                className="rounded-xl p-4 md:p-6 text-center"
                style={{ backgroundColor: selectedData.subColors[2]?.hex || '#f8f9fa' }}
              >
                <div
                  className="inline-block px-6 py-3 rounded-lg text-white font-bold mb-3"
                  style={{ backgroundColor: selectedData.mainColor.hex }}
                >
                  {t('marketing.tools.colorPicker.buyButton')}
                </div>
                <p style={{ color: selectedData.mainColor.hex }} className="font-medium">
                  {t('marketing.tools.colorPicker.previewTitle')}
                </p>
                <p style={{ color: selectedData.subColors[0]?.hex }} className="text-sm mt-1">
                  {t('marketing.tools.colorPicker.previewSubtitle')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
