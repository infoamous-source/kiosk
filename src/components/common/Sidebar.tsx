import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Monitor,
  TrendingUp,
  Briefcase,
  BookOpen,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  UserCircle,
} from 'lucide-react';
import type { TrackId } from '../../types/track';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentTrack?: TrackId;
}

interface NavItem {
  id: string;
  labelKey: string;
  icon: typeof Home;
  path: string;
  trackId?: TrackId;
}

const mainNavItems: NavItem[] = [
  { id: 'home', labelKey: 'sidebar.home', icon: Home, path: '/' },
  { id: 'digital', labelKey: 'sidebar.digitalBasics', icon: Monitor, path: '/track/digital-basics', trackId: 'digital-basics' },
  { id: 'marketing', labelKey: 'sidebar.marketing', icon: TrendingUp, path: '/marketing', trackId: 'marketing' },
  { id: 'career', labelKey: 'sidebar.career', icon: Briefcase, path: '/track/career', trackId: 'career' },
];

const bottomNavItems: NavItem[] = [
  { id: 'resources', labelKey: 'sidebar.resources', icon: BookOpen, path: '/resources' },
  { id: 'help', labelKey: 'sidebar.help', icon: HelpCircle, path: '/help' },
  { id: 'settings', labelKey: 'sidebar.settings', icon: Settings, path: '/settings' },
];

export default function Sidebar({ currentTrack }: SidebarProps) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // 강사인지 확인
  const isInstructor = user?.role === 'instructor';

  const isActive = (item: NavItem) => {
    if (item.trackId && currentTrack) {
      return item.trackId === currentTrack;
    }
    // 마케팅 하위 경로 (/marketing/modules/..., /marketing/tools/...) 에서도 활성화
    if (item.path !== '/' && location.pathname.startsWith(item.path)) {
      return true;
    }
    return location.pathname === item.path;
  };

  const NavButton = ({ item }: { item: NavItem }) => {
    const active = isActive(item);
    const Icon = item.icon;

    return (
      <button
        onClick={() => navigate(item.path)}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
          ${active
            ? 'bg-blue-50 text-blue-600 font-semibold'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
          }
          ${collapsed ? 'justify-center' : ''}
        `}
        title={collapsed ? t(item.labelKey) : undefined}
      >
        <Icon className="w-5 h-5 shrink-0" />
        {!collapsed && (
          <span className="truncate">{t(item.labelKey)}</span>
        )}
      </button>
    );
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40
        transition-all duration-300 ease-out hidden md:flex flex-col
        ${collapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* 로고 영역 */}
      <div className={`p-4 border-b border-gray-100 flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-gray-800">Kiosk Seven</h1>
            <p className="text-xs text-gray-400">Education Platform</p>
          </div>
        )}
      </div>

      {/* 메인 내비게이션 */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </nav>

      {/* 내 프로필 버튼 (로그인 시 표시) */}
      {user && (
        <div className="px-3">
          <button
            onClick={() => navigate('/profile')}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${location.pathname === '/profile'
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }
              ${collapsed ? 'justify-center' : ''}
            `}
            title={collapsed ? t('sidebar.profile') : undefined}
          >
            <UserCircle className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <span className="truncate">{t('sidebar.profile', '내 프로필')}</span>
            )}
          </button>
        </div>
      )}

      {/* 강사 전용 대시보드 버튼 */}
      {isInstructor && (
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => navigate('/admin')}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold
              hover:from-purple-600 hover:to-purple-700 shadow-md hover:shadow-lg
              ${collapsed ? 'justify-center' : ''}
            `}
            title={collapsed ? t('sidebar.dashboard') : undefined}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <span className="truncate">{t('sidebar.dashboard')}</span>
            )}
          </button>
        </div>
      )}

      {/* 하단 내비게이션 */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        {bottomNavItems.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}
      </div>

      {/* 접기/펼치기 버튼 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        )}
      </button>
    </aside>
  );
}
