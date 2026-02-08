import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import SchoolBottomNav from '../../../components/school/SchoolBottomNav';

export default function MarketingSchoolLayout() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/marketing/hub')}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <h1 className="font-bold text-gray-800">{t('school.layout.title')}</h1>
          </div>
        </div>
      </header>

      {/* 탭 콘텐츠 */}
      <main className="max-w-lg mx-auto px-4 py-4">
        <Outlet />
      </main>

      {/* 하단 탭 네비게이션 */}
      <SchoolBottomNav />
    </div>
  );
}
