import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserCircle, Calendar, Wrench } from 'lucide-react';

const tabs = [
  { id: 'attendance', path: '/marketing/school/attendance', icon: UserCircle, labelKey: 'school.nav.attendance' },
  { id: 'curriculum', path: '/marketing/school/curriculum', icon: Calendar, labelKey: 'school.nav.curriculum' },
  { id: 'lab', path: '/marketing/school/lab', icon: Wrench, labelKey: 'school.nav.lab' },
] as const;

export default function SchoolBottomNav() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = tabs.find((tab) => location.pathname.startsWith(tab.path))?.id || 'attendance';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-lg mx-auto flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                isActive
                  ? 'text-purple-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>
                {t(tab.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
