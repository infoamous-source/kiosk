import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  User,
  Mail,
  Lock,
  Building2,
  Tag,
  Target,
  UserPlus,
  Loader2,
  GraduationCap,
  ArrowRight,
  School,
  Monitor,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEnrollments } from '../../contexts/EnrollmentContext';
import { createEnrollment, submitSchoolProfile } from '../../services/enrollmentService';
import { SCHOOL_IDS, SCHOOL_NAMES, type SchoolId } from '../../types/enrollment';
import SchoolEnrollmentForm from '../enrollment/SchoolEnrollmentForm';

type Step = 'common' | 'school-select' | 'school-info';

interface LocationState {
  redirectTo?: string;
}

const SCHOOL_ICONS: Record<SchoolId, typeof Monitor> = {
  'digital-basics': Monitor,
  'marketing': School,
  'career': Briefcase,
};

const SCHOOL_COLORS: Record<SchoolId, string> = {
  'digital-basics': 'from-blue-500 to-cyan-500',
  'marketing': 'from-purple-500 to-pink-500',
  'career': 'from-emerald-500 to-teal-500',
};

export default function RegisterForm() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { register, user } = useAuth();
  const { refreshEnrollments } = useEnrollments();

  const redirectTo = (location.state as LocationState)?.redirectTo || '/';

  const [step, setStep] = useState<Step>('common');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    instructorCode: '',
    orgCode: '',
    learningPurpose: '',
  });
  const [selectedSchool, setSelectedSchool] = useState<SchoolId | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Step 1: 공통 정보 제출 → 계정 생성
  const handleCommonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await register(formData);
      if (success) {
        setStep('school-select');
      } else {
        setError(t('auth.registerError'));
      }
    } catch {
      setError(t('auth.registerError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: 학교 선택 → Step 3로
  const handleSchoolSelect = (schoolId: SchoolId) => {
    setSelectedSchool(schoolId);
    setStep('school-info');
  };

  // Step 2: 건너뛰기 → 바로 홈
  const handleSkipSchool = () => {
    navigate(redirectTo);
  };

  // Step 3: 학교 추가 정보 제출
  const handleSchoolInfoSubmit = async (data: Record<string, unknown>) => {
    if (!user || !selectedSchool) return false;
    setIsLoading(true);

    // enrollment 생성 (self-enrollment)
    const enrollment = await createEnrollment(user.id, selectedSchool, null);
    if (!enrollment) {
      setIsLoading(false);
      return false;
    }

    // 추가 정보 제출 → active 전환
    const success = await submitSchoolProfile(enrollment.id, user.id, selectedSchool, data);
    setIsLoading(false);

    if (success) {
      await refreshEnrollments();

      // AI Welcome 페이지 확인 여부 체크
      const hasSeenWelcome = localStorage.getItem(`ai-welcome-seen-${user.id}-${selectedSchool}`);

      if (!hasSeenWelcome) {
        // 최초 1번만 AI Welcome 페이지로 이동
        localStorage.setItem(`ai-welcome-seen-${user.id}-${selectedSchool}`, 'true');
        navigate('/ai-welcome', {
          state: {
            schoolId: selectedSchool,
            userName: formData.name,
          },
        });
      } else {
        // 이미 본 경우 바로 목적지로 이동
        navigate(redirectTo);
      }
    }
    return success;
  };

  const learningPurposes = [
    { value: 'employment', labelKey: 'auth.purpose.employment' },
    { value: 'skill-up', labelKey: 'auth.purpose.skillUp' },
    { value: 'daily-life', labelKey: 'auth.purpose.dailyLife' },
    { value: 'other', labelKey: 'auth.purpose.other' },
  ];

  // ─── Step Indicator ───
  const steps = [
    { id: 'common', label: '기본 정보' },
    { id: 'school-select', label: '학교 선택' },
    { id: 'school-info', label: '입학 정보' },
  ];
  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t('auth.registerTitle')}</h1>
          <p className="text-gray-500 mt-2">{t('auth.registerSubtitle')}</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < currentStepIndex
                  ? 'bg-green-500 text-white'
                  : i === currentStepIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {i < currentStepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${i < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ─── Step 1: 공통 정보 ─── */}
        {step === 'common' && (
          <form onSubmit={handleCommonSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.name')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('auth.namePlaceholder')}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.email')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.password')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* 소속 기관 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.organization')}
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder={t('auth.organizationPlaceholder')}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* 강사 코드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.instructorCode')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="instructorCode"
                    value={formData.instructorCode}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        instructorCode: e.target.value.toUpperCase(),
                      }));
                    }}
                    placeholder={t('auth.instructorCodePlaceholder')}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 ml-1">{t('auth.instructorCodeHint')}</p>
              </div>

              {/* 기관 코드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.orgCode')}
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="orgCode"
                    value={formData.orgCode}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        orgCode: e.target.value.toUpperCase(),
                      }));
                    }}
                    placeholder={t('auth.orgCodePlaceholder')}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 ml-1">{t('auth.orgCodeHint')}</p>
              </div>

              {/* 학습 목적 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.learningPurpose')}
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="learningPurpose"
                    value={formData.learningPurpose}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="">{t('auth.selectPurpose')}</option>
                    {learningPurposes.map((p) => (
                      <option key={p.value} value={p.value}>
                        {t(p.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 다음 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    계정 생성 & 다음
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* 로그인 링크 */}
            <p className="mt-6 text-center text-sm text-gray-500">
              {t('auth.hasAccount')}{' '}
              <Link to="/login" state={{ redirectTo }} className="text-blue-600 font-semibold hover:underline">
                {t('auth.loginLink')}
              </Link>
            </p>
          </form>
        )}

        {/* ─── Step 2: 학교 선택 ─── */}
        {step === 'school-select' && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-2 text-center">학교를 선택하세요</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">수강할 학교를 선택하면 추가 정보를 입력합니다.</p>

            <div className="space-y-3">
              {SCHOOL_IDS.map((schoolId) => {
                const Icon = SCHOOL_ICONS[schoolId];
                const name = SCHOOL_NAMES[schoolId];
                const gradient = SCHOOL_COLORS[schoolId];

                return (
                  <button
                    key={schoolId}
                    onClick={() => handleSchoolSelect(schoolId)}
                    className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4 text-left"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{name.ko}</p>
                      <p className="text-sm text-gray-500">{name.en}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 ml-auto" />
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSkipSchool}
              className="w-full mt-4 py-3 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              나중에 선택할게요 →
            </button>
          </div>
        )}

        {/* ─── Step 3: 학교 추가 정보 ─── */}
        {step === 'school-info' && selectedSchool && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <SchoolEnrollmentForm
              schoolId={selectedSchool}
              onSubmit={handleSchoolInfoSubmit}
              onCancel={() => setStep('school-select')}
            />
          </div>
        )}

        {/* 홈으로 */}
        <p className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← {t('auth.backToHome')}
          </Link>
        </p>
      </div>
    </div>
  );
}
