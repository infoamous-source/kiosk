import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building2,
  GraduationCap,
  CreditCard,
  Clock,
  Lightbulb,
  Shield,
  Globe,
  CalendarDays,
} from 'lucide-react';
import IdeaBox from '../components/profile/IdeaBox';
import ActivityHistory from '../components/profile/ActivityHistory';

type ProfileTab = 'info' | 'activity' | 'ideabox';

export default function ProfilePage() {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 text-lg">{t('profile.loginRequired', '프로필을 보려면 로그인이 필요합니다.')}</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 text-blue-600 hover:underline"
        >
          {t('auth.loginButton')}
        </button>
      </div>
    );
  }

  const tabs: { id: ProfileTab; labelKey: string; icon: typeof User }[] = [
    { id: 'info', labelKey: 'profile.tabs.info', icon: User },
    { id: 'activity', labelKey: 'profile.tabs.activity', icon: Clock },
    { id: 'ideabox', labelKey: 'profile.tabs.ideaBox', icon: Lightbulb },
  ];

  // 구독 상태 라벨
  const getSubscriptionLabel = () => {
    if (!user.subscription || user.subscription.status === 'none') {
      return t('profile.subscription.none', '미구독');
    }
    if (user.subscription.type === 'organization') {
      return t('profile.subscription.organization', '기관 구독');
    }
    return t('profile.subscription.individual', '개인 구독');
  };

  const getSubscriptionColor = () => {
    if (!user.subscription || user.subscription.status === 'none') return 'text-gray-400 bg-gray-50';
    if (user.subscription.status === 'expired') return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  // 성별 라벨
  const getGenderLabel = () => {
    if (!user.gender) return t('profile.notSet', '미설정');
    const genderMap: Record<string, string> = {
      male: t('profile.gender.male', '남성'),
      female: t('profile.gender.female', '여성'),
      other: t('profile.gender.other', '기타'),
    };
    return genderMap[user.gender] || user.gender;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 프로필 헤더 카드 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-white/80">{user.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${
                user.role === 'instructor'
                  ? 'bg-yellow-400/20 text-yellow-100'
                  : 'bg-white/20 text-white'
              }`}>
                {user.role === 'instructor' ? t('header.instructor') : t('header.student')}
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-white/20">
                {getSubscriptionLabel()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'info' && (
        <div className="space-y-4">
          {/* 개인 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              {t('profile.personalInfo', '개인 정보')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow
                label={t('auth.name')}
                value={user.name}
              />
              <InfoRow
                label={t('auth.email')}
                value={user.email}
              />
              <InfoRow
                label={t('profile.age', '나이')}
                value={user.age ? `${user.age}${t('profile.ageSuffix', '세')}` : t('profile.notSet', '미설정')}
              />
              <InfoRow
                label={t('profile.gender.label', '성별')}
                value={getGenderLabel()}
              />
              <InfoRow
                label={t('profile.country', '국적')}
                value={user.country || t('profile.notSet', '미설정')}
                icon={<Globe className="w-4 h-4 text-gray-400" />}
              />
              <InfoRow
                label={t('profile.joinDate', '가입일')}
                value={new Date(user.createdAt).toLocaleDateString('ko-KR')}
                icon={<CalendarDays className="w-4 h-4 text-gray-400" />}
              />
            </div>
          </div>

          {/* 소속 & 강사 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-500" />
              {t('profile.affiliationInfo', '소속 정보')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow
                label={t('auth.organization')}
                value={user.organization || t('profile.notSet', '미설정')}
                icon={<Building2 className="w-4 h-4 text-gray-400" />}
              />
              <InfoRow
                label={t('profile.instructorCode', '강사코드')}
                value={user.instructorCode || t('profile.notSet', '미설정')}
                icon={<GraduationCap className="w-4 h-4 text-gray-400" />}
                mono
              />
              <InfoRow
                label={t('profile.orgCode', '기관코드')}
                value={user.orgCode || t('profile.noOrg', '개인')}
                icon={<Shield className="w-4 h-4 text-gray-400" />}
                mono
              />
              <InfoRow
                label={t('auth.learningPurpose')}
                value={user.learningPurpose
                  ? t(`auth.purpose.${user.learningPurpose}`, user.learningPurpose)
                  : t('profile.notSet', '미설정')
                }
              />
            </div>
          </div>

          {/* 구독 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-500" />
              {t('profile.subscriptionInfo', '구독 정보')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500">{t('profile.subscription.typeLabel', '구독 유형')}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSubscriptionColor()}`}>
                  {getSubscriptionLabel()}
                </span>
              </div>
              <InfoRow
                label={t('profile.subscription.statusLabel', '상태')}
                value={
                  user.subscription?.status === 'active'
                    ? t('profile.subscription.active', '활성')
                    : user.subscription?.status === 'expired'
                    ? t('profile.subscription.expired', '만료')
                    : t('profile.subscription.inactive', '없음')
                }
              />
              {user.subscription?.startDate && (
                <InfoRow
                  label={t('profile.subscription.startDate', '시작일')}
                  value={new Date(user.subscription.startDate).toLocaleDateString('ko-KR')}
                />
              )}
              {user.subscription?.endDate && (
                <InfoRow
                  label={t('profile.subscription.endDate', '종료일')}
                  value={new Date(user.subscription.endDate).toLocaleDateString('ko-KR')}
                />
              )}
            </div>

            {/* 기관코드 히스토리 */}
            {user.subscription?.orgCodeHistory && user.subscription.orgCodeHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">{t('profile.subscription.history', '이전 기관 기록')}</p>
                <div className="flex gap-2 flex-wrap">
                  {user.subscription.orgCodeHistory.map((code, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-mono">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'activity' && <ActivityHistory userId={user.id} />}
      {activeTab === 'ideabox' && <IdeaBox userId={user.id} />}
    </div>
  );
}

// ─── 보조 컴포넌트 ───

function InfoRow({
  label,
  value,
  icon,
  mono,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {icon}
        {label}
      </div>
      <span className={`text-sm font-medium text-gray-800 ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
