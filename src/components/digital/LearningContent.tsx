import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  BookOpen,
  Target,
  Table,
  CheckCircle2,
} from 'lucide-react';
import type { LearningStep } from '../../types/digital';

interface Props {
  steps: LearningStep[];
  completedSteps: string[];
  onCompleteStep: (stepId: string) => void;
}

const typeConfig = {
  guide: {
    icon: BookOpen,
    color: 'blue',
    label: 'digital.common.stepGuide',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
  },
  practice: {
    icon: Target,
    color: 'orange',
    label: 'digital.common.stepPractice',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-700',
  },
  reference: {
    icon: Table,
    color: 'purple',
    label: 'digital.common.stepReference',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
  },
};

export default function LearningContent({ steps, completedSteps, onCompleteStep }: Props) {
  const { t } = useTranslation();
  const [openSteps, setOpenSteps] = useState<Set<string>>(
    new Set(steps.length > 0 ? [steps[0].id] : []),
  );

  const toggleOpen = (stepId: string) => {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>📖</span>
        {t('digital.common.learningContent', '학습 내용')}
      </h2>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const isOpen = openSteps.has(step.id);
          const isCompleted = completedSteps.includes(step.id);
          const config = typeConfig[step.type];
          const TypeIcon = config.icon;

          return (
            <div
              key={step.id}
              className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                isCompleted
                  ? 'border-green-200 bg-green-50/30'
                  : `${config.border} bg-white`
              }`}
            >
              {/* Header */}
              <button
                onClick={() => toggleOpen(step.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50/50 transition-colors"
              >
                {/* Step number / check */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : `${config.badge}`
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : i + 1}
                </div>

                {/* Title & type badge */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${config.badge}`}>
                      {t(config.label)}
                    </span>
                  </div>
                  <p className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                    {t(step.titleKey, `스텝 ${i + 1}`)}
                  </p>
                </div>

                {/* Expand icon */}
                <ChevronDown
                  size={20}
                  className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Content */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-4 pt-0">
                  {/* Description */}
                  <div className={`p-4 rounded-xl ${config.bg} mb-4`}>
                    <div className="flex items-start gap-2">
                      <TypeIcon size={18} className={config.text} />
                      <p className={`text-sm leading-relaxed ${config.text}`}>
                        {t(step.descriptionKey, '')}
                      </p>
                    </div>
                  </div>

                  {/* Substeps */}
                  {step.substeps && step.substeps.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {step.substeps.map((substepKey, j) => (
                        <div
                          key={j}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <span className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-medium text-gray-500">
                            {j + 1}
                          </span>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {t(substepKey, '')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Complete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompleteStep(step.id);
                    }}
                    className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isCompleted
                        ? 'bg-green-100 text-green-700 border-2 border-green-200'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg active:scale-[0.98] border-b-4 border-blue-700'
                    }`}
                  >
                    {isCompleted
                      ? `✅ ${t('digital.common.completed', '완료됨')}`
                      : t('digital.common.markComplete', '학습 완료')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
