import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Monitor,
  TrendingUp,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import type { Track } from '../../types/track';
import { handleActivityLog } from '../../utils/activityLogger';
import { useAuth } from '../../contexts/AuthContext';

const iconMap: Record<string, typeof Monitor> = {
  Monitor,
  TrendingUp,
  Briefcase,
};

interface TrackCardProps {
  track: Track;
  delay?: number;
}

export default function TrackCard({ track, delay = 0 }: TrackCardProps) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const Icon = iconMap[track.icon] || Monitor;

  const handleClick = () => {
    handleActivityLog('click', track.id, undefined, { source: 'gateway' });

    // 비로그인 시 로그인 페이지로, 선택한 트랙 정보를 state로 전달
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: `/track/${track.id}` } });
    } else {
      navigate(`/track/${track.id}`);
    }
  };

  const colorClasses: Record<string, { bg: string; border: string; text: string; hover: string }> = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200 hover:border-blue-400',
      text: 'text-blue-600',
      hover: 'hover:shadow-blue-200/50',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200 hover:border-purple-400',
      text: 'text-purple-600',
      hover: 'hover:shadow-purple-200/50',
    },
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200 hover:border-emerald-400',
      text: 'text-emerald-600',
      hover: 'hover:shadow-emerald-200/50',
    },
  };

  const colors = colorClasses[track.color] || colorClasses.blue;

  return (
    <button
      onClick={handleClick}
      className={`
        group relative w-full p-8 rounded-3xl border-2 bg-white
        transition-all duration-300 ease-out cursor-pointer text-left
        hover:-translate-y-2 hover:shadow-2xl
        ${colors.border} ${colors.hover}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* 아이콘 영역 */}
      <div className={`w-20 h-20 rounded-2xl ${colors.bg} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
        <Icon className={`w-10 h-10 ${colors.text}`} strokeWidth={1.5} />
      </div>

      {/* 텍스트 영역 */}
      <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
        {t(track.nameKey)}
        <ChevronRight className="w-6 h-6 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-gray-400" />
      </h2>

      <p className="text-gray-500 leading-relaxed mb-6">
        {t(track.descriptionKey)}
      </p>

      {/* 모듈 수 표시 */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.bg} ${colors.text} text-sm font-semibold`}>
        <span>{track.modules.length}</span>
        <span>{t('gateway.modules')}</span>
      </div>

      {/* 호버 시 그라데이션 오버레이 */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${track.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
    </button>
  );
}
