import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEnrollments } from '../../contexts/EnrollmentContext';
import type { SchoolId } from '../../types/enrollment';
import {
  SchoolBellIcon,
  DigitalDeptIcon,
  MarketingDeptIcon,
  CareerDeptIcon,
} from '../brand/SchoolIllustrations';

interface TabDef {
  id: string;
  labelKey: string;
  svgIcon?: React.FC<{ size?: number; className?: string }>;
  lucideIcon?: typeof Settings;
  path: string;
}

const tabs: TabDef[] = [
  { id: 'home', labelKey: 'sidebar.home', svgIcon: SchoolBellIcon, path: '/' },
  { id: 'digital', labelKey: 'sidebar.digitalBasics', svgIcon: DigitalDeptIcon, path: '/track/digital-basics' },
  { id: 'marketing', labelKey: 'sidebar.marketing', svgIcon: MarketingDeptIcon, path: '/marketing/hub' },
  { id: 'career', labelKey: 'sidebar.career', svgIcon: CareerDeptIcon, path: '/track/career' },
  { id: 'settings', labelKey: 'sidebar.settings', lucideIcon: Settings, path: '/settings' },
];

export default function MobileTabBar() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { enrollments } = useEnrollments();

  const isActive = (tab: TabDef) => {
    if (tab.path === '/') return location.pathname === '/';
    if (tab.id === 'marketing') return location.pathname.startsWith('/marketing');
    return location.pathname.startsWith(tab.path);
  };

  const handleTabClick = (tab: TabDef) => {
    // 마케팅 탭 → 인증/등록 분기
    if (tab.id === 'marketing') {
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
    navigate(tab.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-kk-bg border-t border-kk-warm md:hidden">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const active = isActive(tab);
          const SvgIcon = tab.svgIcon;
          const LucideIcon = tab.lucideIcon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active ? 'text-kk-red-deep' : 'text-kk-brown/40'
              }`}
            >
              {SvgIcon ? (
                <SvgIcon size={20} />
              ) : LucideIcon ? (
                <LucideIcon className="w-5 h-5" />
              ) : null}
              <span className="text-[10px] mt-0.5 font-medium leading-tight">
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
