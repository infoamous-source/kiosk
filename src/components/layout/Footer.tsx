import { useTranslation } from 'react-i18next';
import KkakdugiMascot from '../brand/KkakdugiMascot';
import { PencilIcon, StarIcon } from '../brand/SchoolIllustrations';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-kk-cream border-t-2 border-kk-warm py-8 mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <PencilIcon size={18} className="opacity-40" />
          <KkakdugiMascot size={28} />
          <StarIcon size={18} className="opacity-40" />
        </div>
        <p className="text-sm text-kk-brown/50 font-medium">
          {t('footer.madeWith')}
        </p>
        <p className="text-xs text-kk-brown/40 mt-1">
          {t('footer.disclaimer')}
        </p>
      </div>
    </footer>
  );
}
