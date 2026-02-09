import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { type SchoolId, SCHOOL_NAMES } from '../types/enrollment';
import KkakdugiCharacter from '../components/brand/KkakdugiCharacter';
import { SchoolPatternBg, StarIcon, PencilIcon } from '../components/brand/SchoolIllustrations';

interface LocationState {
  schoolId: SchoolId;
}

export default function CongratsPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();

  const { schoolId } = (location.state as LocationState) || {};

  if (!schoolId) {
    navigate('/');
    return null;
  }

  const handleRegister = () => {
    navigate('/register', {
      state: {
        preSelectedSchool: schoolId,
        redirectTo: `/${schoolId}`
      }
    });
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

        {/* 학생 등록 버튼 */}
        <button
          onClick={handleRegister}
          className="group inline-flex items-center gap-3 px-8 py-4 bg-kk-red hover:bg-kk-red-deep text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <span>{t('congrats.registerButton', '학생 등록하기')}</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* 안내 문구 */}
        <p className="mt-8 text-sm text-kk-brown/40">
          {t('congrats.hint', '학생 등록을 완료하면 모든 학습 콘텐츠에 접근할 수 있습니다')}
        </p>
      </div>
    </div>
  );
}
