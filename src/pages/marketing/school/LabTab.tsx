import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { loadSchoolProgress } from '../../../utils/schoolStorage';
import { SCHOOL_CURRICULUM } from '../../../types/school';
import ToolCard from '../../../components/school/ToolCard';
import { FlaskConical, GraduationCap, Loader2 } from 'lucide-react';

export default function LabTab() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [graduationMode, setGraduationMode] = useState(false);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;
  if (!user) return null;

  const progress = loadSchoolProgress(user.id);

  // 일반 모드: 5개 AI 도구 (1~5교시)
  // 졸업과제 모드: 6교시 ROAS Simulator
  const regularTools = SCHOOL_CURRICULUM.filter((p) => p.period <= 5);
  const graduationTool = SCHOOL_CURRICULUM.find((p) => p.period === 6);

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-500" />
            {t('school.lab.title')}
          </h2>
          {/* 졸업과제 토글 */}
          <button
            onClick={() => setGraduationMode(!graduationMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              graduationMode
                ? 'bg-orange-100 text-orange-600 border border-orange-200'
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            {t('school.lab.graduationToggle')}
          </button>
        </div>
        <p className="text-sm text-gray-500">
          {graduationMode ? t('school.lab.graduationSubtitle') : t('school.lab.subtitle')}
        </p>
      </div>

      {/* 도구 그리드 */}
      {!graduationMode ? (
        <div className="grid grid-cols-2 gap-3">
          {regularTools.map((period) => {
            const stamp = progress.stamps.find((s) => s.periodId === period.id);
            return (
              <ToolCard
                key={period.id}
                period={period}
                isCompleted={stamp?.completed ?? false}
              />
            );
          })}
        </div>
      ) : (
        /* 졸업과제 모드 */
        graduationTool && (
          <div className="max-w-sm mx-auto">
            <ToolCard
              period={graduationTool}
              isCompleted={progress.stamps.find((s) => s.periodId === graduationTool.id)?.completed ?? false}
              isGraduationProject
            />
            <p className="text-center text-xs text-gray-400 mt-3">
              {t('school.lab.graduationHint')}
            </p>
            {/* 졸업과제 안내 페이지 링크 */}
            <button
              onClick={() => navigate('/marketing/school/graduation-project')}
              className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              {t('school.graduationProject.viewGuide')}
            </button>
          </div>
        )
      )}
    </div>
  );
}
