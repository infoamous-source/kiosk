import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  BookOpen,
  Download,
  Search,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  Building2,
  Mail,
  User,
  RefreshCw,
  Activity,
  ChevronRight,
  Settings2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import ContentManager from './ContentManager';

type DashboardTab = 'students' | 'content';

// 검색 타입 정의
type SortType = 'name' | 'email' | 'organization' | 'progress' | 'lastActive';
type SortOrder = 'asc' | 'desc';

// 더미 데이터 (기관 코드 추가)
const dummyStudents = [
  { id: '1', name: '김민수', email: 'minsu@test.com', track: 'digital-basics', progress: 75, lastActive: '2024-01-15', instructorCode: 'INST-001', orgCode: 'ORG-001', organization: '서울다문화센터' },
  { id: '2', name: 'John Smith', email: 'john@test.com', track: 'marketing', progress: 45, lastActive: '2024-01-14', instructorCode: 'INST-001', orgCode: 'ORG-002', organization: '부산외국인지원센터' },
  { id: '3', name: '田中花子', email: 'hanako@test.com', track: 'career', progress: 90, lastActive: '2024-01-15', instructorCode: 'INST-001', orgCode: 'ORG-001', organization: '서울다문화센터' },
  { id: '4', name: '이영희', email: 'younghee@test.com', track: 'digital-basics', progress: 30, lastActive: '2024-01-13', instructorCode: 'INST-001', orgCode: 'ORG-003', organization: '인천글로벌센터' },
  { id: '5', name: 'Maria Garcia', email: 'maria@test.com', track: 'marketing', progress: 60, lastActive: '2024-01-15', instructorCode: 'INST-001', orgCode: 'ORG-002', organization: '부산외국인지원센터' },
  { id: '6', name: '박지현', email: 'jihyun@test.com', track: 'career', progress: 85, lastActive: '2024-01-15', instructorCode: 'INST-001', orgCode: 'ORG-001', organization: '서울다문화센터' },
  { id: '7', name: 'Ahmed Hassan', email: 'ahmed@test.com', track: 'digital-basics', progress: 55, lastActive: '2024-01-14', instructorCode: 'INST-001', orgCode: 'ORG-003', organization: '인천글로벌센터' },
];

const progressByTrack = [
  { name: 'Digital', value: 45 },
  { name: 'Marketing', value: 32 },
  { name: 'Career', value: 23 },
];

const weeklyActivity = [
  { day: 'Mon', active: 24 },
  { day: 'Tue', active: 32 },
  { day: 'Wed', active: 28 },
  { day: 'Thu', active: 45 },
  { day: 'Fri', active: 38 },
  { day: 'Sat', active: 18 },
  { day: 'Sun', active: 12 },
];

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981'];

