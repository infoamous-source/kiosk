import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Laptop,
  Globe,
  Smartphone,
  AppWindow,
  Share2,
  PenTool,
  ShoppingBag,
  BarChart2,
  FileText,
  MessageSquare,
  Search,
  Users,
  Clock,
  BookOpen,
  Play,
} from 'lucide-react';
import { tracks } from '../data/tracks';
import RollingBanner from '../components/common/RollingBanner';
import { handleActivityLog } from '../utils/activityLogger';
import type { TrackId, TrackModule } from '../types/track';

const iconMap: Record<string, typeof Laptop> = {
  Laptop,
  Globe,
  Smartphone,
  AppWindow,
  Share2,
  PenTool,
  ShoppingBag,
  BarChart2,
  FileText,
  MessageSquare,
  Search,
  Users,
};

interface ModuleCardProps {
  module: TrackModule;
  trackId: TrackId;
  trackColor: string;
}

function ModuleCard({ module, trackId, trackColor }: ModuleCardProps) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const Icon = iconMap[module.icon] || BookOpen;

  const colorClasses: Record<string, { bg: string; text: string; hover: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'hover:border-blue-300' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'hover:border-purple-300' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', hover: 'hover:border-emerald-300' },
  };

  const colors = colorClasses[trackColor] || colorClasses.blue;

  const handleClick = () => {
    handleActivityLog('click', trackId, module.id, { action: 'module_click' });

    // 한국 필수 앱 모듈은 별도 페이지로 이동
    if (module.id === 'db-04') {
      navigate('/track/digital-basics/korea-apps');
      return;
    }

    // TODO: 다른 모듈들도 상세 페이지로 이동
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full bg-white rounded-xl border-2 border-gray-100 p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg ${colors.hover}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 mb-1">{t(module.titleKey)}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{t(module.descriptionKey)}</p>

          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              {module.duration}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <BookOpen className="w-3.5 h-3.5" />
              {module.lessons} lessons
            </span>
          </div>
        </div>

        <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center shrink-0`}>
          <Play className={`w-5 h-5 ${colors.text}`} />
        </div>
      </div>
    </button>
  );
}

export default function TrackPage() {
  const { trackId } = useParams<{ trackId: string }>();
  const { t } = useTranslation('common');

  const track = tracks.find((tr) => tr.id === trackId);

  if (!track) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Track not found</p>
      </div>
    );
  }

  // 페이지 뷰 로깅
  handleActivityLog('view', track.id, undefined, { page: 'track_detail' });

  return (
    <div className="max-w-4xl mx-auto">
      <RollingBanner />

      {/* 트랙 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span>Home</span>
          <span>/</span>
          <span className={`text-${track.color}-600 font-medium`}>{t(track.nameKey)}</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">{t(track.nameKey)}</h1>
        <p className="text-gray-500 text-lg">{t(track.descriptionKey)}</p>

        <div className="flex items-center gap-6 mt-4">
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen className="w-4 h-4" />
            {track.modules.length} {t('track.modules')}
          </span>
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {track.modules.reduce((sum, m) => sum + parseFloat(m.duration), 0).toFixed(1)}h {t('track.totalTime')}
          </span>
        </div>
      </div>

      {/* 모듈 리스트 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">{t('track.curriculum')}</h2>

        {track.modules.map((module, index) => (
          <div key={module.id} className="flex items-start gap-4">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${track.gradient} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <ModuleCard module={module} trackId={track.id} trackColor={track.color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
