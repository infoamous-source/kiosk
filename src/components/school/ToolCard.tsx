import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  Radar,
  Zap,
  Share2,
  CalendarCheck,
  TrendingUp,
  Lock,
  Check,
  ChevronRight,
} from 'lucide-react';
import type { SchoolPeriod } from '../../types/school';

interface ToolCardProps {
  period: SchoolPeriod;
  isCompleted: boolean;
  isLocked?: boolean;
  isGraduationProject?: boolean;
}

const iconMap: Record<string, typeof ClipboardCheck> = {
  ClipboardCheck,
  Radar,
  Zap,
  Share2,
  CalendarCheck,
  TrendingUp,
};

const bgGradients: Record<string, string> = {
  rose: 'from-rose-500 to-pink-500',
  blue: 'from-blue-500 to-cyan-500',
  amber: 'from-amber-500 to-yellow-500',
  purple: 'from-purple-500 to-violet-500',
  emerald: 'from-emerald-500 to-teal-500',
  orange: 'from-orange-500 to-red-500',
};

export default function ToolCard({ period, isCompleted, isLocked = false, isGraduationProject = false }: ToolCardProps) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const Icon = iconMap[period.icon] || ClipboardCheck;
  const gradient = bgGradients[period.color] || bgGradients.blue;

  const handleClick = () => {
    if (isLocked) return;
    navigate(period.toolRoute);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLocked}
      className={`relative w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 group ${
        isLocked
          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
          : isCompleted
          ? 'border-green-200 bg-green-50/50 hover:shadow-md'
          : 'border-gray-200 bg-white hover:shadow-md hover:-translate-y-1'
      }`}
    >
      {/* 아이콘 */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
        isLocked
          ? 'bg-gray-200 text-gray-400'
          : isCompleted
          ? 'bg-green-100 text-green-600'
          : `bg-gradient-to-br ${gradient} text-white`
      }`}>
        {isLocked ? <Lock className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </div>

      {/* 텍스트 */}
      <div className="flex items-center gap-1 mb-1">
        <span className="text-xs font-bold text-gray-400">{period.period}{t('school.curriculum.period')}</span>
        {isGraduationProject && (
          <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded font-bold">
            {t('school.lab.graduationProject')}
          </span>
        )}
      </div>

      <h4 className="font-semibold text-gray-800 text-sm mb-1">{t(period.nameKey)}</h4>
      <p className="text-xs text-gray-500 line-clamp-2">{t(period.descriptionKey)}</p>

      {/* 완료 배지 */}
      {isCompleted && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}

      {/* 진입 화살표 */}
      {!isLocked && !isCompleted && (
        <ChevronRight className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
      )}
    </button>
  );
}
