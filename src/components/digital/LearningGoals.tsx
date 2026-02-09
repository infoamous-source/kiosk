import { useTranslation } from 'react-i18next';
import { CheckCircle2, Circle } from 'lucide-react';

interface Props {
  goals: string[];
  completedGoals: string[];
  onToggle: (index: string) => void;
}

export default function LearningGoals({ goals, completedGoals, onToggle }: Props) {
  const { t } = useTranslation();
  const completedCount = completedGoals.length;

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle2 size={20} className="text-blue-600" />
          {t('digital.common.learningGoals', '학습 목표')}
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {t('digital.common.progress', { current: completedCount, total: goals.length })}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${goals.length > 0 ? (completedCount / goals.length) * 100 : 0}%` }}
        />
      </div>

      <div className="space-y-3">
        {goals.map((goalKey, i) => {
          const goalId = `goal-${i}`;
          const isCompleted = completedGoals.includes(goalId);
          return (
            <button
              key={i}
              onClick={() => onToggle(goalId)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                isCompleted
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-100 hover:bg-blue-50 hover:border-blue-200'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5 transition-transform duration-200 scale-110" />
              ) : (
                <Circle size={20} className="text-gray-300 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${isCompleted ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                {t(goalKey, `학습 목표 ${i + 1}`)}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
