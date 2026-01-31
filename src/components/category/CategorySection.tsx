import { useTranslation } from 'react-i18next';
import type { Category, AppItem } from '../../types/app';
import AppCard from '../app-card/AppCard';

interface CategorySectionProps {
  category: Category;
  apps: AppItem[];
}

const categoryEmojis: Record<string, string> = {
  'maps': '🗺️',
  'transport': '🚕',
  'translation': '🌐',
  'food': '🍜',
  'shopping': '🛒',
  'travel': '✈️',
  'safety': '🛡️',
};

export default function CategorySection({ category, apps }: CategorySectionProps) {
  const { t } = useTranslation('apps');

  return (
    <section id={category.id} className="scroll-mt-28">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>{categoryEmojis[category.icon] || '📱'}</span>
          {t(category.nameKey)}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {t(category.descriptionKey)}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}
