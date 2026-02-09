import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { earnStamp, hasStamp, saveSimulationResult } from '../../../../utils/schoolStorage';

export default function ROASSimulatorTool() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user } = useAuth();
  const completed = user ? hasStamp(user.id, 'roas-simulator') : false;

  const handleComplete = () => {
    if (!user || completed) return;

    // 시뮬레이션 결과 저장 (졸업과제 완료 처리)
    saveSimulationResult(user.id, {
      completedAt: new Date().toISOString(),
      roas: 3.5,
      budget: 1000000,
      revenue: 3500000,
    });

    // 스탬프 획득
    earnStamp(user.id, 'roas-simulator');
    navigate('/marketing/school/attendance');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">6{t('school.curriculum.period')}</span>
            <h1 className="font-bold text-gray-800">{t('school.periods.roasSimulator.name')}</h1>
            <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded font-bold">
              {t('school.lab.graduationProject')}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-50 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t('school.periods.roasSimulator.name')}</h2>
          <p className="text-sm text-gray-500 mb-2">{t('school.tools.comingSoon')}</p>
          <p className="text-xs text-orange-500 font-medium mb-6">{t('school.tools.graduationNote')}</p>

          {completed ? (
            <div className="py-3 bg-green-50 text-green-600 font-bold rounded-xl">
              ✅ {t('school.tools.alreadyCompleted')}
            </div>
          ) : (
            <button
              onClick={handleComplete}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              {t('school.tools.completeButton')}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
