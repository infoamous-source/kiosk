import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { tracks } from '../data/tracks';
import { getModuleContent } from '../data/digital/modules';
import { useDigitalProgress } from '../hooks/useDigitalProgress';
import LearningGoals from '../components/digital/LearningGoals';
import PreparationChecklist from '../components/digital/PreparationChecklist';
import LearningContent from '../components/digital/LearningContent';
import TipsSection from '../components/digital/TipsSection';
import PracticeSection from '../components/digital/PracticeSection';
import RelatedApps from '../components/digital/RelatedApps';

export default function DigitalModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    toggleStep,
    togglePractice,
    getModuleProgress,
    getModuleCompletionRate,
  } = useDigitalProgress();

  const digitalTrack = tracks.find((track) => track.id === 'digital-basics');
  const currentModule = digitalTrack?.modules.find((m) => m.id === moduleId);
  const currentIndex = digitalTrack?.modules.findIndex((m) => m.id === moduleId) ?? -1;
  const nextModule = digitalTrack?.modules[currentIndex + 1];

  const content = moduleId ? getModuleContent(moduleId) : undefined;
  const progress = moduleId ? getModuleProgress(moduleId) : undefined;

  if (!currentModule || !digitalTrack) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">모듈을 찾을 수 없습니다</h1>
          <button
            onClick={() => navigate('/track/digital-basics')}
            className="text-blue-600 hover:text-blue-700"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const completionRate = content && moduleId
    ? getModuleCompletionRate(moduleId, content.steps.length, content.practices.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/track/digital-basics')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>{t('digital.common.backToTrack', '디지털 기초로 돌아가기')}</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t(currentModule.titleKey)}
              </h1>
              {currentModule.session && (
                <p className="text-sm text-gray-600">{currentModule.session}</p>
              )}
            </div>
          </div>

          <p className="text-gray-600 mt-2">
            {t(currentModule.descriptionKey)}
          </p>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={16} />
              <span>{currentModule.duration}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <BookOpen size={16} />
              <span>{content ? content.steps.length : currentModule.lessons}개 학습</span>
            </div>
            {completionRate > 0 && (
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {completionRate}% 완료
              </span>
            )}
          </div>

          {/* Module progress bar */}
          {content && (
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {content && progress ? (
          <>
            <LearningGoals
              goals={content.goals}
              completedGoals={progress.completedSteps.filter((s) => s.startsWith('goal-'))}
              onToggle={(goalId) => moduleId && toggleStep(moduleId, goalId)}
            />

            <PreparationChecklist items={content.preparation} />

            <LearningContent
              steps={content.steps}
              completedSteps={progress.completedSteps}
              onCompleteStep={(stepId) => moduleId && toggleStep(moduleId, stepId)}
            />

            <TipsSection tips={content.tips} />

            <PracticeSection
              practices={content.practices}
              completedPractices={progress.completedPractices}
              onCompletePractice={(practiceId) => moduleId && togglePractice(moduleId, practiceId)}
              moduleId={moduleId}
            />

            <RelatedApps appIds={content.relatedAppIds} />
          </>
        ) : (
          <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              📖 학습 내용
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <p className="text-gray-600 mb-2">상세 학습 콘텐츠는 곧 추가될 예정입니다</p>
              <p className="text-sm text-gray-500">교안 기반의 단계별 가이드를 준비 중입니다</p>
            </div>
          </section>
        )}

        {/* 다음 모듈 버튼 */}
        {nextModule && (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate(`/track/digital-basics/module/${nextModule.id}`)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all border-b-4 border-blue-700 active:scale-[0.98]"
            >
              {t('digital.common.nextModule', '다음 모듈')}: {t(nextModule.titleKey)} →
            </button>
          </div>
        )}

        {!nextModule && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-green-900 mb-2">🎉 모든 모듈 완료!</h3>
            <p className="text-green-700 mb-4">디지털 기초 과정을 모두 마쳤습니다</p>
            <button
              onClick={() => navigate('/track/digital-basics')}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              트랙 페이지로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
