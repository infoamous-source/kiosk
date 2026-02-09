import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  Radar,
  Zap,
  Share2,
  CalendarCheck,
  TrendingUp,
  Check,
  ChevronRight,
} from 'lucide-react';
import type { SchoolPeriod, StampProgress } from '../../types/school';

interface PeriodTimelineProps {
  periods: SchoolPeriod[];
  stamps: StampProgress[];
}

const iconMap: Record<string, typeof ClipboardCheck> = {
  ClipboardCheck,
  Radar,
  Zap,
  Share2,
  CalendarCheck,
  TrendingUp,
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
};

export default function PeriodTimeline({ periods, stamps }: PeriodTimelineProps) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <div className="space-y-0">
      {periods.map((period, index) => {
        const stamp = stamps.find((s) => s.periodId === period.id);
        const isCompleted = stamp?.completed ?? false;
        const Icon = iconMap[period.icon] || ClipboardCheck;
        const colors = colorMap[period.color] || colorMap.blue;
        const isLast = index === periods.length - 1;

        return (
          <div key={period.id} className="relative flex gap-4">
            {/* 타임라인 도트 + 라인 */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                isCompleted
                  ? 'bg-green-500 border-green-500 text-white'
                  : `${colors.bg} ${colors.border} ${colors.text}`
              }`}>
                {isCompleted ? (
                  <Check className="w-5 h-5" strokeWidth={3} />
                ) : (
                  <span className="text-sm font-bold">{period.period}</span>
                )}
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-[24px] ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}`} />
              )}
            </div>

            {/* 카드 */}
            <button
              onClick={() => navigate(`/marketing/school/periods/${period.id}`)}
              className={`flex-1 mb-3 p-4 rounded-xl border transition-all text-left group hover:shadow-md ${
                isCompleted
                  ? 'bg-green-50/50 border-green-200'
                  : `bg-white ${colors.border}`
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isCompleted ? 'bg-green-100 text-green-600' : `${colors.bg} ${colors.text}`
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isCompleted ? 'text-green-600' : colors.text}`}>
                        {period.period}{t('school.curriculum.period')}
                      </span>
                      {isCompleted && (
                        <span className="text-xs text-green-500 font-medium">✅ {t('school.curriculum.completed')}</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm">{t(period.nameKey)}</h4>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-11">{t(period.descriptionKey)}</p>
            </button>
          </div>
        );
      })}
    </div>
  );
}
