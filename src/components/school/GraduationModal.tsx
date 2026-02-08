import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { X, Send, Award } from 'lucide-react';
import { graduate } from '../../utils/schoolStorage';
import confetti from 'canvas-confetti';

interface GraduationModalProps {
  userId: string;
  onClose: () => void;
  onComplete: () => void;
}

type Step = 'review' | 'diploma';

export default function GraduationModal({ userId, onClose, onComplete }: GraduationModalProps) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('review');
  const [review, setReview] = useState('');

  const handleSubmitReview = () => {
    if (!review.trim()) return;

    // 졸업 처리
    graduate(userId, review.trim());

    // 🎊 confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#9370DB', '#00CED1'],
    });

    setStep('diploma');
  };

  const handleGoToPro = () => {
    onComplete();
    navigate('/marketing/pro');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* 닫기 버튼 */}
        {step === 'review' && (
          <div className="flex justify-end p-4 pb-0">
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        )}

        {step === 'review' && (
          <div className="px-6 pb-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎓</div>
              <h2 className="text-2xl font-extrabold text-gray-800">{t('school.graduation.reviewTitle')}</h2>
              <p className="text-sm text-gray-500 mt-2">{t('school.graduation.reviewSubtitle')}</p>
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder={t('school.graduation.reviewPlaceholder')}
              className="w-full h-32 p-4 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              maxLength={500}
            />
            <p className="text-xs text-gray-400 text-right mt-1">{review.length}/500</p>

            <button
              onClick={handleSubmitReview}
              disabled={!review.trim()}
              className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {t('school.graduation.submitReview')}
            </button>
          </div>
        )}

        {step === 'diploma' && (
          <div className="p-6">
            {/* 금박 졸업장 */}
            <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl p-8 text-center shadow-inner">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-amber-800 mb-2">{t('school.graduation.diplomaTitle')}</h2>
              <div className="w-12 h-0.5 bg-amber-400 mx-auto my-3" />
              <p className="text-sm text-amber-700">{t('school.graduation.diplomaBody')}</p>
              <p className="text-xs text-amber-500 mt-4">{t('school.graduation.diplomaDate', { date: new Date().toLocaleDateString('ko-KR') })}</p>
            </div>

            {/* Pro 도구 잠금해제 안내 */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-1">🔓 {t('school.graduation.proUnlocked')}</p>
              <p className="text-xs text-gray-400 mb-4">{t('school.graduation.proUnlockedHint')}</p>
              <button
                onClick={handleGoToPro}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                {t('school.graduation.goToPro')}
              </button>
              <button
                onClick={onComplete}
                className="w-full mt-2 py-2 text-gray-500 text-sm hover:text-gray-700"
              >
                {t('school.graduation.later')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
