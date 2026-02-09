import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { loadSchoolProgress } from '../../../utils/schoolStorage';
import { SCHOOL_CURRICULUM } from '../../../types/school';
import PeriodTimeline from '../../../components/school/PeriodTimeline';
import { Loader2 } from 'lucide-react';

export default function CurriculumTab() {
  const { t } = useTranslation('common');
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;
  if (!user) return null;

  const progress = loadSchoolProgress(user.id);

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
    </div>
  );
}
