import { useTranslation } from 'react-i18next';
import type { BadgeType } from '../../types/app';

const badgeStyles: Record<BadgeType, string> = {
  government: 'bg-blue-100 text-blue-800',
  'local-essential': 'bg-green-100 text-green-800',
  'foreigner-friendly': 'bg-purple-100 text-purple-800',
};

interface BadgeTagProps {
  badges: BadgeType[];
}

export default function BadgeTag({ badges }: BadgeTagProps) {
  const { t } = useTranslation('common');

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <span
          key={badge}
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeStyles[badge]}`}
        >
          {t(`badges.${badge}`)}
        </span>
      ))}
    </div>
  );
}
