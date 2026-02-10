import { useState, useEffect } from 'react';
import {
  Search,
  UserPlus,
  School,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Plus,
  Minus,
  X,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentsByInstructorCode, searchStudents, updateProfile } from '../../services/profileService';
import { getEnrollments, createEnrollment, updateEnrollmentStatus } from '../../services/enrollmentService';
import { SCHOOL_NAMES, SCHOOL_IDS, type SchoolId, type Enrollment } from '../../types/enrollment';
import type { ProfileRow } from '../../types/database';

interface StudentWithEnrollments extends ProfileRow {
  enrollments: Enrollment[];
}

export default function StudentEnrollmentManager() {
  const { user } = useAuth();
  const [myStudents, setMyStudents] = useState<StudentWithEnrollments[]>([]);
  const [searchResults, setSearchResults] = useState<StudentWithEnrollments[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [assignLoading, setAssignLoading] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithEnrollments | null>(null);

  // 표시할 학생 목록
  const displayStudents = isSearchMode ? searchResults : myStudents;

  // 내 학생 목록 로드
  const loadMyStudents = async () => {
    if (!user?.instructorCode) return;
    setIsLoading(true);
    const profiles = await getStudentsByInstructorCode(user.instructorCode);
    const withEnrollments = await Promise.all(
      profiles.map(async (profile) => {
        const enrollments = await getEnrollments(profile.id);
        return { ...profile, enrollments };
      }),
    );
    setMyStudents(withEnrollments);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMyStudents();
  }, []);

  // 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearchMode(false);
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    setIsSearchMode(true);
    const profiles = await searchStudents(searchQuery.trim());
    const withEnrollments = await Promise.all(
      profiles.map(async (profile) => {
        const enrollments = await getEnrollments(profile.id);
        return { ...profile, enrollments };
      }),
    );
    setSearchResults(withEnrollments);
    setIsLoading(false);
  };

  // 검색 초기화
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    setSearchResults([]);
    setSelectedStudent(null);
  };

  // 내 학생으로 담기
  const handleAssignStudent = async (student: StudentWithEnrollments) => {
    if (!user?.instructorCode) return;
    setAssignLoading(student.id);
    const success = await updateProfile(student.id, { instructor_code: user.instructorCode });
    if (success) {
      // 내 학생 목록 새로고침
      await loadMyStudents();
      // 검색 모드면 검색 결과도 업데이트
      if (isSearchMode) {
        setSearchResults(prev =>
          prev.map(s => s.id === student.id ? { ...s, instructor_code: user.instructorCode } : s),
        );
      }
    } else {
      alert('학생 담기에 실패했습니다. 다시 시도해주세요.');
    }
    setAssignLoading(null);
  };

  // 학교 연결
  const handleConnect = async (studentId: string, schoolId: SchoolId) => {
    setActionLoading(`${studentId}-${schoolId}`);
    const result = await createEnrollment(studentId, schoolId, user?.id ?? null);
    if (result) {
      await loadMyStudents();
      if (selectedStudent?.id === studentId) {
        const enrollments = await getEnrollments(studentId);
        setSelectedStudent((prev) => prev ? { ...prev, enrollments } : null);
      }
    }
    setActionLoading(null);
  };

  // 학교 해제 (일시정지)
  const handleDisconnect = async (enrollmentId: string, studentId: string) => {
    setActionLoading(enrollmentId);
    const success = await updateEnrollmentStatus(enrollmentId, 'suspended');
    if (success) {
      await loadMyStudents();
      if (selectedStudent?.id === studentId) {
        const enrollments = await getEnrollments(studentId);
        setSelectedStudent((prev) => prev ? { ...prev, enrollments } : null);
      }
    }
    setActionLoading(null);
  };

  // 학교 재연결
  const handleReactivate = async (enrollmentId: string, studentId: string) => {
    setActionLoading(enrollmentId);
    const success = await updateEnrollmentStatus(enrollmentId, 'active');
    if (success) {
      await loadMyStudents();
      if (selectedStudent?.id === studentId) {
        const enrollments = await getEnrollments(studentId);
        setSelectedStudent((prev) => prev ? { ...prev, enrollments } : null);
      }
    }
    setActionLoading(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'pending_info': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '수강 중';
      case 'pending_info': return '정보 대기';
      case 'suspended': return '일시정지';
      case 'completed': return '수료';
      default: return status;
    }
  };

  const isMyStudent = (student: StudentWithEnrollments) =>
    student.instructor_code === user?.instructorCode;

  return (
    <div className="space-y-6">
      {/* 검색 바 */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="학생 이메일 또는 이름으로 검색하여 내 학생으로 담기..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
        >
          검색
        </button>
        {isSearchMode && (
          <button
            onClick={handleClearSearch}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-medium transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            초기화
          </button>
        )}
      </div>

      {/* 모드 안내 */}
      {isSearchMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            "<span className="font-semibold">{searchQuery}</span>" 검색 결과입니다.
            내 학생이 아닌 경우 "내 학생으로 담기" 버튼으로 추가할 수 있습니다.
          </p>
        </div>
      )}

      <div className="flex gap-6">
        {/* 학생 목록 */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-500" />
            {isSearchMode ? `검색 결과 (${displayStudents.length}명)` : `내 학생 현황 (${displayStudents.length}명)`}
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : displayStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {isSearchMode ? '검색 결과가 없습니다.' : '등록된 학생이 없습니다.'}
              </p>
              {isSearchMode && (
                <p className="text-xs text-gray-400 mt-1">이메일 주소를 정확히 입력해보세요.</p>
              )}
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {displayStudents.map((student) => {
                const isMine = isMyStudent(student);
                return (
                  <div
                    key={student.id}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedStudent?.id === student.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        className="flex-1 text-left"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-gray-800">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </button>
                      <div className="flex items-center gap-2">
                        {/* 내 학생 뱃지 or 담기 버튼 */}
                        {isSearchMode && (
                          isMine ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg font-medium">
                              <UserCheck className="w-3.5 h-3.5" />
                              내 학생
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAssignStudent(student)}
                              disabled={assignLoading === student.id}
                              className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                              {assignLoading === student.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <UserPlus className="w-3.5 h-3.5" />
                              )}
                              내 학생으로 담기
                            </button>
                          )
                        )}
                        {/* 등록 상태 아이콘 */}
                        <div className="flex gap-1">
                          {student.enrollments
                            .filter((e) => e.status !== 'suspended')
                            .map((e) => (
                              <span key={e.id} className="flex items-center gap-1">
                                {getStatusIcon(e.status)}
                              </span>
                            ))}
                          {student.enrollments.filter((e) => e.status !== 'suspended').length === 0 && (
                            <span className="text-xs text-gray-400">미등록</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 학생 상세 & 학교 관리 */}
        {selectedStudent && (
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-4">
              <h3 className="font-semibold text-gray-800 text-lg mb-1">{selectedStudent.name}</h3>
              <p className="text-sm text-gray-500 mb-1">{selectedStudent.email}</p>
              {selectedStudent.organization && (
                <p className="text-xs text-gray-400 mb-4">{selectedStudent.organization}</p>
              )}

              <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
                <School className="w-4 h-4" />
                학교 등록 관리
              </h4>

              <div className="space-y-3">
                {SCHOOL_IDS.map((schoolId) => {
                  const enrollment = selectedStudent.enrollments.find((e) => e.school_id === schoolId);
                  const schoolName = SCHOOL_NAMES[schoolId];
                  const isActionLoading = actionLoading === `${selectedStudent.id}-${schoolId}` ||
                    (enrollment && actionLoading === enrollment.id);

                  return (
                    <div key={schoolId} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{schoolName.ko}</span>
                        {enrollment && (
                          <span className={`flex items-center gap-1 text-xs ${
                            enrollment.status === 'active' ? 'text-green-600' :
                            enrollment.status === 'pending_info' ? 'text-orange-600' : 'text-gray-400'
                          }`}>
                            {getStatusIcon(enrollment.status)}
                            {getStatusLabel(enrollment.status)}
                          </span>
                        )}
                      </div>

                      {isActionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      ) : !enrollment ? (
                        <button
                          onClick={() => handleConnect(selectedStudent.id, schoolId)}
                          className="w-full py-2 text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          학교 연결
                        </button>
                      ) : enrollment.status === 'suspended' ? (
                        <button
                          onClick={() => handleReactivate(enrollment.id, selectedStudent.id)}
                          className="w-full py-2 text-sm font-medium bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          재연결
                        </button>
                      ) : enrollment.status === 'active' ? (
                        <button
                          onClick={() => handleDisconnect(enrollment.id, selectedStudent.id)}
                          className="w-full py-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Minus className="w-4 h-4" />
                          연결 해제
                        </button>
                      ) : enrollment.status === 'pending_info' ? (
                        <p className="text-xs text-orange-500 text-center">학생이 추가 정보 입력 대기 중</p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
