import { useState, useEffect } from 'react';
import { Send, Cpu, Users, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createNotification, getNotificationHistory, type Notification } from '../../services/notificationService';

interface Student {
  id: string;
  name: string;
  email: string;
  hasApiKey: boolean;
}

interface NotificationSenderProps {
  students: Student[];
}

type TargetType = 'all' | 'no_api_key';

const PRESETS = [
  {
    label: 'AI 비서 연결 안내',
    title: 'AI 비서를 연결해주세요!',
    message: '학습을 더 효과적으로 하기 위해 AI 비서(Gemini)를 연결해주세요. 마케팅 학교 > AI 설정에서 간단하게 연결할 수 있습니다.',
    actionUrl: '/marketing/school/ai-setup',
    targetType: 'no_api_key' as TargetType,
  },
];

export default function NotificationSender({ students }: NotificationSenderProps) {
  const { user } = useAuth();
  const [targetType, setTargetType] = useState<TargetType>('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState<Notification[]>([]);

  const noApiStudents = students.filter(s => !s.hasApiKey);
  const targetCount = targetType === 'all' ? students.length : noApiStudents.length;

  useEffect(() => {
    if (!user) return;
    getNotificationHistory(user.id).then(setHistory).catch(() => {});
  }, [user]);

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title);
    setMessage(preset.message);
    setActionUrl(preset.actionUrl);
    setTargetType(preset.targetType);
  };

  const handleSend = async () => {
    if (!user || !title.trim() || !message.trim()) return;
    setSending(true);

    const targetIds = targetType === 'no_api_key'
      ? noApiStudents.map(s => s.id)
      : students.map(s => s.id);

    const result = await createNotification(
      user.id,
      targetType,
      targetIds,
      title.trim(),
      message.trim(),
      actionUrl.trim() || null,
    );

    if (result) {
      setSent(true);
      setHistory(prev => [result, ...prev]);
      setTimeout(() => {
        setSent(false);
        setTitle('');
        setMessage('');
        setActionUrl('');
      }, 2000);
    }
    setSending(false);
  };

  return (
    <div className="space-y-6">
      {/* 공지 작성 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600" />
          학생 공지 보내기
        </h3>

        {/* 프리셋 버튼 */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">빠른 설정</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => applyPreset(preset)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg hover:bg-amber-100 transition-colors border border-amber-200"
              >
                <Cpu className="w-3.5 h-3.5" />
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 대상 선택 */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">대상 선택</p>
          <div className="flex gap-2">
            <button
              onClick={() => setTargetType('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                targetType === 'all'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              전체 학생 ({students.length}명)
            </button>
            <button
              onClick={() => setTargetType('no_api_key')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                targetType === 'no_api_key'
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Cpu className="w-4 h-4" />
              AI 미연결 ({noApiStudents.length}명)
            </button>
          </div>
        </div>

        {/* 제목 */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="공지 제목을 입력하세요"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 메시지 */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1">내용</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="공지 내용을 입력하세요"
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* 이동 URL (선택) */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">이동 URL (선택)</label>
          <input
            type="text"
            value={actionUrl}
            onChange={e => setActionUrl(e.target.value)}
            placeholder="/marketing/school/ai-setup"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 전송 버튼 */}
        <button
          onClick={handleSend}
          disabled={sending || !title.trim() || !message.trim() || targetCount === 0}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            sent
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300'
          }`}
        >
          {sent ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              {targetCount}명에게 전송 완료!
            </>
          ) : sending ? (
            '전송 중...'
          ) : (
            <>
              <Send className="w-4 h-4" />
              {targetCount}명에게 공지 보내기
            </>
          )}
        </button>
      </div>

      {/* 발송 이력 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          발송 이력
        </h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">아직 보낸 공지가 없습니다</p>
        ) : (
          <div className="space-y-3">
            {history.map(n => (
              <div key={n.id} className="p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">{n.title}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(n.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    n.target_type === 'all' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {n.target_type === 'all' ? '전체' : 'AI 미연결'}
                  </span>
                  {n.action_url && (
                    <span className="text-xs text-gray-400 font-mono">{n.action_url}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
