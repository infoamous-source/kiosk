import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useEnrollments } from '../contexts/EnrollmentContext';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Building2,
  GraduationCap,
  School,
  Clock,
  Lightbulb,
  Shield,
  Globe,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { SCHOOL_NAMES } from '../types/enrollment';
import IdeaBox from '../components/profile/IdeaBox';
import ActivityHistory from '../components/profile/ActivityHistory';
import KkakdugiMascot from '../components/brand/KkakdugiMascot';
import { isGraduated as checkGraduated } from '../utils/schoolStorage';

type ProfileTab = 'info' | 'activity' | 'ideabox';

export default function ProfilePage() {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-kk-brown/50 text-lg">{t('profile.loginRequired', '프로필을 보려면 로그인이 필요합니다.')}</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 text-kk-red hover:underline"
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

  const { enrollments } = useEnrollments();
  const graduated = checkGraduated(user.id);
  const isMarketingEnrolled = enrollments.some(e => e.school_id === 'marketing' && e.status === 'active');

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
      <div className="bg-gradient-to-r from-kk-cream via-kk-warm to-kk-peach rounded-2xl p-6 mb-6 shadow-lg border border-kk-warm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center backdrop-blur-sm border border-kk-warm">
            <KkakdugiMascot size={36} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-kk-brown">{user.name}</h1>
            <p className="text-kk-brown/50">{user.email}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${
                user.role === 'instructor'
                  ? 'bg-kk-red/10 text-kk-red-deep'
                  : 'bg-white/50 text-kk-brown'
              }`}>
                {user.role === 'instructor' ? t('header.instructor') : t('header.student')}
              </span>
              {isMarketingEnrolled && (
                <span className={`px-3 py-0.5 rounded-full text-xs font-medium ${
                  graduated
                    ? 'bg-kk-gold/20 text-kk-brown font-bold'
                    : 'bg-white/50 text-kk-brown'
                }`}>
                  {graduated ? '🎓 졸업' : '📚 재학 중'}
                </span>
              )}
              <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-white/50 text-kk-brown">
                {enrollments.filter(e => e.status === 'active').length > 0
                  ? `${enrollments.filter(e => e.status === 'active').length}개 학교 등록`
                  : '미등록'}
              </span>
            </div>
          </div>
        </div>

        {/* 교실 바로가기 */}
        {isMarketingEnrolled && (
          <button
            onClick={() => navigate('/marketing/hub')}
            className="mt-3 flex items-center gap-2 px-4 py-2 bg-white/40 hover:bg-white/60 rounded-xl transition-colors text-sm font-medium text-kk-brown"
          >
            <School className="w-4 h-4" />
            <span>{t('profile.goToClassroom', '교실로 이동하기')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 bg-kk-cream p-1 rounded-xl mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-kk-red-deep shadow-sm'
                  : 'text-kk-brown/50 hover:text-kk-brown'
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
          <div className="bg-white rounded-xl border border-kk-warm p-5">
            <h2 className="text-lg font-semibold text-kk-brown mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-kk-red" />
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
                icon={<Globe className="w-4 h-4 text-kk-brown/30" />}
              />
              <InfoRow
                label={t('profile.joinDate', '가입일')}
                value={new Date(user.createdAt).toLocaleDateString('ko-KR')}
                icon={<CalendarDays className="w-4 h-4 text-kk-brown/30" />}
              />
            </div>
          </div>

          {/* 소속 & 강사 정보 */}
          <div className="bg-white rounded-xl border border-kk-warm p-5">
            <h2 className="text-lg font-semibold text-kk-brown mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-kk-red" />
              {t('profile.affiliationInfo', '소속 정보')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow
                label={t('auth.organization')}
                value={user.organization || t('profile.notSet', '미설정')}
                icon={<Building2 className="w-4 h-4 text-kk-brown/30" />}
              />
              <InfoRow
                label={t('profile.instructorCode', '강사코드')}
                value={user.instructorCode || t('profile.notSet', '미설정')}
                icon={<GraduationCap className="w-4 h-4 text-kk-brown/30" />}
                mono
              />
              <InfoRow
                label={t('profile.orgCode', '기관코드')}
                value={user.orgCode || t('profile.noOrg', '개인')}
                icon={<Shield className="w-4 h-4 text-kk-brown/30" />}
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

          {/* 내 학교 (Enrollment) */}
          <div className="bg-white rounded-xl border border-kk-warm p-5">
            <h2 className="text-lg font-semibold text-kk-brown mb-4 flex items-center gap-2">
              <School className="w-5 h-5 text-kk-red" />
              내 학교
            </h2>
            {enrollments.length === 0 ? (
              <p className="text-sm text-kk-brown/30 text-center py-4">등록된 학교가 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {enrollments.map((enrollment) => {
                  const schoolName = SCHOOL_NAMES[enrollment.school_id];
                  const StatusIcon =
                    enrollment.status === 'active' ? CheckCircle2 :
                    enrollment.status === 'pending_info' ? AlertCircle : XCircle;
                  const statusColor =
                    enrollment.status === 'active' ? 'text-green-500' :
                    enrollment.status === 'pending_info' ? 'text-orange-500' : 'text-kk-brown/30';
                  const statusLabel =
                    enrollment.status === 'active' ? '수강 중' :
                    enrollment.status === 'pending_info' ? '추가 정보 필요' :
                    enrollment.status === 'suspended' ? '일시정지' : '수료';

                  return (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 bg-kk-cream/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                        <div>
                          <p className="text-sm font-medium text-kk-brown">{schoolName?.ko}</p>
                          <p className="text-xs text-kk-brown/40">
                            {new Date(enrollment.enrolled_at).toLocaleDateString('ko-KR')} 등록
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        enrollment.status === 'active' ? 'bg-green-50 text-green-600' :
                        enrollment.status === 'pending_info' ? 'bg-orange-50 text-orange-600' :
                        'bg-kk-cream text-kk-brown/50'
                      }`}>
                        {statusLabel}
                      </span>
                    </div>
                  );
                })}
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
    <div className="flex items-center justify-between p-3 bg-kk-cream/50 rounded-lg">
      <div className="flex items-center gap-2 text-sm text-kk-brown/50">
        {icon}
        {label}
      </div>
      <span className={`text-sm font-medium text-kk-brown ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
