import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, UserCircle, Copy, CheckCircle, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logPortfolioActivity } from '../../../utils/portfolioLogger';

interface PersonaForm {
  name: string;
  age: string;
  gender: string;
  occupation: string;
  interests: string;
  painPoints: string;
  goals: string;
}

const initialForm: PersonaForm = {
  name: '',
  age: '',
  gender: '',
  occupation: '',
  interests: '',
  painPoints: '',
  goals: '',
};

export default function PersonaMakerTool() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [form, setForm] = useState<PersonaForm>(initialForm);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateField = (field: keyof PersonaForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canGenerate = form.name.trim() && form.age.trim() && form.occupation.trim();

  const handleGenerate = () => {
    if (!canGenerate) return;
    setShowResult(true);
    logPortfolioActivity(
      'persona-maker', 'mk-02', 'Persona Maker',
      { ...form },
      { generated: true },
      true
    );
  };

  const handleCopy = async () => {
    const text = [
      `[ ${t('marketing.tools.personaMaker.personaCard')} ]`,
      `${t('marketing.tools.personaMaker.nameLine')}: ${form.name}`,
      `${t('marketing.tools.personaMaker.ageLine')}: ${form.age}${t('marketing.tools.personaMaker.ageSuffix')}`,
      `${t('marketing.tools.personaMaker.genderLine')}: ${form.gender}`,
      `${t('marketing.tools.personaMaker.occupationLine')}: ${form.occupation}`,
      `${t('marketing.tools.personaMaker.interestsLine')}: ${form.interests}`,
      `${t('marketing.tools.personaMaker.painPointsLine')}: ${form.painPoints}`,
      `${t('marketing.tools.personaMaker.goalsLine')}: ${form.goals}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      logPortfolioActivity('persona-maker', 'mk-02', 'Persona Maker', { action: 'copy' }, { copied: true }, true);
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setShowResult(false);
    setCopied(false);
  };

  const genderOptions = [
    { value: '남성', label: t('marketing.tools.personaMaker.genderMale') },
    { value: '여성', label: t('marketing.tools.personaMaker.genderFemale') },
    { value: '기타', label: t('marketing.tools.personaMaker.genderOther') },
  ];

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
          <UserCircle className="w-6 h-6 md:w-8 md:h-8" />
          <h1 className="text-xl md:text-2xl font-bold">{t('marketing.tools.personaMaker.title', '페르소나 메이커')}</h1>
        </div>
        <p className="text-blue-100">{t('marketing.tools.personaMaker.description', '타겟 고객을 구체적인 인물로 만들어보세요')}</p>
      </div>

      {!showResult ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-2">
            <p className="text-sm text-blue-700">{t('marketing.tools.personaMaker.tipMessage')}</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.tools.personaMaker.nameLabel')} *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder={t('marketing.tools.personaMaker.namePlaceholder')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Age & Gender Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.tools.personaMaker.ageLabel')} *</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => updateField('age', e.target.value)}
                placeholder={t('marketing.tools.personaMaker.agePlaceholder')}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.tools.personaMaker.genderLabel')}</label>
              <div className="flex gap-2">
                {genderOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateField('gender', opt.value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      form.gender === opt.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.tools.personaMaker.occupationLabel')} *</label>
            <input
              type="text"
              value={form.occupation}
              onChange={(e) => updateField('occupation', e.target.value)}
              placeholder={t('marketing.tools.personaMaker.occupationPlaceholder')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.tools.personaMaker.interestsLabel')}</label>
            <input
              type="text"
              value={form.interests}
              onChange={(e) => updateField('interests', e.target.value)}
              placeholder={t('marketing.tools.personaMaker.interestsPlaceholder')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Pain Points */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.tools.personaMaker.painPointsLabel')}</label>
            <textarea
              value={form.painPoints}
              onChange={(e) => updateField('painPoints', e.target.value)}
              placeholder={t('marketing.tools.personaMaker.painPointsPlaceholder')}
              rows={2}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none"
            />
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('marketing.tools.personaMaker.goalsLabel')}</label>
            <textarea
              value={form.goals}
              onChange={(e) => updateField('goals', e.target.value)}
              placeholder={t('marketing.tools.personaMaker.goalsPlaceholder')}
              rows={2}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              canGenerate
                ? 'bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {t('marketing.tools.personaMaker.createButton')}
          </button>
        </div>
      ) : (
        <div>
          {/* Persona Card */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl overflow-hidden shadow-lg">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] p-4 md:p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                  {form.gender === '여성' ? '👩' : form.gender === '기타' ? '🧑' : '👨'}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">{form.name}</h2>
                  <p className="text-blue-100">{form.age}{t('marketing.tools.personaMaker.ageSuffix')} · {form.gender || t('marketing.tools.personaMaker.unspecified')} · {form.occupation}</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 md:p-6 space-y-4">
              {form.interests && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">💖 관심사</h3>
                  <p className="text-gray-800">{form.interests}</p>
                </div>
              )}
              {form.painPoints && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">😔 고민</h3>
                  <p className="text-gray-800">{form.painPoints}</p>
                </div>
              )}
              {form.goals && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">🎯 목표</h3>
                  <p className="text-gray-800">{form.goals}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {t('marketing.tools.personaMaker.copySuccess')}
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  {t('marketing.tools.personaMaker.copyButton')}
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              {t('marketing.tools.personaMaker.resetButton')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
