import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { apps } from '../../data/apps';

interface Props {
  appIds: string[];
}

export default function RelatedApps({ appIds }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const relatedApps = apps.filter((app) => appIds.includes(app.id));

  if (relatedApps.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>📱</span>
        {t('digital.common.relatedApps', '관련 앱')}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {relatedApps.map((app) => (
          <button
            key={app.id}
            onClick={() => navigate('/track/digital-basics/korea-apps')}
            className="flex-shrink-0 flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all min-w-[180px]"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">{app.koreanName.charAt(0)}</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{t(app.nameKey, app.koreanName)}</p>
              <p className="text-xs text-gray-500">{t(app.taglineKey, '')}</p>
            </div>
            <ExternalLink size={14} className="text-gray-400 flex-shrink-0" />
          </button>
        ))}
      </div>
    </section>
  );
}
