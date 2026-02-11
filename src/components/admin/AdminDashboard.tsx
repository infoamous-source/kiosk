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
  GraduationCap,
  UserPlus,
  UsersRound,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { getStudentsByInstructorCode } from '../../services/profileService';
import { getEnrollments } from '../../services/enrollmentService';
import type { ProfileRow } from '../../types/database';
import ContentManager from './ContentManager';
import SchoolManagement from './SchoolManagement';
import StudentEnrollmentManager from './StudentEnrollmentManager';
import TeamManagement from './TeamManagement';

type DashboardTab = 'students' | 'content' | 'school' | 'enrollment' | 'teams';

// 정렬 타입
type SortType = 'name' | 'email' | 'organization' | 'lastActive';
type SortOrder = 'asc' | 'desc';

// 실시간 학생 데이터 타입
interface RealStudent {
  id: string;
  name: string;
  email: string;
  organization: string;
  orgCode: string;
  instructorCode: string;
  enrollmentStatus: string; // 'active' | 'pending_info' | 'none'
  country: string | null;
  createdAt: string;
}

export default function AdminDashboard() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [realtimeStudents, setRealtimeStudents] = useState<RealStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 실제 Supabase 데이터 로드
  useEffect(() => {
    if (!user?.instructorCode) return;

    const loadStudents = async () => {
      setIsLoading(true);
      try {
        const profiles = await getStudentsByInstructorCode(user.instructorCode);
        const enriched = await Promise.all(
          profiles.map(async (p: ProfileRow) => {
            const enrollments = await getEnrollments(p.id);
            const marketingEnrollment = enrollments.find(e => e.school_id === 'marketing');
            return {
              id: p.id,
              name: p.name,
              email: p.email,
              organization: p.organization || '',
              orgCode: p.org_code || '',
              instructorCode: p.instructor_code || '',
              enrollmentStatus: marketingEnrollment?.status ?? 'none',
              country: p.country,
              createdAt: p.created_at,
            };
          }),
        );
        setRealtimeStudents(enriched);
        setLastUpdate(new Date());
      } catch (err) {
        console.error('[AdminDashboard] Failed to load students:', err);
      }
      setIsLoading(false);
    };

    loadStudents();
  }, [user]);

  // Supabase Realtime 구독 — 새 학생 가입 시 자동 추가
  useEffect(() => {
    if (!isRealTimeEnabled || !user?.instructorCode) return;

    const channel = supabase
      .channel('instructor-students')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles',
          filter: `instructor_code=eq.${user.instructorCode}`,
        },
        async (payload) => {
          const newProfile = payload.new as ProfileRow;
          if (newProfile.role !== 'student') return;
          const enrollments = await getEnrollments(newProfile.id);
          const marketingEnrollment = enrollments.find(e => e.school_id === 'marketing');
          const newStudent: RealStudent = {
            id: newProfile.id,
            name: newProfile.name,
            email: newProfile.email,
            organization: newProfile.organization || '',
            orgCode: newProfile.org_code || '',
            instructorCode: newProfile.instructor_code || '',
            enrollmentStatus: marketingEnrollment?.status ?? 'none',
            country: newProfile.country,
            createdAt: newProfile.created_at,
          };
          setRealtimeStudents(prev => [newStudent, ...prev]);
          setLastUpdate(new Date());
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isRealTimeEnabled, user]);

  // 한글 정렬
  const koreanSort = useCallback((a: string, b: string): number => {
    return a.localeCompare(b, 'ko');
  }, []);

  // 필터링
  const filteredStudents = realtimeStudents.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      !query ||
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.organization.toLowerCase().includes(query) ||
      student.orgCode.toLowerCase().includes(query)
    );
  });

  // 정렬
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
      case 'lastActive':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // 기관별 그룹핑
  const organizationGroups = realtimeStudents.reduce(
    (acc, student) => {
      const key = student.orgCode || 'unknown';
      if (!acc[key]) {
        acc[key] = {
          name: student.organization || '미지정',
          orgCode: key,
          students: [],
          activeCount: 0,
        };
      }
      acc[key].students.push(student);
      if (student.enrollmentStatus === 'active') acc[key].activeCount++;
      return acc;
    },
    {} as Record<string, { name: string; orgCode: string; students: RealStudent[]; activeCount: number }>,
  );

  const handleExportExcel = () => {
    alert(t('admin.exportStarted'));
  };

  const handleSortToggle = (type: SortType) => {
    if (sortType === type) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortType(type);
      setSortOrder('asc');
    }
  };

  const handleRefresh = async () => {
    if (!user?.instructorCode) return;
    setIsLoading(true);
    const profiles = await getStudentsByInstructorCode(user.instructorCode);
    const enriched = await Promise.all(
      profiles.map(async (p: ProfileRow) => {
        const enrollments = await getEnrollments(p.id);
        const marketingEnrollment = enrollments.find(e => e.school_id === 'marketing');
        return {
          id: p.id,
          name: p.name,
          email: p.email,
          organization: p.organization || '',
          orgCode: p.org_code || '',
          instructorCode: p.instructor_code || '',
          enrollmentStatus: marketingEnrollment?.status ?? 'none',
          country: p.country,
          createdAt: p.created_at,
        };
      }),
    );
    setRealtimeStudents(enriched);
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  // 통계
  const totalStudents = realtimeStudents.length;
  const activeEnrollments = realtimeStudents.filter(s => s.enrollmentStatus === 'active').length;
  const orgCount = Object.keys(organizationGroups).length;

  const enrollmentStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return { text: '활성', className: 'bg-green-100 text-green-700' };
      case 'pending_info': return { text: '대기', className: 'bg-amber-100 text-amber-700' };
      default: return { text: '미등록', className: 'bg-gray-100 text-gray-500' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('admin.title')}</h1>
        <p className="text-gray-500 mt-1">
          {t('admin.welcome', { name: user?.name })} • {t('admin.instructorCode')}:{' '}
          <span className="font-mono font-semibold">{user?.instructorCode}</span>
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 overflow-x-auto">
        {([
          { id: 'students' as DashboardTab, icon: Users, label: '학생 계정' },
          { id: 'teams' as DashboardTab, icon: UsersRound, label: '팀 관리' },
          { id: 'content' as DashboardTab, icon: Settings2, label: t('admin.tabs.content') },
          { id: 'school' as DashboardTab, icon: GraduationCap, label: '학습 진행' },
          { id: 'enrollment' as DashboardTab, icon: UserPlus, label: '등록 관리' },
        ]).map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 콘텐츠 관리 탭 */}
      {activeTab === 'content' && <ContentManager />}
      {activeTab === 'school' && <SchoolManagement />}
      {activeTab === 'enrollment' && <StudentEnrollmentManager />}
      {activeTab === 'teams' && <TeamManagement />}

      {/* 학생 현황 탭 */}
      {activeTab === 'students' && (
        <>
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
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
                  <p className="text-2xl font-bold text-gray-800">{activeEnrollments}</p>
                  <p className="text-xs text-gray-500">활성 등록</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{orgCount}</p>
                  <p className="text-xs text-gray-500">소속 기관</p>
                </div>
              </div>
            </div>
          </div>

          {/* 기관별 현황 */}
          {orgCount > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-purple-600" />
                {t('admin.organizationOverview')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(organizationGroups).map(org => (
                  <div
                    key={org.orgCode}
                    className="p-4 border border-gray-200 rounded-xl text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{org.name}</span>
                      <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {org.orgCode}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {org.students.length}명 (활성 {org.activeCount}명)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 학생 목록 테이블 */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              {/* 상단: 제목 & 실시간 모니터링 */}
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
                      <Activity
                        className={`w-4 h-4 ${isRealTimeEnabled ? 'text-green-500 animate-pulse' : 'text-gray-400'}`}
                      />
                      {t('admin.realTimeMonitoring')}
                    </span>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="새로고침"
                  >
                    <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <span className="text-xs text-gray-400">
                    {t('admin.lastUpdate')}: {lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* 검색 & 필터 */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t('admin.searchHint')}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full sm:w-72 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 ml-1">{t('admin.searchHint')}</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
                  {/* 정렬 버튼 */}
                  <div className="flex bg-gray-100 rounded-lg p-1 flex-wrap">
                    {(
                      [
                        { type: 'name' as SortType, icon: User, label: t('admin.sortBy.name') },
                        { type: 'email' as SortType, icon: Mail, label: t('admin.sortBy.email') },
                        { type: 'organization' as SortType, icon: Building2, label: t('admin.sortBy.organization') },
                      ] as const
                    ).map(({ type, icon: SortIcon, label }) => (
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
                          <ArrowUpDown
                            className={`w-3 h-3 ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform`}
                          />
                        )}
                      </button>
                    ))}
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

            {/* 로딩 */}
            {isLoading && realtimeStudents.length === 0 && (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-gray-300 mx-auto mb-3 animate-spin" />
                <p className="text-gray-500 text-sm">학생 데이터를 불러오는 중...</p>
              </div>
            )}

            {/* 테이블 */}
            {!isLoading || realtimeStudents.length > 0 ? (
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
                        등록 상태
                      </th>
                      <th
                        className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSortToggle('lastActive')}
                      >
                        <div className="flex items-center gap-1">
                          가입일
                          {sortType === 'lastActive' && <ArrowUpDown className="w-3 h-3" />}
                        </div>
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {t('admin.table.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedStudents.map(student => {
                      const status = enrollmentStatusLabel(student.enrollmentStatus);
                      return (
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
                            <p className="text-sm text-gray-700 font-medium">{student.organization || '-'}</p>
                            {student.orgCode && (
                              <p className="text-xs text-gray-400 font-mono">{student.orgCode}</p>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}
                            >
                              {status.text}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-gray-500">
                              {new Date(student.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* 결과 없음 */}
                {sortedStudents.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">{t('admin.noResults')}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      강사 코드 <span className="font-mono font-semibold">{user?.instructorCode}</span>로 등록한
                      학생이 없습니다.
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
