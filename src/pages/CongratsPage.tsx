import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PartyPopper, ArrowRight } from 'lucide-react';
import { type SchoolId, SCHOOL_NAMES } from '../types/enrollment';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 폭죽 애니메이션 */}
        <div className="mb-8 animate-bounce">
          <PartyPopper className="w-32 h-32 mx-auto text-purple-500" strokeWidth={1.5} />
        </div>

        {/* 메인 메시지 */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t('congrats.title', '여러분의 입학을 축하합니다!')}
        </h1>

        <p className="text-xl text-gray-600 mb-12">
          {t('congrats.subtitle', '{{courseName}} 과정에 오신 것을 환영합니다', {
            courseName: SCHOOL_NAMES[schoolId],
          })}
        </p>

        {/* 학생 등록 버튼 */}
        <button
          onClick={handleRegister}
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <span>{t('congrats.registerButton', '학생 등록하기')}</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* 안내 문구 */}
        <p className="mt-8 text-sm text-gray-500">
          {t('congrats.hint', '학생 등록을 완료하면 모든 학습 콘텐츠에 접근할 수 있습니다')}
        </p>
      </div>
    </div>
  );
}
