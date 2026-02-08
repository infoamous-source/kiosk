import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AIAssistantConnect, { isGeminiConnected } from '../../../components/marketing/AIAssistantConnect';
import { useEffect, useState } from 'react';

/**
 * 입학 과정 중 AI 비서 연결 단독 페이지
 * - API 미연결 회원에게만 표시
 * - 연결 완료 시 학교로 자동 이동
 * - 이미 연결된 회원은 이 페이지에 직접 접근 시 학교로 리다이렉트
 */
export default function AISetupPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [connected, setConnected] = useState(isGeminiConnected());

  // 이미 연결됐으면 학교로 바로 이동
  useEffect(() => {
    if (isGeminiConnected()) {
      navigate('/marketing/school/attendance', { replace: true });
    }
  }, [navigate]);

  // 연결 상태 변화 감지 (localStorage 이벤트)
  useEffect(() => {
    const checkConnection = () => {
      if (isGeminiConnected() && !connected) {
        setConnected(true);
        // 연결 완료 후 잠시 대기 후 학교로 이동
        setTimeout(() => {
          navigate('/marketing/school/attendance', { replace: true });
        }, 2000);
      }
    };

    // 주기적 체크 (AIAssistantConnect가 localStorage를 직접 업데이트하므로)
    const interval = setInterval(checkConnection, 500);
    return () => clearInterval(interval);
  }, [connected, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 헤더 */}
      <header className="py-4 px-4 sm:py-6 sm:px-8">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate('/marketing/hub')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t('school.hub.backToLobby')}</span>
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-lg mx-auto px-4 pb-12">
        {/* 입학 안내 */}
        <div className="text-center mb-6 pt-4">
          <div className="text-5xl mb-3">🎒</div>
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
            {t('school.aiSetup.title')}
          </h1>
          <p className="text-sm text-gray-500">
            {t('school.aiSetup.subtitle')}
          </p>
        </div>

        {/* 스텝 인디케이터 */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <span className="text-xs font-medium text-purple-600">{t('school.aiSetup.step1')}</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-200" />
          <div className="flex items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              connected ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}>2</div>
            <span className={`text-xs font-medium ${connected ? 'text-green-600' : 'text-gray-400'}`}>
              {t('school.aiSetup.step2')}
            </span>
          </div>
        </div>

        {/* AI 연결 컴포넌트 재활용 */}
        <AIAssistantConnect />

        {/* 건너뛰기 버튼 */}
        {!connected && (
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/marketing/school/attendance')}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm transition-colors"
            >
              {t('school.aiSetup.skip')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
