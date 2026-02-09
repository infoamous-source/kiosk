import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import SchoolBottomNav from '../../../components/school/SchoolBottomNav';
import KkakdugiMascot from '../../../components/brand/KkakdugiMascot';
import { MarketingDeptIcon } from '../../../components/brand/SchoolIllustrations';

export default function MarketingSchoolLayout() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-kk-bg pb-20">
      {/* 상단 헤더 */}
      <header className="bg-kk-bg border-b border-kk-warm sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/marketing/hub')}
            className="p-1.5 hover:bg-kk-cream rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-kk-brown/60" />
          </button>
          <div className="flex items-center gap-2">
            <KkakdugiMascot size={20} />
            <MarketingDeptIcon size={20} />
            <h1 className="font-bold text-kk-brown">{t('school.layout.title')}</h1>
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
