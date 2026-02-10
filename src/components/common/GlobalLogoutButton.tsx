import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Home, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 모든 페이지에 표시되는 플로팅 로그아웃 버튼.
 * - 로그인 상태에서만 렌더링
 * - 로그인/회원가입/MainLayout 하위 페이지에서는 숨김 (TopHeader에 이미 로그아웃 있음)
 * - 오른쪽 상단 고정 위치
 */

// MainLayout이 적용되는 경로 (TopHeader에 이미 로그아웃 있음)
const MAIN_LAYOUT_PATHS = ['/track', '/profile', '/resources', '/help', '/settings'];
const LEGACY_MARKETING_PATHS = ['/marketing/modules', '/marketing/tools'];
// 숨겨야 할 인증 관련 경로
const AUTH_PATHS = ['/login', '/register', '/register-complete', '/congrats', '/ai-welcome'];

function shouldHideButton(pathname: string): boolean {
  // 인증 페이지
  if (AUTH_PATHS.some((p) => pathname.startsWith(p))) return true;
  // MainLayout 하위 (TopHeader가 있음)
  if (MAIN_LAYOUT_PATHS.some((p) => pathname.startsWith(p))) return true;
  // 레거시 마케팅 (MainLayout 내부)
  if (LEGACY_MARKETING_PATHS.some((p) => pathname.startsWith(p))) return true;
  // /marketing 정확히 (리다이렉트)
  if (pathname === '/marketing') return true;
  return false;
}

export default function GlobalLogoutButton() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 클릭 외부 감지
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 페이지 이동 시 메뉴 닫기
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // 비로그인 또는 숨겨야 할 경로
  if (!isAuthenticated || !user) return null;
  if (shouldHideButton(location.pathname)) return null;

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  const handleHome = () => {
    setMenuOpen(false);
    navigate('/');
  };

  const handleDashboard = () => {
    setMenuOpen(false);
    navigate('/admin');
  };

  return (
    <div ref={menuRef} className="fixed top-4 right-4 z-[9999]">
      {/* 아바타 버튼 */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-10 h-10 bg-gradient-to-br from-kk-cream to-kk-peach rounded-full flex items-center justify-center border-2 border-kk-warm shadow-md hover:shadow-lg transition-shadow"
        aria-label="User menu"
      >
        <span className="text-kk-brown text-sm font-bold">
          {user.name ? user.name[0].toUpperCase() : '?'}
        </span>
      </button>

      {/* 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-kk-warm py-2 min-w-[200px]">
          {/* 사용자 정보 */}
          <div className="px-4 py-2.5 border-b border-kk-warm/50">
            <p className="text-sm font-semibold text-kk-brown truncate">{user.name}</p>
            <p className="text-xs text-kk-brown/40 truncate">{user.email}</p>
            <span
              className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                user.role === 'instructor'
                  ? 'bg-kk-red/10 text-kk-red-deep'
                  : 'bg-kk-cream text-kk-brown'
              }`}
            >
              {user.role === 'instructor' ? t('header.instructor') : t('header.student')}
            </span>
          </div>

          {/* 홈으로 */}
          <button
            onClick={handleHome}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-kk-brown/70 hover:bg-kk-cream/40 transition-colors"
          >
            <Home className="w-4 h-4" />
            {t('nav.home', '홈으로')}
          </button>

          {/* 강사 대시보드 (강사만) */}
          {user.role === 'instructor' && (
            <button
              onClick={handleDashboard}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-kk-brown/70 hover:bg-kk-cream/40 transition-colors"
            >
              <Settings className="w-4 h-4" />
              {t('header.dashboard')}
            </button>
          )}

          {/* 로그아웃 */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-kk-red hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('header.logout')}
          </button>
        </div>
      )}
    </div>
  );
}
