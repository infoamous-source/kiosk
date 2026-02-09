import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { loadSchoolProgress, hasAllStamps } from '../../../utils/schoolStorage';
import { SCHOOL_CURRICULUM } from '../../../types/school';
import PeriodTimeline from '../../../components/school/PeriodTimeline';
import { Loader2, GraduationCap } from 'lucide-react';

export default function CurriculumTab() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;
  if (!user) return null;

  const progress = loadSchoolProgress(user.id);
  const allDone = hasAllStamps(user.id);

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          📋 {t('school.curriculum.title')}
        </h2>
        <p className="text-sm text-gray-500">{t('school.curriculum.subtitle')}</p>
      </div>

      {/* 시간표 타임라인 */}
      <PeriodTimeline periods={SCHOOL_CURRICULUM} stamps={progress.stamps} />

      {/* 졸업과제 카드 */}
      <button
        onClick={() => navigate('/marketing/school/graduation-project')}
        className={`w-full rounded-2xl border p-5 text-left transition-all ${
          allDone
            ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300'
            : 'bg-gray-50 border-gray-200 opacity-70'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            allDone ? 'bg-purple-100' : 'bg-gray-200'
          }`}>
            <GraduationCap className={`w-5 h-5 ${allDone ? 'text-purple-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{t('school.graduationProject.cardTitle')}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {allDone ? t('school.graduationProject.cardReady') : t('school.graduationProject.cardLocked')}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
