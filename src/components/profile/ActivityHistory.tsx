import { useTranslation } from 'react-i18next';
import { Clock, TrendingUp, BookOpen, Wrench, Activity } from 'lucide-react';
import { useActivityLog } from '../../hooks/useActivityLog';

interface ActivityHistoryProps {
  userId: string;
}

export default function ActivityHistory({ userId: _userId }: ActivityHistoryProps) {
  const { t } = useTranslation('common');
  const { logs: rawLogs, isLoading } = useActivityLog();

  // Map Supabase rows to display format (already filtered by current user via hook)
  const logs = rawLogs.map((r) => ({
    userId: r.user_id,
    trackId: r.track_id || '',
    moduleId: r.module_id ?? undefined,
    action: r.action,
    timestamp: r.created_at,
    metadata: r.metadata as Record<string, string> | undefined,
  }));

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'module_start':
      case 'module_complete':
        return <BookOpen className="w-4 h-4" />;
      case 'tool_use':
        return <Wrench className="w-4 h-4" />;
      case 'track_start':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionLabel = (action: string) => {
    const actionMap: Record<string, string> = {
      module_start: t('profile.activity.moduleStart', '모듈 시작'),
      module_complete: t('profile.activity.moduleComplete', '모듈 완료'),
      tool_use: t('profile.activity.toolUse', '도구 사용'),
      track_start: t('profile.activity.trackStart', '트랙 시작'),
      lesson_start: t('profile.activity.lessonStart', '학습 시작'),
      lesson_complete: t('profile.activity.lessonComplete', '학습 완료'),
    };
    return actionMap[action] || action;
  };

  const getActionColor = (action: string) => {
    if (action.includes('complete')) return 'text-green-600 bg-green-50';
    if (action.includes('start')) return 'text-blue-600 bg-blue-50';
    if (action.includes('tool')) return 'text-purple-600 bg-purple-50';
    return 'text-gray-600 bg-gray-50';
  };

  // 날짜별 그룹핑
  const groupedLogs = logs.reduce<Record<string, ActivityLog[]>>((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-800">
            {t('profile.activity.title', '활동 내역')}
          </h2>
          <span className="text-sm text-gray-400 ml-auto">
            {logs.length}{t('profile.activity.countUnit', '건')}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {t('profile.activity.description', '학습 활동과 도구 사용 기록을 확인할 수 있어요.')}
        </p>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {logs.filter(l => l.action.includes('module')).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">{t('profile.activity.modulesAccessed', '모듈 접근')}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {logs.filter(l => l.action === 'tool_use').length}
          </p>
          <p className="text-xs text-gray-500 mt-1">{t('profile.activity.toolsUsed', '도구 사용')}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {logs.filter(l => l.action.includes('complete')).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">{t('profile.activity.completed', '완료')}</p>
        </div>
      </div>

      {/* 활동 타임라인 */}
      {Object.keys(groupedLogs).length === 0 ? (
        <div className="text-center py-16">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">
            {t('profile.activity.empty', '아직 활동 기록이 없어요.\n트랙을 선택하고 학습을 시작해보세요!')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-400 mb-3 sticky top-0 bg-gray-50/80 backdrop-blur-sm py-1">
                {date}
              </h3>
              <div className="space-y-2">
                {dateLogs.map((log, idx) => (
                  <div
                    key={`${log.timestamp}-${idx}`}
                    className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3"
                  >
                    <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {getActionLabel(log.action)}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {log.trackId}
                        {log.moduleId && ` → ${log.moduleId}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
