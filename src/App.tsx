import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/common/MainLayout';
import GatewayPage from './pages/GatewayPage';
import TrackPage from './pages/TrackPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import OrganizationDetailPage from './pages/OrganizationDetailPage';
import KoreaAppsPage from './pages/KoreaAppsPage';
import MarketingLandingPage from './pages/marketing/MarketingLandingPage';
import MarketingModuleDetailPage from './pages/marketing/MarketingModuleDetailPage';
import MarketingToolRouter from './pages/marketing/MarketingToolRouter';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Gateway (첫 페이지 - 트리오 카드) */}
          <Route path="/" element={<GatewayPage />} />

          {/* 인증 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 강사 전용 대시보드 */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/organization/:refCode" element={<OrganizationDetailPage />} />
          <Route path="/admin/organizations" element={<AdminPage />} />

          {/* 트랙 내부 페이지 (사이드바 레이아웃) */}
          <Route element={<MainLayout />}>
            <Route path="/track/:trackId" element={<TrackPage />} />
            <Route path="/track/digital-basics/korea-apps" element={<KoreaAppsPage />} />

            {/* 마케팅 실무 트랙 */}
            <Route path="/marketing" element={<MarketingLandingPage />} />
            <Route path="/marketing/modules/:moduleId" element={<MarketingModuleDetailPage />} />
            <Route path="/marketing/tools/:toolId" element={<MarketingToolRouter />} />

            <Route path="/resources" element={<div className="text-gray-500">Resources page (Coming soon)</div>} />
            <Route path="/help" element={<div className="text-gray-500">Help page (Coming soon)</div>} />
            <Route path="/settings" element={<div className="text-gray-500">Settings page (Coming soon)</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
