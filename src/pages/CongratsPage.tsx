import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, LogIn } from 'lucide-react';
import { type SchoolId, SCHOOL_NAMES } from '../types/enrollment';
import { useAuth } from '../contexts/AuthContext';
import KkakdugiCharacter from '../components/brand/KkakdugiCharacter';
import { SchoolPatternBg, StarIcon, PencilIcon } from '../components/brand/SchoolIllustrations';

interface LocationState {
  schoolId: SchoolId;
}

export default function CongratsPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { schoolId } = (location.state as LocationState) || {};

  if (!schoolId) {
    navigate('/');
    return null;
  }

  const handleLogin = () => {
    navigate('/login', {
      state: { redirectTo: '/marketing/hub' },
    });
  };

  const handleRegister = () => {
    navigate('/register', {
      state: {
        preSelectedSchool: schoolId,
        redirectTo: `/${schoolId}`,
      },
    });
  };

  const handleGoToSchool = () => {
    navigate('/marketing/hub');
  };

  return (
    <div className="min-h-screen bg-kk-bg relative overflow-hidden flex items-center justify-center p-4">
      <SchoolPatternBg className="opacity-20" />

      <div className="max-w-2xl w-full text-center relative">
        {/* 캐릭터 + 장식 */}
        <div className="mb-8 relative inline-block">
          <KkakdugiCharacter size="half" animated />
          <div className="absolute -left-6 top-2">
            <StarIcon size={28} className="opacity-40 animate-[floatBounce_2.5s_ease-in-out_infinite]" />
          </div>
          <div className="absolute -right-6 top-6">
            <PencilIcon size={24} className="opacity-40 animate-[floatBounce_3s_ease-in-out_infinite_0.3s]" />
          </div>
          <div className="absolute -left-10 bottom-8">
            <StarIcon size={20} className="opacity-30 animate-[floatBounce_3.5s_ease-in-out_infinite_0.6s]" />
          </div>
          <div className="absolute -right-10 bottom-4">
            <StarIcon size={16} className="opacity-30 animate-[floatBounce_2.8s_ease-in-out_infinite_0.9s]" />
          </div>
        </div>

        {/* 메인 메시지 */}
        <h1 className="text-4xl md:text-5xl font-bold text-kk-brown mb-4">
          {t('congrats.title', '여러분의 입학을 축하합니다!')}
        </h1>

        <p className="text-xl text-kk-brown/60 mb-12">
          {t('congrats.subtitle', '{{courseName}} 과정에 오신 것을 환영합니다', {
            courseName: SCHOOL_NAMES[schoolId]?.ko ?? schoolId,
          })}
        </p>

        {user ? (
          /* 로그인된 유저 → 교실 바로가기 */
          <button
            onClick={handleGoToSchool}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-kk-red hover:bg-kk-red-deep text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span>{t('congrats.goToSchool', '교실로 이동하기')}</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          /* 미로그인 → 로그인 버튼(1차) + 학생등록 링크(2차) */
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-kk-red hover:bg-kk-red-deep text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <LogIn className="w-6 h-6" />
              <span>{t('congrats.loginButton', '로그인하기')}</span>
            </button>

            <div>
              <button
                onClick={handleRegister}
                className="text-kk-brown/50 hover:text-kk-red text-sm underline underline-offset-4 transition-colors"
              >
                {t('congrats.registerLink', '아직 계정이 없으신가요? 학생 등록하기')}
              </button>
            </div>
          </div>
        )}

        {/* 안내 문구 */}
        <p className="mt-8 text-sm text-kk-brown/40">
          {t('congrats.hint', '학생 등록을 완료하면 모든 학습 콘텐츠에 접근할 수 있습니다')}
        </p>
      </div>
    </div>
  );
}
