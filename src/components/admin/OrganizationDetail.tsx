import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Users,
  TrendingUp,
  BookOpen,
  Download,
  Search,
  MoreHorizontal,
  Activity,
  RefreshCw,
  Building2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// 더미 데이터 (실제로는 API에서 가져옴)
const allStudents = [
  { id: '1', name: '김민수', email: 'minsu@test.com', track: 'digital-basics', progress: 75, lastActive: '2024-01-15', orgCode: 'ORG001', organization: '서울다문화센터' },
  { id: '2', name: 'John Smith', email: 'john@test.com', track: 'marketing', progress: 45, lastActive: '2024-01-14', orgCode: 'ORG002', organization: '부산외국인지원센터' },
  { id: '3', name: '田中花子', email: 'hanako@test.com', track: 'career', progress: 90, lastActive: '2024-01-15', orgCode: 'ORG001', organization: '서울다문화센터' },
  { id: '4', name: '이영희', email: 'younghee@test.com', track: 'digital-basics', progress: 30, lastActive: '2024-01-13', orgCode: 'ORG003', organization: '인천글로벌센터' },
  { id: '5', name: 'Maria Garcia', email: 'maria@test.com', track: 'marketing', progress: 60, lastActive: '2024-01-15', orgCode: 'ORG002', organization: '부산외국인지원센터' },
  { id: '6', name: '박지현', email: 'jihyun@test.com', track: 'career', progress: 85, lastActive: '2024-01-15', orgCode: 'ORG001', organization: '서울다문화센터' },
  { id: '7', name: 'Ahmed Hassan', email: 'ahmed@test.com', track: 'digital-basics', progress: 55, lastActive: '2024-01-14', orgCode: 'ORG003', organization: '인천글로벌센터' },
];

export default function OrganizationDetail() {
  const { t } = useTranslation('common');
  const { orgCode } = useParams<{ orgCode: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [students, setStudents] = useState(
    allStudents.filter(s => s.orgCode === orgCode)
  );

  const organization = students[0]?.organization || orgCode;

  // 실시간 업데이트 시뮬레이션
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      setStudents(prev => {
        if (prev.length === 0) return prev;
        const randomIndex = Math.floor(Math.random() * prev.length);
        const randomProgress = Math.min(100, prev[randomIndex].progress + Math.floor(Math.random() * 5));

        return prev.map((student, index) =>
          index === randomIndex
            ? { ...student, progress: randomProgress, lastActive: new Date().toISOString().split('T')[0] }
            : student
        );
      });
      setLastUpdate(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, [isRealTimeEnabled]);

  // 필터링된 학생
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 통계 계산
  const avgProgress = Math.round(
    students.reduce((sum, s) => sum + s.progress, 0) / students.length
  );
  const completedCount = students.filter(s => s.progress >= 100).length;

  // 트랙별 분포
  const trackDistribution = students.reduce((acc, s) => {
    acc[s.track] = (acc[s.track] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const trackChartData = Object.entries(trackDistribution).map(([track, count]) => ({
    name: track === 'digital-basics' ? 'Digital' : track === 'marketing' ? 'Marketing' : 'Career',
    count,
  }));

  const trackLabels: Record<string, string> = {
    'digital-basics': 'Digital Basics',
    'marketing': 'Marketing',
    'career': 'Career',
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('admin.backToDashboard')}
        </button>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{organization}</h1>
            <p className="text-gray-500 font-mono">{t('admin.orgCode')}: {orgCode}</p>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{students.length}</p>
              <p className="text-xs text-gray-500">{t('admin.totalStudents')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{avgProgress}%</p>
              <p className="text-xs text-gray-500">{t('admin.avgProgress')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{completedCount}</p>
              <p className="text-xs text-gray-500">{t('admin.completedStudents')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 트랙별 분포 차트 */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">{t('admin.trackDistribution')}</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={trackChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 학생 목록 */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">{t('admin.studentList')}</h3>
            <div className="flex items-center gap-3">
              {/* 실시간 모니터링 토글 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isRealTimeEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      isRealTimeEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Activity className={`w-4 h-4 ${isRealTimeEnabled ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
                  {t('admin.realTimeMonitoring')}
                </span>
              </div>
              {isRealTimeEnabled && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 검색 */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('admin.searchPlaceholder.name')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 엑셀 다운로드 */}
            <button
              onClick={() => alert(t('admin.exportStarted'))}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t('admin.exportExcel')}</span>
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('admin.table.name')}
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('admin.table.track')}
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('admin.table.progress')}
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('admin.table.lastActive')}
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('admin.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{student.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      student.track === 'digital-basics' ? 'bg-blue-100 text-blue-700' :
                      student.track === 'marketing' ? 'bg-purple-100 text-purple-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {trackLabels[student.track]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            student.progress >= 80 ? 'bg-green-500' :
                            student.progress >= 50 ? 'bg-blue-500' :
                            'bg-amber-500'
                          }`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-500">{student.lastActive}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 결과 없음 */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('admin.noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
