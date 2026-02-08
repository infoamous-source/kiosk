import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bot, Send, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { type SchoolId } from '../types/enrollment';

interface LocationState {
  schoolId: SchoolId;
  userName?: string;
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export default function AIWelcomePage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { schoolId, userName } = (location.state as LocationState) || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);

  // 자동 인사 메시지
  useEffect(() => {
    if (!schoolId) {
      navigate('/');
      return;
    }

    const name = userName || user?.user_metadata?.name || '학생';
    const welcomeMessage = `안녕하세요. ${name}님 입학을 축하합니다! 🎉\n\n저는 이 마케팅학교에서 당신을 도와드릴 AI 비서예요. 졸업까지 힘내세요!\n\n궁금한 것이 있다면 언제든 물어보세요. 마케팅 전략, 도구 사용법, 학습 방법 등 무엇이든 도와드릴게요! 💪`;

    // 타이핑 효과로 메시지 표시
    setIsTyping(true);
    let currentText = '';
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < welcomeMessage.length) {
        currentText += welcomeMessage[index];
        setMessages([{ role: 'assistant', content: currentText }]);
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setShowContinueButton(true);
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, [schoolId, userName, user, navigate]);

  // 메시지 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    // 간단한 마케팅 AI 비서 응답 로직
    const response = generateMarketingResponse(userMessage);

    // 타이핑 효과
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 500);
  };

  const handleContinue = () => {
    // 학생 등록 완료 페이지 또는 허브로 이동
    navigate(`/${schoolId}/hub`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Bot className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <Sparkles className="w-6 h-6 inline mr-2 text-purple-500" />
            연결 확인
          </h1>
          <p className="text-gray-600">마케팅 학교 AI 비서와 대화해보세요</p>
        </div>

        {/* 채팅 영역 */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* 메시지 영역 */}
          <div className="h-[400px] overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <Bot className="w-4 h-4 inline mr-2 opacity-70" />
                  )}
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="궁금한 것을 물어보세요..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 계속하기 버튼 */}
        {showContinueButton && (
          <div className="mt-6 text-center animate-fade-in">
            <button
              onClick={handleContinue}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <span>학습 시작하기</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="mt-3 text-sm text-gray-500">
              또는 AI 비서와 더 대화를 나눈 후 시작할 수 있습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 간단한 마케팅 AI 비서 응답 생성
function generateMarketingResponse(userInput: string): string {
  const input = userInput.toLowerCase();

  // 인사말
  if (input.includes('안녕') || input.includes('hi') || input.includes('hello')) {
    return '안녕하세요! 무엇을 도와드릴까요? 😊';
  }

  // 마케팅 전략
  if (input.includes('마케팅') || input.includes('전략')) {
    return '마케팅 전략에 대해 궁금하신가요? 이 학교에서는 디지털 마케팅의 기초부터 고급 전략까지 배우실 수 있습니다.\n\n커리큘럼 탭에서 체계적인 학습 과정을 확인하시고, Lab 탭에서 실전 도구들을 직접 사용해보세요! 💡';
  }

  // SNS 관련
  if (input.includes('sns') || input.includes('소셜') || input.includes('인스타') || input.includes('페북')) {
    return 'SNS 마케팅은 현대 디지털 마케팅의 핵심입니다! 📱\n\n저희 학교에서는 Instagram, Facebook, YouTube 등 각 플랫폼별 특성과 효과적인 콘텐츠 전략을 배우실 수 있습니다. Lab에서 실습도 가능해요!';
  }

  // 도구 사용
  if (input.includes('도구') || input.includes('툴') || input.includes('사용법')) {
    return '마케팅 도구 사용법이 궁금하신가요? 🛠️\n\nLab 탭으로 가시면 다양한 실전 마케팅 도구들을 직접 체험해보실 수 있습니다. 각 도구마다 상세한 가이드가 준비되어 있으니 걱정하지 마세요!';
  }

  // 졸업 관련
  if (input.includes('졸업') || input.includes('수료')) {
    return '졸업을 위해서는 모든 커리큘럼을 이수하고 실습 과제를 완료하셔야 합니다. 📚\n\n출석 탭에서 학습 진도를 확인하시고, 스탬프를 모아보세요. 궁금한 점이 있으면 언제든 물어보세요!';
  }

  // 학습 방법
  if (input.includes('어떻게') || input.includes('방법') || input.includes('시작')) {
    return '학습을 시작하시려면 다음 단계를 따라해보세요:\n\n1️⃣ 출석 탭에서 오늘의 학습을 시작하세요\n2️⃣ 커리큘럼 탭에서 체계적인 강의를 수강하세요\n3️⃣ Lab 탭에서 실전 도구를 활용해보세요\n\n하나씩 차근차근 진행하시면 됩니다! 화이팅! 💪';
  }

  // 기본 응답
  return '좋은 질문이네요! 😊\n\n저는 마케팅 학교 AI 비서로서 학습 방법, 도구 사용법, 마케팅 전략 등에 대해 도와드릴 수 있습니다.\n\n더 구체적으로 무엇이 궁금하신가요? 예를 들어:\n• 마케팅 전략에 대해 알려주세요\n• SNS 마케팅은 어떻게 하나요?\n• 어떤 도구들을 배울 수 있나요?\n• 졸업 요건이 궁금해요';
}
