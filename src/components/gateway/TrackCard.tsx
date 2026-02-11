import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import type { Track } from '../../types/track';
import { useActivityLog } from '../../hooks/useActivityLog';
import { useAuth } from '../../contexts/AuthContext';
import { useEnrollments } from '../../contexts/EnrollmentContext';
import type { SchoolId } from '../../types/enrollment';
import { DigitalDeptIcon, MarketingDeptIcon, CareerDeptIcon } from '../brand/SchoolIllustrations';

const deptIconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  'digital-basics': DigitalDeptIcon,
  marketing: MarketingDeptIcon,
  career: CareerDeptIcon,
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
  const { logActivity } = useActivityLog();
  const DeptIcon = deptIconMap[track.id] || DigitalDeptIcon;

  const handleClick = () => {
    logActivity('click', track.id, undefined, { source: 'gateway' });

    // 마케팅 → 허브로 이동 (신규/기존 사용자 구분)
    if (track.id === 'marketing') {
      const schoolId: SchoolId = 'marketing';

      if (!isAuthenticated) {
        navigate('/congrats', { state: { schoolId } });
        return;
      }

      const isEnrolled = enrollments.some(e => e.school_id === schoolId);
      if (!isEnrolled) {
        navigate('/congrats', { state: { schoolId } });
        return;
      }

      navigate('/marketing/hub');
      return;
    }

    // 디지털, 취업은 "준비 중" 토스트
    if (track.id === 'digital-basics' || track.id === 'career') {
      const toast = document.createElement('div');
      toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 bg-kk-brown text-kk-cream px-6 py-3 rounded-xl shadow-lg z-[9999] text-sm font-medium';
      toast.textContent = t('school.comingSoon');
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
      }, 2000);
      return;
    }

    const targetPath = `/track/${track.id}`;
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: targetPath } });
    } else {
      navigate(targetPath);
    }
  };

  const colorThemes: Record<string, {
    border: string;
    ribbon: string;
    hoverBg: string;
    textAccent: string;
  }> = {
    blue: {
      border: 'border-blue-200 hover:border-blue-400',
      ribbon: 'bg-blue-500',
      hoverBg: 'group-hover:from-blue-500/5 group-hover:to-blue-400/5',
      textAccent: 'text-blue-600',
    },
    purple: {
      border: 'border-purple-200 hover:border-purple-400',
      ribbon: 'bg-purple-500',
      hoverBg: 'group-hover:from-purple-500/5 group-hover:to-purple-400/5',
      textAccent: 'text-purple-600',
    },
    green: {
      border: 'border-emerald-200 hover:border-emerald-400',
      ribbon: 'bg-emerald-500',
      hoverBg: 'group-hover:from-emerald-500/5 group-hover:to-emerald-400/5',
      textAccent: 'text-emerald-600',
    },
  };

  const theme = colorThemes[track.color] || colorThemes.blue;

  return (
    <button
      onClick={handleClick}
      className={`
        group relative w-full rounded-2xl border-2 bg-white overflow-hidden
        transition-all duration-300 ease-out cursor-pointer text-left
        hover:-translate-y-2 hover:shadow-xl
        ${theme.border}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* 상단 색띠 (교과서 느낌) */}
      <div className={`h-2 ${theme.ribbon}`} />

      {/* 공책 줄 텍스처 */}
      <div className="notebook-lines p-6 pb-5">
        {/* 학과 아이콘 */}
        <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
          <DeptIcon size={52} />
        </div>

        {/* 학과명 */}
        <h2 className="text-xl font-bold text-kk-brown mb-2 flex items-center gap-2">
          {t(track.nameKey)}
          <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-kk-brown/40" />
        </h2>

        {/* 설명 */}
        <p className="text-sm text-kk-brown/60 leading-relaxed">
          {t(track.descriptionKey)}
        </p>
      </div>

      {/* 호버 그라데이션 오버레이 */}
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent ${theme.hoverBg} transition-all duration-300 pointer-events-none`} />
    </button>
  );
}
