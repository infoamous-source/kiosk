import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { loadSchoolProgress, hasAllStamps, hasStamp, isGraduated as checkGraduated, canGraduate } from '../../../utils/schoolStorage';
import { SCHOOL_CURRICULUM } from '../../../types/school';
import type { PeriodId } from '../../../types/school';
import {
  Loader2, GraduationCap, ChevronDown, ChevronUp, Sparkles, Trophy,
  ClipboardCheck, Radar, Zap, Share2, CalendarCheck, TrendingUp,
} from 'lucide-react';
import GraduationModal from '../../../components/school/GraduationModal';

const iconMap: Record<string, typeof ClipboardCheck> = {
  ClipboardCheck, Radar, Zap, Share2, CalendarCheck, TrendingUp,
};

const colorMap: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', gradient: 'from-rose-500 to-pink-500' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-cyan-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', gradient: 'from-amber-500 to-yellow-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', gradient: 'from-purple-500 to-pink-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', gradient: 'from-emerald-500 to-teal-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', gradient: 'from-orange-500 to-red-500' },
};

/** i18n에서 교시별 데이터 가져오기 헬퍼 */

export default function CurriculumTab() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [expandedPeriod, setExpandedPeriod] = useState<number | null>(1);
  const [showGraduationModal, setShowGraduationModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-kk-red" /></div>;
  if (!user) return <div className="text-center py-12 text-kk-brown/60">로그인이 필요합니다</div>;

  const progress = loadSchoolProgress(user.id);
  const allDone = hasAllStamps(user.id);
  const graduated = checkGraduated(user.id);
  const canGrad = canGraduate(user.id);

  const togglePeriod = (period: number) => {
    setExpandedPeriod(expandedPeriod === period ? null : period);
  };

  return (
    <div className="space-y-4" key={refreshKey}>
      {/* 헤더 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          📋 {t('school.curriculum.title', '시간표')}
        </h2>
        <p className="text-sm text-gray-500">{t('school.curriculum.subtitle', '예비 마케터 교실 커리큘럼')}</p>
      </div>

      {/* 교시별 카드 */}
      {SCHOOL_CURRICULUM.map((period) => {
        const colors = colorMap[period.color] || colorMap.blue;
        const Icon = iconMap[period.icon] || ClipboardCheck;
        const isExpanded = expandedPeriod === period.period;
        const stamped = hasStamp(user.id, period.id as PeriodId);
        const items = t(`school.curriculum.periods.${period.period}.items`, { returnObjects: true }) as string[];
        const toolLabel = t(`school.curriculum.periods.${period.period}.toolLabel`, '');
        const periodTitle = t(`school.curriculum.periods.${period.period}.title`, t(period.nameKey));

        return (
          <div
            key={period.id}
            className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
              stamped ? 'border-green-200' : 'border-gray-200'
            }`}
          >
            {/* 교시 헤더 (클릭 가능) */}
            <button
              onClick={() => togglePeriod(period.period)}
              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${colors.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    stamped ? 'bg-green-100 text-green-700' : `${colors.bg} ${colors.text}`
                  }`}>
                    {period.period}{t('school.curriculum.period', '교시')}
                  </span>
                  {stamped && <span className="text-green-500 text-sm">✓</span>}
                </div>
                <h3 className="text-sm font-bold text-gray-800 mt-1 truncate">{periodTitle}</h3>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
              )}
            </button>

            {/* 교시 하위항목 (펼침) */}
            {isExpanded && (
              <div className="border-t border-gray-100 px-4 pb-4">
                {/* 하위 학습 항목 */}
                <div className="mt-3 space-y-2">
                  {(Array.isArray(items) ? items : []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
                      <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-gray-700 flex-1">{item}</span>
                      <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">
                        {t('school.curriculum.testLabel', '학습')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* AI 도구 실습 버튼 */}
                <button
                  onClick={() => navigate(period.toolRoute)}
                  className={`w-full mt-3 p-3.5 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-between group hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-bold">
                      {t('school.curriculum.aiToolPractice', 'AI 도구로 실습')} → {toolLabel}
                    </span>
                  </div>
                  <span className="text-xs opacity-60 group-hover:opacity-100">→</span>
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* 졸업 과제 카드 */}
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
            <p className="text-sm font-bold text-gray-800">🎓 {t('school.curriculum.graduationProject', '졸업 과제')}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {allDone ? t('school.graduationProject.cardReady') : t('school.graduationProject.cardLocked')}
            </p>
          </div>
        </div>
      </button>

      {/* 졸업식 카드 */}
      <div className={`rounded-2xl border p-5 ${
        graduated
          ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
          : allDone
            ? 'bg-white border-purple-200'
            : 'bg-gray-50 border-gray-200 opacity-70'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            graduated ? 'bg-amber-100' : allDone ? 'bg-purple-100' : 'bg-gray-200'
          }`}>
            <Trophy className={`w-5 h-5 ${graduated ? 'text-amber-600' : allDone ? 'text-purple-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">🎉 {t('school.curriculum.graduationCeremony', '졸업식')}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {graduated
                ? t('school.attendance.alreadyGraduated', '졸업 완료!')
                : allDone
                  ? t('school.attendance.readyToGraduate', '졸업 준비가 완료되었습니다!')
                  : t('school.attendance.notReady', '모든 교시를 완료해야 합니다')
              }
            </p>
          </div>
        </div>

        {graduated ? (
          <div className="text-center py-2">
            <p className="text-green-600 font-bold">{t('school.attendance.congratulations', '축하합니다!')}</p>
          </div>
        ) : canGrad ? (
          <button
            onClick={() => setShowGraduationModal(true)}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            🎓 {t('school.attendance.graduateButton', '졸업하기')}
          </button>
        ) : (
          <div className="text-center py-2">
            <p className="text-xs text-gray-400">{t('school.attendance.notReadyHint', '모든 AI 도구를 1회 이상 사용하세요')}</p>
          </div>
        )}
      </div>

      {/* 졸업 모달 */}
      {showGraduationModal && (
        <GraduationModal
          userId={user.id}
          onClose={() => setShowGraduationModal(false)}
          onComplete={() => {
            setShowGraduationModal(false);
            setRefreshKey(k => k + 1);
          }}
        />
      )}
    </div>
  );
}
