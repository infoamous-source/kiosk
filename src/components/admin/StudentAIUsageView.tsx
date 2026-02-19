import { useState, useEffect } from 'react';
import { X, Cpu, Clock, Wrench } from 'lucide-react';
import { getPortfolioEntries, type PortfolioEntryRow } from '../../services/portfolioService';

interface StudentAIUsageViewProps {
  studentId: string;
  studentName: string;
  onClose: () => void;
}

export default function StudentAIUsageView({ studentId, studentName, onClose }: StudentAIUsageViewProps) {
  const [entries, setEntries] = useState<PortfolioEntryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPortfolioEntries(studentId)
      .then(setEntries)
      .finally(() => setIsLoading(false));
  }, [studentId]);

  const totalCount = entries.length;
  const aiCount = entries.filter(e => !e.is_mock_data).length;
  const mockCount = entries.filter(e => e.is_mock_data).length;
  const lastUsed = entries.length > 0 ? entries[0].created_at : null;

  // 도구별 사용 횟수
  const toolUsage: Record<string, { total: number; ai: number; mock: number; name: string }> = {};
  entries.forEach(e => {
    if (!toolUsage[e.tool_id]) {
      toolUsage[e.tool_id] = { total: 0, ai: 0, mock: 0, name: e.tool_name || e.tool_id };
    }
    toolUsage[e.tool_id].total++;
    if (e.is_mock_data) toolUsage[e.tool_id].mock++;
    else toolUsage[e.tool_id].ai++;
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800">{studentName}님의 AI 사용 기록</h3>
            <p className="text-xs text-gray-400 mt-0.5">포트폴리오 기반 도구 사용 이력</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 요약 통계 */}
        <div className="grid grid-cols-4 gap-3 p-5 border-b border-gray-100">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800">{totalCount}</p>
            <p className="text-xs text-gray-500">총 사용</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{aiCount}</p>
            <p className="text-xs text-gray-500">AI 응답</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-amber-600">{mockCount}</p>
            <p className="text-xs text-gray-500">예시 데이터</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800">
              {lastUsed ? new Date(lastUsed).toLocaleDateString('ko-KR') : '-'}
            </p>
            <p className="text-xs text-gray-500">최근 사용</p>
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="overflow-y-auto flex-1 p-5">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">로딩 중...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">아직 도구 사용 기록이 없습니다</p>
            </div>
          ) : (
            <>
              {/* 도구별 요약 */}
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                <Wrench className="w-4 h-4" />
                도구별 사용 현황
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {Object.entries(toolUsage).map(([toolId, usage]) => (
                  <div key={toolId} className="p-3 border border-gray-100 rounded-lg">
                    <p className="text-sm font-medium text-gray-800">{usage.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500">총 {usage.total}회</span>
                      <span className="text-xs text-green-600">AI {usage.ai}회</span>
                      {usage.mock > 0 && (
                        <span className="text-xs text-amber-600">예시 {usage.mock}회</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 최근 사용 이력 */}
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                최근 사용 이력
              </h4>
              <div className="space-y-2">
                {entries.slice(0, 20).map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Cpu className={`w-4 h-4 ${entry.is_mock_data ? 'text-amber-500' : 'text-green-500'}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{entry.tool_name || entry.tool_id}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(entry.created_at).toLocaleString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        entry.is_mock_data
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-green-50 text-green-600'
                      }`}
                    >
                      {entry.is_mock_data ? '예시' : 'AI'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
