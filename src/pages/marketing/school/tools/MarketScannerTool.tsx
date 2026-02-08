import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Radar } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { earnStamp, hasStamp } from '../../../../utils/schoolStorage';

export default function MarketScannerTool() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user } = useAuth();
  const completed = user ? hasStamp(user.id, 'market-scanner') : false;

  const handleComplete = () => {
    if (user && !completed) {
      earnStamp(user.id, 'market-scanner');
      navigate('/marketing/school/attendance');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">2{t('school.curriculum.period')}</span>
            <h1 className="font-bold text-gray-800">{t('school.periods.marketScanner.name')}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Radar className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t('school.periods.marketScanner.name')}</h2>
          <p className="text-sm text-gray-500 mb-6">{t('school.tools.comingSoon')}</p>

          {completed ? (
            <div className="py-3 bg-green-50 text-green-600 font-bold rounded-xl">
              ✅ {t('school.tools.alreadyCompleted')}
            </div>
          ) : (
            <button
              onClick={handleComplete}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              {t('school.tools.completeButton')}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
