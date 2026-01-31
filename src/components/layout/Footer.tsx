import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs text-gray-400">
          {t('footer.disclaimer')}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {t('footer.madeWith')}
        </p>
      </div>
    </footer>
  );
}
