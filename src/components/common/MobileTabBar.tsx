import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Monitor, TrendingUp, Briefcase, Settings } from 'lucide-react';

const tabs = [
  { id: 'home', labelKey: 'sidebar.home', icon: Home, path: '/' },
  { id: 'digital', labelKey: 'sidebar.digitalBasics', icon: Monitor, path: '/track/digital-basics' },
  { id: 'marketing', labelKey: 'sidebar.marketing', icon: TrendingUp, path: '/marketing' },
  { id: 'career', labelKey: 'sidebar.career', icon: Briefcase, path: '/track/career' },
  { id: 'settings', labelKey: 'sidebar.settings', icon: Settings, path: '/settings' },
];

export default function MobileTabBar() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
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
