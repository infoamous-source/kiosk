import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap,
  Briefcase,
  Lock,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isGraduated, isProAccessValid, getProRemainingDays } from '../../utils/schoolStorage';
import { isGeminiConnected } from '../../components/marketing/AIAssistantConnect';
import CountdownBadge from '../../components/school/CountdownBadge';

export default function MarketingHubPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;

  const graduated = user ? isGraduated(user.id) : false;
  const proValid = user ? isProAccessValid(user.id) : false;
  const remainingDays = user ? getProRemainingDays(user.id) : 0;

  const handleSchoolClick = () => {
    // API 미연결 → AI 비서 연결 페이지 먼저 보여주기
    if (!isGeminiConnected()) {
      navigate('/marketing/school/ai-setup');
    } else {
      navigate('/marketing/school/attendance');
    }
  };

  const handleProClick = () => {
    if (!graduated) {
      alert(t('school.hub.proLocked'));
      return;
    }
    if (!proValid) {
      alert(t('school.hub.proExpired'));
      return;
    }
    navigate('/marketing/pro');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 헤더 */}
      <header className="py-4 px-4 sm:py-6 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t('school.hub.backToLobby')}</span>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>{t('school.hub.badge')}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              {t('school.hub.title')}
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              {t('school.hub.description')}
            </p>
          </div>
        </div>
      </header>

      {/* 카드 그리드 */}
      <section className="pb-24 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 카드 A: 예비 마케터 학교 */}
          <button
            onClick={handleSchoolClick}
            className="group relative w-full p-8 rounded-3xl border-2 border-purple-200 hover:border-purple-400 bg-white
              transition-all duration-300 ease-out cursor-pointer text-left
              hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-200/50"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
              <GraduationCap className="w-10 h-10 text-purple-600" strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              {t('school.hub.schoolTitle')}
              <ChevronRight className="w-6 h-6 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-gray-400" />
            </h2>

            <p className="text-gray-500 leading-relaxed mb-6">
              {t('school.hub.schoolDescription')}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-600 text-sm font-semibold">
              <span>📚</span>
              <span>{t('school.hub.schoolBadge')}</span>
            </div>

            {/* 졸업 완료 배지 */}
            {graduated && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                ✅ {t('school.hub.graduated')}
              </div>
            )}

            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
          </button>

          {/* 카드 B: 전문 마케터 Pro 도구 */}
          <button
            onClick={handleProClick}
            className={`group relative w-full p-8 rounded-3xl border-2 bg-white
              transition-all duration-300 ease-out cursor-pointer text-left
              ${graduated && proValid
                ? 'border-amber-300 hover:border-amber-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-200/50'
                : 'border-gray-200 opacity-80'
              }`}
          >
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${
              graduated && proValid
                ? 'bg-gradient-to-br from-amber-100 to-yellow-100'
                : 'bg-gray-100'
            }`}>
              {graduated && proValid ? (
                <Briefcase className="w-10 h-10 text-amber-600" strokeWidth={1.5} />
              ) : (
                <Lock className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              {t('school.hub.proTitle')}
              {graduated && proValid && (
                <ChevronRight className="w-6 h-6 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-gray-400" />
              )}
            </h2>

            <p className="text-gray-500 leading-relaxed mb-6">
              {graduated && proValid
                ? t('school.hub.proDescriptionUnlocked')
                : t('school.hub.proDescriptionLocked')
              }
            </p>

            {/* 상태 배지 */}
            {graduated && proValid ? (
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-600 text-sm font-semibold">
                  <span>🔓</span>
                  <span>{t('school.hub.proBadge')}</span>
                </div>
                <CountdownBadge days={remainingDays} />
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-500 text-sm font-semibold">
                <Lock className="w-4 h-4" />
                <span>{t('school.hub.proLockedBadge')}</span>
              </div>
            )}

            {graduated && proValid && (
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
