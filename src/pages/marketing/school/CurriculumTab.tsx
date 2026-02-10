import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  hasAllStamps, hasStamp,
  isGraduated as checkGraduated, canGraduate,
} from '../../../utils/schoolStorage';
import { CURRICULUM_SECTIONS } from '../../../types/school';
import type { PeriodId, CurriculumSection, CurriculumStep, SectionType } from '../../../types/school';
import {
  ChevronDown, Sparkles, Trophy,
  ClipboardCheck, Radar, Zap, Share2, CalendarCheck, TrendingUp,
  PartyPopper, FileText, Award, BookOpen, GraduationCap,
} from 'lucide-react';
import GraduationModal from '../../../components/school/GraduationModal';

// ─── 아이콘 맵 ───

const iconMap: Record<string, typeof ClipboardCheck> = {
  ClipboardCheck, Radar, Zap, Share2, CalendarCheck, TrendingUp,
  PartyPopper, FileText, Award, BookOpen, GraduationCap,
};

// ─── 섹션 유형별 스타일 ───

const sectionStyles: Record<SectionType, {
  headerBg: string; badge: string; badgeText: string; border: string;
}> = {
  'pre-school': {
    headerBg: 'bg-gradient-to-r from-pink-50 to-rose-50',
    badge: 'bg-pink-100', badgeText: 'text-pink-700', border: 'border-pink-200',
  },
  period: {
    headerBg: 'bg-white',
    badge: 'bg-gray-100', badgeText: 'text-gray-600', border: 'border-gray-200',
  },
  'final-project': {
    headerBg: 'bg-gradient-to-r from-violet-50 to-purple-50',
    badge: 'bg-violet-100', badgeText: 'text-violet-700', border: 'border-violet-200',
  },
  'after-school': {
    headerBg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
    badge: 'bg-amber-100', badgeText: 'text-amber-700', border: 'border-amber-200',
  },
};

// ─── 교시별 색상 맵 ───

const periodColorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    iconBg: 'bg-rose-100' },
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    iconBg: 'bg-blue-100' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   iconBg: 'bg-amber-100' },
  purple:  { bg: 'bg-purple-50',  text: 'text-purple-600',  iconBg: 'bg-purple-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', iconBg: 'bg-emerald-100' },
  orange:  { bg: 'bg-orange-50',  text: 'text-orange-600',  iconBg: 'bg-orange-100' },
  pink:    { bg: 'bg-pink-50',    text: 'text-pink-600',    iconBg: 'bg-pink-100' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  iconBg: 'bg-violet-100' },
};

// ─── 부드러운 아코디언 컴포넌트 ───

function AnimatedAccordion({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.scrollHeight);
  }, [isOpen, children]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ maxHeight: isOpen ? `${height}px` : '0px', opacity: isOpen ? 1 : 0 }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}

// ─── 섹션 배지 라벨 ───

function getSectionBadge(section: CurriculumSection, t: (k: string, d?: string) => string): string {
  if (section.type === 'period') return `${section.period}${t('school.curriculum.period', '교시')}`;
  if (section.id === 'entrance') return 'Pre-School';
  if (section.id === 'final-project') return 'Final Step';
  if (section.id === 'graduation-ceremony') return 'After-School';
  return '';
}

// ─── 메인 컴포넌트 ───

