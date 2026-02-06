import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  gradient: string;
  emoji: string;
}

const banners: BannerItem[] = [
  {
    id: 'digital',
    titleKey: 'banners.digital.title',
    descriptionKey: 'banners.digital.description',
    gradient: 'from-blue-500 to-blue-600',
    emoji: '💻',
  },
  {
    id: 'marketing',
    titleKey: 'banners.marketing.title',
    descriptionKey: 'banners.marketing.description',
    gradient: 'from-purple-500 to-purple-600',
    emoji: '📈',
  },
  {
    id: 'career',
    titleKey: 'banners.career.title',
    descriptionKey: 'banners.career.description',
    gradient: 'from-emerald-500 to-emerald-600',
    emoji: '🎯',
  },
];

export default function RollingBanner() {
  const { t } = useTranslation('common');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const current = banners[currentIndex];

  return (
    <div
      className="relative overflow-hidden rounded-2xl mb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 배너 컨텐츠 */}
      <div
        className={`bg-gradient-to-r ${current.gradient} px-8 py-6 text-white transition-all duration-500`}
      >
        <div className="flex items-center gap-6">
          <span className="text-5xl">{current.emoji}</span>
          <div>
            <h3 className="text-xl font-bold mb-1">
              {t(current.titleKey)}
            </h3>
            <p className="text-white/80 text-sm">
              {t(current.descriptionKey)}
            </p>
          </div>
        </div>
      </div>

      {/* 좌우 버튼 */}
      <button
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
