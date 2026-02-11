import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Bus,
  Languages,
  UtensilsCrossed,
  ShoppingCart,
  Plane,
  Shield,
  ExternalLink,
  Smartphone,
  Apple,
  Globe,
  Search,
  Star,
  ChevronDown,
  Check,
  Plus,
} from 'lucide-react';
import { categories, apps } from '../data/apps';
import type { AppItem, Category } from '../types/app';
import RollingBanner from '../components/common/RollingBanner';
import { useActivityLog } from '../hooks/useActivityLog';
import { useInstalledApps } from '../hooks/useInstalledApps';

// 카테고리 아이콘 매핑
const categoryIcons: Record<string, typeof MapPin> = {
  maps: MapPin,
  transport: Bus,
  translation: Languages,
  food: UtensilsCrossed,
  shopping: ShoppingCart,
  travel: Plane,
  safety: Shield,
};

// 배지 스타일
const badgeStyles: Record<string, { bg: string; text: string; label: string }> = {
  'local-essential': {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    label: 'koreaApps.badges.localEssential',
  },
  'foreigner-friendly': {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: 'koreaApps.badges.foreignerFriendly',
  },
  government: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    label: 'koreaApps.badges.government',
  },
};

// 앱 카드 컴포넌트
function AppCard({
  app,
  isInstalled,
  onToggleInstall
}: {
  app: AppItem;
  isInstalled: boolean;
  onToggleInstall: () => void;
}) {
  const { t } = useTranslation('common');
  const { logActivity } = useActivityLog();
  const [showStoreOptions, setShowStoreOptions] = useState(false);

  const handleDownload = (store: 'ios' | 'android' | 'web') => {
    logActivity('click', 'digital-basics', 'db-04', {
      action: 'app_download',
      appId: app.id,
      store,
    });

    const url = app.storeLinks[store];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    setShowStoreOptions(false);
  };

  return (
    <div className={`bg-white rounded-2xl border-2 p-5 transition-all group relative ${
      isInstalled
        ? 'border-green-300 bg-green-50/30'
        : 'border-gray-100 hover:border-blue-200 hover:shadow-lg'
    }`}>
      {/* 설치됨 표시 배지 */}
      {isInstalled && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* 앱 아이콘 */}
        <div className={`w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-md ${
          isInstalled ? 'ring-2 ring-green-400 ring-offset-2' : 'bg-gray-100'
        }`}>
          <img
            src={app.icon}
            alt={t(app.nameKey)}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.koreanName)}&background=3B82F6&color=fff&size=64`;
            }}
          />
        </div>

        {/* 앱 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold transition-colors ${
              isInstalled ? 'text-green-700' : 'text-gray-800 group-hover:text-blue-600'
            }`}>
              {t(app.nameKey)}
            </h3>
            <span className="text-xs text-gray-400 font-medium">{app.koreanName}</span>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
            {t(app.descriptionKey)}
          </p>

          {/* 배지 */}
          {app.badges && app.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {app.badges.map((badge) => {
                const style = badgeStyles[badge];
                return style ? (
                  <span
                    key={badge}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
                  >
                    <Star className="w-3 h-3" />
                    {t(style.label)}
                  </span>
                ) : null;
              })}
            </div>
          )}

          {/* 버튼 그룹 */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* 설치 표시 토글 버튼 */}
            <button
              onClick={onToggleInstall}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isInstalled
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isInstalled ? (
                <>
                  <Check className="w-4 h-4" />
                  {t('koreaApps.installed')}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {t('koreaApps.markInstalled')}
                </>
              )}
            </button>

            {/* 다운로드 버튼 */}
            <div className="relative">
              <button
                onClick={() => setShowStoreOptions(!showStoreOptions)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {t('koreaApps.download')}
                <ChevronDown className={`w-4 h-4 transition-transform ${showStoreOptions ? 'rotate-180' : ''}`} />
              </button>

              {/* 스토어 선택 드롭다운 */}
              {showStoreOptions && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10 min-w-[160px]">
                  {app.storeLinks.ios && (
                    <button
                      onClick={() => handleDownload('ios')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <Apple className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">App Store</span>
                    </button>
                  )}
                  {app.storeLinks.android && (
                    <button
                      onClick={() => handleDownload('android')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <Smartphone className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-700">Google Play</span>
                    </button>
                  )}
                  {app.storeLinks.web && (
                    <button
                      onClick={() => handleDownload('web')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-700">Web</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 카테고리 섹션 컴포넌트
function CategorySection({
  category,
  appList,
  isInstalled,
  toggleInstalled,
}: {
  category: Category;
  appList: AppItem[];
  isInstalled: (id: string) => boolean;
  toggleInstalled: (id: string) => void;
}) {
  const { t } = useTranslation('common');
  const Icon = categoryIcons[category.icon] || MapPin;

  // 설치된 앱 개수 계산
  const installedCount = appList.filter(app => isInstalled(app.id)).length;

  return (
    <section id={category.id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-800">{t(category.nameKey)}</h2>
          <p className="text-sm text-gray-500">{t(category.descriptionKey)}</p>
        </div>
        {/* 설치 현황 */}
        <div className="text-sm text-gray-500">
          <span className="font-semibold text-green-600">{installedCount}</span>
          <span className="mx-1">/</span>
          <span>{appList.length}</span>
          <span className="ml-1">{t('koreaApps.installedCount')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appList.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            isInstalled={isInstalled(app.id)}
            onToggleInstall={() => toggleInstalled(app.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default function KoreaAppsPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { logActivity: logPageActivity } = useActivityLog();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { isInstalled, toggleInstalled, installedApps } = useInstalledApps();

  // 페이지 뷰 로깅
  logPageActivity('view', 'digital-basics', 'db-04', { page: 'korea_apps' });

  // 검색 필터링
  const filteredApps = searchQuery
    ? apps.filter(
        (app) =>
          t(app.nameKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.koreanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t(app.descriptionKey).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : apps;

  // 카테고리별 앱 그룹핑
  const appsByCategory = categories.reduce((acc, cat) => {
    acc[cat.id] = filteredApps.filter((app) => app.categoryId === cat.id);
    return acc;
  }, {} as Record<string, AppItem[]>);

  // 활성 카테고리 필터링
  const displayCategories = activeCategory
    ? categories.filter((cat) => cat.id === activeCategory)
    : categories;

  // 전체 설치 현황
  const totalInstalled = installedApps.length;
  const totalApps = apps.length;

  return (
    <div className="max-w-4xl mx-auto">
      <RollingBanner />

      {/* 헤더 */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/track/digital-basics')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('koreaApps.backToTrack')}
        </button>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{t('koreaApps.title')}</h1>
              <p className="text-blue-100">{t('koreaApps.subtitle')}</p>
            </div>
            {/* 진행 상황 표시 */}
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{totalInstalled}/{totalApps}</div>
              <div className="text-sm text-blue-100">{t('koreaApps.progress')}</div>
              <div className="w-24 h-2 bg-white/30 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${(totalInstalled / totalApps) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 검색 */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('koreaApps.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('koreaApps.allCategories')}
          </button>
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.icon] || MapPin;
            const appCount = appsByCategory[cat.id]?.length || 0;
            if (appCount === 0 && searchQuery) return null;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t(cat.nameKey)}</span>
                {searchQuery && <span className="text-xs opacity-70">({appCount})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 카테고리별 앱 목록 */}
      <div className="space-y-10">
        {displayCategories.map((category) => {
          const categoryApps = appsByCategory[category.id];
          if (!categoryApps || categoryApps.length === 0) return null;

          return (
            <CategorySection
              key={category.id}
              category={category}
              appList={categoryApps}
              isInstalled={isInstalled}
              toggleInstalled={toggleInstalled}
            />
          );
        })}

        {/* 검색 결과 없음 */}
        {searchQuery && filteredApps.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t('koreaApps.noResults')}</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-blue-600 hover:underline"
            >
              {t('koreaApps.clearSearch')}
            </button>
          </div>
        )}
      </div>

      {/* 하단 팁 */}
      <div className="mt-12 bg-gray-50 rounded-2xl p-6">
        <h3 className="font-bold text-gray-800 mb-3">{t('koreaApps.tips.title')}</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            {t('koreaApps.tips.tip1')}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            {t('koreaApps.tips.tip2')}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            {t('koreaApps.tips.tip3')}
          </li>
        </ul>
      </div>
    </div>
  );
}
