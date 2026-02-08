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
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllStudents, searchStudents } from '../../services/profileService';
import { getEnrollments, createEnrollment, updateEnrollmentStatus } from '../../services/enrollmentService';
import { SCHOOL_NAMES, SCHOOL_IDS, type SchoolId, type Enrollment } from '../../types/enrollment';
import type { ProfileRow } from '../../types/database';

interface StudentWithEnrollments extends ProfileRow {
  enrollments: Enrollment[];
}

export default function StudentEnrollmentManager() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentWithEnrollments[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithEnrollments | null>(null);

  // 학생 목록 로드
  const loadStudents = async () => {
    setIsLoading(true);
    const profiles = searchQuery
      ? await searchStudents(searchQuery)
      : await getAllStudents();

    // 각 학생의 enrollment도 조회
    const withEnrollments = await Promise.all(
      profiles.map(async (profile) => {
        const enrollments = await getEnrollments(profile.id);
        return { ...profile, enrollments };
      }),
    );

    setStudents(withEnrollments);
    setIsLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // 검색
  const handleSearch = async () => {
    await loadStudents();
  };

  // 학교 연결
  const handleConnect = async (studentId: string, schoolId: SchoolId) => {
    setActionLoading(`${studentId}-${schoolId}`);
    const result = await createEnrollment(studentId, schoolId, user?.id ?? null);
    if (result) {
      await loadStudents();
      // 선택된 학생 정보도 업데이트
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
      await loadStudents();
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
      await loadStudents();
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
            placeholder="학생 이름 또는 이메일로 검색..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
        >
          검색
        </button>
      </div>

      <div className="flex gap-6">
        {/* 학생 목록 */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-500" />
            학생 목록 ({students.length}명)
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : students.length === 0 ? (
            <p className="text-center text-gray-400 py-12">등록된 학생이 없습니다.</p>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedStudent?.id === student.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
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
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 학생 상세 & 학교 관리 */}
        {selectedStudent && (
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-4">
              <h3 className="font-semibold text-gray-800 text-lg mb-1">{selectedStudent.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{selectedStudent.email}</p>

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
