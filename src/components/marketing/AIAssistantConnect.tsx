import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bot, KeyRound, HelpCircle, CheckCircle, AlertCircle, Loader2,
  Sparkles, ArrowRight, Eye, EyeOff, ExternalLink,
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import confetti from 'canvas-confetti';

const API_KEY_STORAGE = 'kiosk-gemini-api-key';
const CONNECTED_STORAGE = 'kiosk-gemini-connected';

type ConnectionState = 'idle' | 'loading' | 'success' | 'error';

export default function AIAssistantConnect() {
  const { t } = useTranslation('common');

  // 저장된 키/상태 로드
  const [apiKey, setApiKey] = useState(() => {
    try { return localStorage.getItem(API_KEY_STORAGE) || ''; } catch { return ''; }
  });
  const [isConnected, setIsConnected] = useState(() => {
    try { return localStorage.getItem(CONNECTED_STORAGE) === 'true'; } catch { return false; }
  });

  const [connectionState, setConnectionState] = useState<ConnectionState>(
    isConnected ? 'success' : 'idle'
  );
  const [showKey, setShowKey] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 연결 확인 함수
  const handleConnect = useCallback(async () => {
    if (!apiKey.trim()) {
      setErrorMessage(t('marketing.aiConnect.errorEmpty', 'API 키를 입력해주세요'));
      setConnectionState('error');
      return;
    }

    setConnectionState('loading');
    setErrorMessage('');
    setAiMessage('');

    try {
      const genAI = new GoogleGenerativeAI(apiKey.trim());
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const result = await model.generateContent(
        '당신은 마케팅 AI 비서입니다. 사용자가 처음 연결했습니다. 한국어로 한 문장만 반갑게 인사해주세요. "반갑습니다! 이제 제가 당신의 마케팅 비서입니다. 우리 함께 멋진 홍보를 시작해봐요!" 라고 말해주세요.'
      );

      const response = result.response;
      const text = response.text();

      // 성공!
      setAiMessage(text || '반갑습니다! 이제 제가 당신의 마케팅 비서입니다. 우리 함께 멋진 홍보를 시작해봐요!');
      setConnectionState('success');
      setIsConnected(true);

      // localStorage에 저장
      try {
        localStorage.setItem(API_KEY_STORAGE, apiKey.trim());
        localStorage.setItem(CONNECTED_STORAGE, 'true');
      } catch {
        // storage full 등 무시
      }

      // 유저 프로필에도 저장 (향후 DB 연동 대비)
      try {
        const authData = localStorage.getItem('kiosk-auth');
        if (authData) {
          const parsed = JSON.parse(authData);
          if (parsed.user) {
            parsed.user.api_key = apiKey.trim();
            localStorage.setItem('kiosk-auth', JSON.stringify(parsed));
          }
        }
      } catch {
        // ignore
      }

      // 폭죽 애니메이션!
      fireConfetti();

    } catch (err: unknown) {
      setConnectionState('error');
      const errorMsg = err instanceof Error ? err.message : String(err);

      if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('401')) {
        setErrorMessage(t('marketing.aiConnect.errorInvalid', '키를 다시 확인해주세요. API 키가 올바르지 않아요.'));
      } else if (errorMsg.includes('QUOTA') || errorMsg.includes('429')) {
        setErrorMessage(t('marketing.aiConnect.errorQuota', 'API 사용량이 초과되었어요. 잠시 후 다시 시도해주세요.'));
      } else {
        setErrorMessage(
          t('marketing.aiConnect.errorGeneral', '연결에 실패했어요. 키를 다시 확인하거나 잠시 후 시도해주세요.')
        );
      }
    }
  }, [apiKey, t]);

  // 연결 해제
  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    setConnectionState('idle');
    setAiMessage('');
    setApiKey('');
    try {
      localStorage.removeItem(API_KEY_STORAGE);
      localStorage.removeItem(CONNECTED_STORAGE);
    } catch {
      // ignore
    }
  }, []);

  // confetti 애니메이션
  const fireConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="mx-4 mt-6">
      <div className={`rounded-2xl border-2 transition-all duration-500 ${
        isConnected
          ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
          : 'border-blue-200 bg-gradient-to-br from-white to-blue-50'
      } p-6 md:p-8`}>

        {/* Section Title */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🤖</span>
          <h2 className="text-xl font-bold text-gray-800">
            {t('marketing.aiConnect.title', '내 마케팅 AI 비서 연결하기')}
          </h2>
          <span className="text-2xl">🔑</span>
        </div>
        <p className="text-gray-500 mb-6 leading-relaxed">
          {t('marketing.aiConnect.description', 'AI 비서를 연결하면 광고 카피 작성, 이미지 생성 등 더 많은 기능을 사용할 수 있어요!')}
        </p>

        {/* 연결 성공 상태 */}
        {isConnected && connectionState === 'success' && (
          <div className="mb-6">
            {/* AI 인사 메시지 */}
            {aiMessage && (
              <div className="bg-white rounded-xl border border-green-200 p-5 mb-4 flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium leading-relaxed">{aiMessage}</p>
                  <p className="text-xs text-gray-400 mt-2">Gemini AI</p>
                </div>
              </div>
            )}

            {/* 연결됨 뱃지 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-green-700">
                    {t('marketing.aiConnect.connected', 'AI 비서 연결 완료!')}
                  </p>
                  <p className="text-sm text-green-600">
                    {t('marketing.aiConnect.connectedHint', '이제 모든 AI 기능을 사용할 수 있어요')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDisconnect}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors px-3 py-1"
                >
                  {t('marketing.aiConnect.disconnect', '연결 해제')}
                </button>
              </div>
            </div>

            {/* 시작하기 버튼 */}
            <button
              onClick={() => {
                const el = document.getElementById('marketing-modules');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full mt-4 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {t('marketing.aiConnect.startLearning', '마케팅 학습 시작하기')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 미연결 상태 - API 키 입력 폼 */}
        {(!isConnected || connectionState !== 'success') && (
          <div>
            {/* 도움말 링크 */}
            <div className="mb-4">
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                {t('marketing.aiConnect.helpLink', '키를 어디서 받나요?')}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 안내 박스 */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-700 leading-relaxed">
                {t('marketing.aiConnect.guide', '💡 Google AI Studio에서 무료로 API 키를 받을 수 있어요. "Get API Key" 버튼을 클릭하면 됩니다. 키는 내 컴퓨터에만 저장되고, 다른 사람에게 보이지 않아요.')}
              </p>
            </div>

            {/* API 키 입력 */}
            <div className="relative mb-4">
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-medium text-gray-600">
                  {t('marketing.aiConnect.keyLabel', 'Gemini API 키')}
                </label>
              </div>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    if (connectionState === 'error') setConnectionState('idle');
                  }}
                  placeholder={t('marketing.aiConnect.keyPlaceholder', 'AIza...')}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none transition-colors text-sm ${
                    connectionState === 'error'
                      ? 'border-red-300 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:border-blue-400 bg-white'
                  }`}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 에러 메시지 */}
            {connectionState === 'error' && errorMessage && (
              <div className="flex items-start gap-2 mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            {/* 연결 확인 버튼 */}
            <button
              onClick={handleConnect}
              disabled={connectionState === 'loading' || !apiKey.trim()}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                connectionState === 'loading' || !apiKey.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] hover:shadow-lg hover:shadow-blue-200'
              }`}
            >
              {connectionState === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('marketing.aiConnect.connecting', '연결 확인 중...')}
                </>
              ) : (
                <>
                  <Bot className="w-5 h-5" />
                  {t('marketing.aiConnect.connectButton', '연결 확인')}
                </>
              )}
            </button>

            {/* 건너뛰기 */}
            <p className="text-center text-xs text-gray-400 mt-3">
              {t('marketing.aiConnect.skipHint', 'API 키가 없어도 기본 학습은 할 수 있어요')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 다른 컴포넌트에서 연결 상태 확인용 유틸
export function isGeminiConnected(): boolean {
  try {
    return localStorage.getItem(CONNECTED_STORAGE) === 'true';
  } catch {
    return false;
  }
}

export function getGeminiApiKey(): string | null {
  try {
    return localStorage.getItem(API_KEY_STORAGE);
  } catch {
    return null;
  }
}
