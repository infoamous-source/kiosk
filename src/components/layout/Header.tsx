import { useTranslation } from 'react-i18next';
import LanguageSelector from '../ui/LanguageSelector';
import InstallPrompt from '../ui/InstallPrompt';

export default function Header() {
  const { t } = useTranslation('common');

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            {t('header.title')}
          </h1>
          <p className="text-blue-200 text-xs mt-0.5">
            {t('header.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <InstallPrompt />
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