export default function CurriculumTab() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string | null>('entrance');
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [showGraduationModal, setShowGraduationModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) return null; // MarketingSchoolLayout이 이미 auth guard 역할

  const allDone = hasAllStamps(user.id);
  const graduated = checkGraduated(user.id);
  const canGrad = canGraduate(user.id);

  return (
    <div className="space-y-3" key={refreshKey}>
      {/* 헤더 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          📋 {t('school.curriculum.title', '시간표')}
        </h2>
        <p className="text-sm text-gray-500">{t('school.curriculum.subtitle', '예비 마케터 교실 커리큘럼')}</p>
      </div>

      {/* 9개 섹션 */}
      {CURRICULUM_SECTIONS.map((section) => {
        const isExpanded = expandedSection === section.id;
        const styles = section.type === 'period'
          ? { ...sectionStyles.period, ...(periodColorMap[section.color] || {}) }
          : sectionStyles[section.type];
        const colors = periodColorMap[section.color] || periodColorMap.rose;
        const Icon = iconMap[section.icon] || BookOpen;

        // 실습 step의 스탬프 완료 여부
        const practiceStep = section.steps.find(s => s.isPractice);
        const stamped = practiceStep?.periodId
          ? hasStamp(user.id, practiceStep.periodId as PeriodId)
          : false;

        // final-project/graduation-ceremony 잠금 상태
        const isLocked = (section.type === 'final-project' || section.type === 'after-school') && !allDone;

        return (
          <div
            key={section.id}
            className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
              stamped ? 'border-green-200' : styles.border
            } ${isLocked ? 'opacity-60' : ''}`}
          >
            {/* 섹션 헤더 */}
            <button
              onClick={() => setExpandedSection(isExpanded ? null : section.id)}
              className={`w-full p-4 flex items-center gap-3 transition-colors text-left ${
                section.type !== 'period' ? sectionStyles[section.type].headerBg : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors.iconBg || 'bg-gray-100'}`}>
                <Icon className={`w-5 h-5 ${colors.text || 'text-gray-500'}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    stamped ? 'bg-green-100 text-green-700' : `${styles.badge} ${styles.badgeText}`
                  }`}>
                    {getSectionBadge(section, t)}
                  </span>
                  {stamped && <span className="text-green-500 text-sm">✓</span>}
                  {isLocked && <span className="text-xs text-gray-400">🔒</span>}
                </div>
                <h3 className="text-sm font-bold text-gray-800 mt-1 truncate">
                  {t(section.titleKey)}
                </h3>
              </div>

              <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`} />
            </button>

            {/* 섹션 내용 */}
            <AnimatedAccordion isOpen={isExpanded}>
              <div className="border-t border-gray-100 px-4 pb-4">
                <div className="mt-3 space-y-2">
                  {section.steps.map((step) => {
                    const stepKey = `${section.id}-${step.stepNumber}`;
                    const isStepExpanded = expandedStep === stepKey;

                    return (
                      <div key={stepKey} className="bg-gray-50 rounded-xl overflow-hidden">
                        {/* Step 헤더 */}
                        <button
                          onClick={() => setExpandedStep(isStepExpanded ? null : stepKey)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-100 transition-colors"
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            step.isPractice ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {step.stepNumber}
                          </span>
                          <span className="text-sm text-gray-700 flex-1 text-left truncate">
                            {t(step.titleKey)}
                          </span>
                          {step.isPractice ? (
                            <span className="text-[10px] text-purple-600 px-1.5 py-0.5 bg-purple-50 rounded-full font-bold shrink-0">
                              실습
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded-full shrink-0">
                              이론
                            </span>
                          )}
                        </button>

                        {/* Step 상세 (서브 아코디언) */}
                        <AnimatedAccordion isOpen={isStepExpanded}>
                          <div className="px-3 pb-3">
                            <p className="text-xs text-gray-500 mb-2 pl-9">
                              {t(step.descriptionKey)}
                            </p>

                            {/* 실습 step → AI 도구 버튼 */}
                            {step.isPractice && step.toolRoute && (
                              <button
                                onClick={() => navigate(step.toolRoute!)}
                                className="ml-9 flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                AI 도구로 실습하기 →
                              </button>
                            )}

                            {/* 입학식 step3 → 학생증 보기 */}
                            {section.id === 'entrance' && step.stepNumber === 3 && (
                              <button
                                onClick={() => navigate('/profile')}
                                className="ml-9 flex items-center gap-2 px-3 py-2 bg-kk-cream text-kk-brown rounded-lg text-xs font-bold hover:bg-kk-warm transition-colors"
                              >
                                학생증 보기 →
                              </button>
                            )}

                            {/* 졸업과제 step2 → 기획서 페이지 */}
                            {section.id === 'final-project' && step.stepNumber === 2 && (
                              <button
                                onClick={() => navigate('/marketing/school/graduation-project')}
                                disabled={!allDone}
                                className="ml-9 flex items-center gap-2 px-3 py-2 bg-violet-50 text-violet-600 rounded-lg text-xs font-bold hover:bg-violet-100 transition-colors disabled:opacity-50"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                통합 기획서 보기 →
                              </button>
                            )}

                            {/* 졸업식 step1 → 졸업장 수여 */}
                            {section.id === 'graduation-ceremony' && step.stepNumber === 1 && (
                              <div className="ml-9 mt-1">
                                {graduated ? (
                                  <p className="text-green-600 text-xs font-bold flex items-center gap-1">
                                    <Trophy className="w-3.5 h-3.5" /> 졸업 완료!
                                  </p>
                                ) : canGrad ? (
                                  <button
                                    onClick={() => setShowGraduationModal(true)}
                                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                                  >
                                    🎓 졸업하기
                                  </button>
                                ) : (
                                  <p className="text-xs text-gray-400">모든 교시를 완료해야 합니다</p>
                                )}
                              </div>
                            )}
                          </div>
                        </AnimatedAccordion>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimatedAccordion>
          </div>
        );
      })}

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
