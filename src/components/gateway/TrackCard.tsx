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
import { useEnrollments } from '../../contexts/EnrollmentContext';
import type { SchoolId } from '../../types/enrollment';

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
  const { enrollments } = useEnrollments();
  const Icon = iconMap[track.icon] || Monitor;

  const handleClick = () => {
    handleActivityLog('click', track.id, undefined, { source: 'gateway' });

    // 마케팅 → 허브로 이동 (신규/기존 사용자 구분)
    if (track.id === 'marketing') {
      const schoolId: SchoolId = 'marketing';

      // 로그인하지 않은 사용자 → 입학 축하 페이지
      if (!isAuthenticated) {
        navigate('/congrats', { state: { schoolId } });
        return;
      }

      // 로그인했지만 등록 안 된 사용자 → 입학 축하 페이지
      const isEnrolled = enrollments.some(e => e.school_id === schoolId);
      if (!isEnrolled) {
        navigate('/congrats', { state: { schoolId } });
        return;
      }

      // 이미 등록된 사용자 → 바로 허브로
      navigate('/marketing/hub');
      return;
    }

    // 디지털, 취업은 "준비 중" 토스트
    if (track.id === 'digital-basics' || track.id === 'career') {
      const toast = document.createElement('div');
      toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg z-[9999] text-sm font-medium';
      toast.textContent = t('school.comingSoon');
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
      }, 2000);
      return;
    }

    // 기타 트랙 (fallback)
    const targetPath = `/track/${track.id}`;
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: targetPath } });
    } else {
      navigate(targetPath);
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
