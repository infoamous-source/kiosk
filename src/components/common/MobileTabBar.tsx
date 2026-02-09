import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Monitor, TrendingUp, Briefcase, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEnrollments } from '../../contexts/EnrollmentContext';
import type { SchoolId } from '../../types/enrollment';

const tabs = [
  { id: 'home', labelKey: 'sidebar.home', icon: Home, path: '/' },
  { id: 'digital', labelKey: 'sidebar.digitalBasics', icon: Monitor, path: '/track/digital-basics' },
  { id: 'marketing', labelKey: 'sidebar.marketing', icon: TrendingUp, path: '/marketing/hub' },
  { id: 'career', labelKey: 'sidebar.career', icon: Briefcase, path: '/track/career' },
  { id: 'settings', labelKey: 'sidebar.settings', icon: Settings, path: '/settings' },
];

export default function MobileTabBar() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { enrollments } = useEnrollments();

  const isActive = (tab: typeof tabs[0]) => {
    if (tab.path === '/') return location.pathname === '/';
    if (tab.id === 'marketing') return location.pathname.startsWith('/marketing');
    return location.pathname.startsWith(tab.path);
  };

  const handleTabClick = (tab: typeof tabs[0]) => {
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const active = isActive(tab);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                active ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
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
