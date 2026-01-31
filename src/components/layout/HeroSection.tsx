import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t } = useTranslation('common');

  return (
    <section className="bg-gradient-to-b from-blue-600 to-blue-500 text-white pb-8 pt-6 -mt-px">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t('hero.tagline')}
        </h2>
        <p className="text-blue-100 mt-2 text-sm sm:text-base max-w-xl mx-auto">
          {t('hero.description')}
        </p>
      </div>
    </section>
  );
}