export default function AdminDashboard() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [sortType, setSortType] = useState<SortType>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [realtimeStudents, setRealtimeStudents] = useState(dummyStudents);

  // 실시간 업데이트 시뮬레이션 (WebSocket 대체)
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      setRealtimeStudents(prev => {
        // 랜덤하게 학생 진도 업데이트 시뮬레이션
        const randomIndex = Math.floor(Math.random() * prev.length);
        const randomProgress = Math.min(100, prev[randomIndex].progress + Math.floor(Math.random() * 5));

        return prev.map((student, index) =>
          index === randomIndex
            ? { ...student, progress: randomProgress, lastActive: new Date().toISOString().split('T')[0] }
            : student
        );
      });
      setLastUpdate(new Date());
    }, 10000); // 10초마다 업데이트

    return () => clearInterval(interval);
  }, [isRealTimeEnabled]);

  // 한글 정렬 함수 (ㄱㄴㄷ 정렬용)
  const koreanSort = useCallback((a: string, b: string): number => {
    return a.localeCompare(b, 'ko');
  }, []);

  // 필터링 로직 - 이름, 이메일, 기관명, 기관코드 통합 검색
  const filteredStudents = realtimeStudents.filter((student) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query ||
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.organization.toLowerCase().includes(query) ||
      student.orgCode.toLowerCase().includes(query);

    const matchesTrack = selectedTrack === 'all' || student.track === selectedTrack;
    return matchesSearch && matchesTrack;
  });

  // 정렬 로직
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let comparison = 0;

    switch (sortType) {
      case 'name':
        comparison = koreanSort(a.name, b.name);
        break;
      case 'email':
        comparison = a.email.localeCompare(b.email);
        break;
      case 'organization':
        comparison = koreanSort(a.organization, b.organization);
        break;
      case 'progress':
        comparison = a.progress - b.progress;
        break;
      case 'lastActive':
        comparison = new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime();
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // 기관별 그룹핑
  const organizationGroups = realtimeStudents.reduce((acc, student) => {
    if (!acc[student.orgCode]) {
      acc[student.orgCode] = {
        name: student.organization,
        orgCode: student.orgCode,
        students: [],
        avgProgress: 0,
      };
    }
    acc[student.orgCode].students.push(student);
    return acc;
  }, {} as Record<string, { name: string; orgCode: string; students: typeof dummyStudents; avgProgress: number }>);

  // 기관별 평균 진도율 계산
  Object.values(organizationGroups).forEach(org => {
    org.avgProgress = Math.round(
      org.students.reduce((sum, s) => sum + s.progress, 0) / org.students.length
    );
  });

  const handleExportExcel = () => {
    // TODO: 실제 엑셀 내보내기 기능
    alert(t('admin.exportStarted'));
  };

  const handleSortToggle = (type: SortType) => {
    if (sortType === type) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortType(type);
      setSortOrder('asc');
    }
  };

  const trackLabels: Record<string, string> = {
    'digital-basics': 'Digital Basics',
    'marketing': 'Marketing',
    'career': 'Career',
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('admin.title')}</h1>
        <p className="text-gray-500 mt-1">
          {t('admin.welcome', { name: user?.name })} • {t('admin.instructorCode')}: <span className="font-mono font-semibold">{user?.instructorCode}</span>
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
            activeTab === 'students'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="w-4 h-4" />
          {t('admin.tabs.students')}
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
            activeTab === 'content'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          {t('admin.tabs.content')}
        </button>
      </div>

      {/* 콘텐츠 관리 탭 */}
      {activeTab === 'content' && <ContentManager />}

      {/* 학생 현황 탭 */}
      {activeTab === 'students' && (
      <>
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{dummyStudents.length}</p>
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
              <p className="text-2xl font-bold text-gray-800">62%</p>
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
              <p className="text-2xl font-bold text-gray-800">156</p>
              <p className="text-xs text-gray-500">{t('admin.completedModules')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">+12%</p>
              <p className="text-xs text-gray-500">{t('admin.weeklyGrowth')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 주간 활동 차트 */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">{t('admin.weeklyActivity')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="active" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 트랙별 분포 */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">{t('admin.trackDistribution')}</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={progressByTrack}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {progressByTrack.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {progressByTrack.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 기관별 현황 섹션 */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            {t('admin.organizationOverview')}
          </h3>
          <button
            onClick={() => navigate('/admin/organizations')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            {t('admin.viewAll')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(organizationGroups).map((org) => (
            <button
              key={org.orgCode}
              onClick={() => navigate(`/admin/organization/${org.orgCode}`)}
              className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800 group-hover:text-purple-700">{org.name}</span>
                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">{org.orgCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{org.students.length}{t('admin.studentCount')}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${org.avgProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{org.avgProgress}%</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 학생 목록 테이블 */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          {/* 상단: 제목 & 실시간 모니터링 토글 */}
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
                  {t('admin.lastUpdate')}: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* 검색 & 필터 영역 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* 검색 입력 */}
            <div className="w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder=""
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-72 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 ml-1">
                {t('admin.searchHint')}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
              {/* 정렬 옵션 버튼 그룹 */}
              <div className="flex bg-gray-100 rounded-lg p-1 flex-wrap">
                {([
                  { type: 'name' as SortType, icon: User, label: t('admin.sortBy.name') },
                  { type: 'email' as SortType, icon: Mail, label: t('admin.sortBy.email') },
                  { type: 'organization' as SortType, icon: Building2, label: t('admin.sortBy.organization') },
                  { type: 'progress' as SortType, icon: TrendingUp, label: t('admin.sortBy.progress') },
                ] as const).map(({ type, icon: SortIcon, label }) => (
                  <button
                    key={type}
                    onClick={() => handleSortToggle(type)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      sortType === type
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title={label}
                  >
                    <SortIcon className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">{label.split(' ')[0]}</span>
                    {sortType === type && (
                      <ArrowUpDown className={`w-3 h-3 ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform`} />
                    )}
                  </button>
                ))}
              </div>

              {/* 트랙 필터 */}
              <div className="relative">
                <select
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">{t('admin.allTracks')}</option>
                  <option value="digital-basics">Digital Basics</option>
                  <option value="marketing">Marketing</option>
                  <option value="career">Career</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* 엑셀 다운로드 */}
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t('admin.exportExcel')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSortToggle('name')}
                >
                  <div className="flex items-center gap-1">
                    {t('admin.table.name')}
                    {sortType === 'name' && <ArrowUpDown className="w-3 h-3" />}
                  </div>
                </th>
                <th
                  className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSortToggle('organization')}
                >
                  <div className="flex items-center gap-1">
                    {t('admin.table.organization')}
                    {sortType === 'organization' && <ArrowUpDown className="w-3 h-3" />}
                  </div>
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('admin.table.track')}
                </th>
                <th
                  className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSortToggle('progress')}
                >
                  <div className="flex items-center gap-1">
                    {t('admin.table.progress')}
                    {sortType === 'progress' && <ArrowUpDown className="w-3 h-3" />}
                  </div>
                </th>
                <th
                  className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSortToggle('lastActive')}
                >
                  <div className="flex items-center gap-1">
                    {t('admin.table.lastActive')}
                    {sortType === 'lastActive' && <ArrowUpDown className="w-3 h-3" />}
                  </div>
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('admin.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedStudents.map((student) => (
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
                    <button
                      onClick={() => navigate(`/admin/organization/${student.orgCode}`)}
                      className="text-left hover:text-purple-600 transition-colors"
                    >
                      <p className="text-sm text-gray-700 font-medium">{student.organization}</p>
                      <p className="text-xs text-gray-400 font-mono">{student.orgCode}</p>
                    </button>
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
          {sortedStudents.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('admin.noResults')}</p>
            </div>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
}
