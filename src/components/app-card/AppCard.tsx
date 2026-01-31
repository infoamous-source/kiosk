import { useTranslation } from 'react-i18next';
import type { AppItem } from '../../types/app';
import BadgeTag from './BadgeTag';
import DownloadButton from './DownloadButton';

interface AppCardProps {
  app: AppItem;
}

export default function AppCard({ app }: AppCardProps) {
  const { t } = useTranslation('apps');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* App Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src={app.icon}
            alt={t(app.nameKey)}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `<span class="text-2xl font-bold text-gray-400">${app.koreanName[0]}</span>`;
            }}
          />
        </div>

        {/* App Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900">
              {t(app.nameKey)}
            </h3>
            <span className="text-sm text-gray-400">
              {app.koreanName}
            </span>
          </div>
          <p className="text-xs text-blue-600 font-medium mt-0.5">
            {t(app.taglineKey)}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {t(app.descriptionKey)}
      </p>

      {/* Badges + Download */}
      <div className="flex flex-col gap-3 mt-auto pt-2">
        <BadgeTag badges={app.badges} />
        <DownloadButton storeLinks={app.storeLinks} />
      </div>
    </div>
  );
}
