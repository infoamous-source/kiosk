import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Monitor, Coffee, CreditCard, ShoppingCart, CheckCircle2 } from 'lucide-react';
import KioskSimulator from '../components/digital/KioskSimulator/KioskSimulator';
import { useDigitalProgress } from '../hooks/useDigitalProgress';

export default function KioskPracticePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showSimulator, setShowSimulator] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { markPracticeCompleted } = useDigitalProgress();

  const handleComplete = () => {
    setShowSimulator(false);
    setCompleted(true);
    markPracticeCompleted('db-02', 'db-02-practice-1');
  };

  const learningPoints = [
    { icon: Monitor, textKey: 'kiosk.learn.touchScreen', fallback: '화면 터치로 주문 시작하기' },
    { icon: Coffee, textKey: 'kiosk.learn.selectMenu', fallback: '메뉴와 옵션 선택하기' },
    { icon: ShoppingCart, textKey: 'kiosk.learn.cart', fallback: '장바구니 확인 및 수량 조절' },
    { icon: CreditCard, textKey: 'kiosk.learn.payment', fallback: '결제 수단 선택 및 결제하기' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/track/digital-basics/module/db-02')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>{t('kiosk.backToModule', '모듈로 돌아가기')}</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Monitor className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('kiosk.title', '키오스크 연습')}
              </h1>
              <p className="text-sm text-gray-600">
                {t('kiosk.subtitle', '카페에서 음료 주문해보기')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 완료 축하 */}
        {completed && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6 text-center">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-green-900 mb-2">
              {t('kiosk.screens.complete.congrats', '키오스크 주문 연습 완료!')}
            </h2>
            <p className="text-green-700 mb-4">
              {t('kiosk.screens.complete.message', '이제 실제 카페에서도 자신있게 주문할 수 있어요!')}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowSimulator(true)}
                className="px-5 py-2.5 bg-white text-green-700 border-2 border-green-200 rounded-xl font-medium text-sm hover:bg-green-50 transition-colors"
              >
                {t('kiosk.retryPractice', '다시 연습하기')}
              </button>
              <button
                onClick={() => navigate('/track/digital-basics/module/db-02')}
                className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-700 transition-colors"
              >
                {t('kiosk.backToModule', '모듈로 돌아가기')}
              </button>
            </div>
          </div>
        )}

        {/* 키오스크란? */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>🖥️</span>
            {t('kiosk.whatIsKiosk', '키오스크란?')}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t(
              'kiosk.whatIsKioskDesc',
              '키오스크는 카페, 패스트푸드점, 영화관 등에 설치된 터치스크린 주문 기계입니다. 직원에게 말하지 않고도 화면을 터치하여 메뉴를 선택하고, 결제까지 할 수 있습니다.'
            )}
          </p>
        </section>

        {/* 이 연습에서 배울 것 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📚</span>
            {t('kiosk.whatYouLearn', '이 연습에서 배울 것')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {learningPoints.map(({ icon: Icon, textKey, fallback }, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-purple-600" />
                </div>
                <p className="text-sm text-purple-900 font-medium">
                  {t(textKey, fallback)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 연습 시작 버튼 */}
        {!completed && (
          <div className="text-center">
            <button
              onClick={() => setShowSimulator(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all border-b-4 border-purple-700 active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <Monitor size={24} />
                {t('kiosk.startPractice', '키오스크 연습 시작하기')}
              </span>
            </button>
            <p className="text-sm text-gray-500 mt-3">
              {t('kiosk.practiceNote', '실제 카페와 비슷한 화면으로 연습합니다')}
            </p>
          </div>
        )}
      </div>

      {/* 키오스크 시뮬레이터 모달 */}
      {showSimulator && (
        <KioskSimulator
          onClose={() => setShowSimulator(false)}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
