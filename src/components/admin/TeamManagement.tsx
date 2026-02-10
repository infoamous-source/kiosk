import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Trash2,
  Users,
  UsersRound,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square,
  RefreshCw,
  Gem,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentsByInstructorCode } from '../../services/profileService';
import {
  createClassroomGroup,
  getClassroomGroups,
  deleteClassroomGroup,
  addClassroomMember,
  getClassroomMembers,
  removeClassroomMember,
  createTeam,
  getTeams,
  deleteTeam,
  addTeamMember,
  getTeamMembers,
  removeTeamMember,
} from '../../services/teamService';
import type { ProfileRow } from '../../types/database';
import type {
  ClassroomGroup,
  ClassroomMember,
  TeamGroup,
  TeamMember,
} from '../../types/team';

// ─── 학과(트랙) 옵션 ───
const TRACK_OPTIONS = [
  { value: 'marketing', label: '마케팅 학과', color: 'purple' },
  { value: 'digital', label: '디지털 학과', color: 'blue' },
  { value: 'career', label: '취업 학과', color: 'green' },
] as const;

// ─── 교실 상세 (멤버+팀) ───
interface ClassroomDetail {
  group: ClassroomGroup;
  members: ClassroomMember[];
  teams: TeamWithMembers[];
}

interface TeamWithMembers {
  team: TeamGroup;
  members: TeamMember[];
}

export default function TeamManagement() {
  const { user } = useAuth();

  // 전체 학생 목록
  const [allStudents, setAllStudents] = useState<ProfileRow[]>([]);
  // 교실 목록 + 상세
  const [classrooms, setClassrooms] = useState<ClassroomDetail[]>([]);
  // 선택된 교실 ID
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);
  // 로딩
  const [isLoading, setIsLoading] = useState(true);

  // ─── 교실 생성 모달 ───
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassroomName, setNewClassroomName] = useState('');
  const [newClassroomTrack, setNewClassroomTrack] = useState('marketing');

  // ─── 학생 배정 모드 ───
  const [isAssignMode, setIsAssignMode] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());

  // ─── 팀 생성 ───
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  // ─── 팀 배정 모드 ───
  const [isTeamAssignMode, setIsTeamAssignMode] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());
  const [targetTeamId, setTargetTeamId] = useState<string | null>(null);

  // ─── 데이터 로드 ───
  const loadData = useCallback(async () => {
    if (!user?.id || !user?.instructorCode) return;
    setIsLoading(true);

    try {
      // 1. 전체 학생 로드
      const students = await getStudentsByInstructorCode(user.instructorCode);
      setAllStudents(students);

      // 2. 교실 목록 로드
      const groups = await getClassroomGroups(user.id);

      // 3. 각 교실별 멤버 + 팀 로드
      const details: ClassroomDetail[] = await Promise.all(
        groups.map(async (group) => {
          const members = await getClassroomMembers(group.id);
          const teamGroups = await getTeams(group.id);
          const teams: TeamWithMembers[] = await Promise.all(
            teamGroups.map(async (t) => {
              const teamMembers = await getTeamMembers(t.id);
              return { team: t, members: teamMembers };
            }),
          );
          return { group, members, teams };
        }),
      );

      setClassrooms(details);
    } catch (err) {
      console.error('[TeamManagement] loadData error:', err);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── 선택된 교실 ───
  const selectedClassroom = classrooms.find(c => c.group.id === selectedClassroomId) || null;

  // ─── 교실에 배정되지 않은 학생 ───
  const assignedUserIds = new Set<string>();
  classrooms.forEach(c => c.members.forEach(m => assignedUserIds.add(m.user_id)));
  const unassignedStudents = allStudents.filter(s => !assignedUserIds.has(s.id));

  // ─── 교실 멤버 중 팀 미배정 ───
  const getUnassignedMembers = (classroom: ClassroomDetail): ClassroomMember[] => {
    const teamUserIds = new Set<string>();
    classroom.teams.forEach(t => t.members.forEach(m => teamUserIds.add(m.user_id)));
    return classroom.members.filter(m => !teamUserIds.has(m.user_id));
  };

  // ─── 교실 생성 ───
  const handleCreateClassroom = async () => {
    if (!user?.id || !newClassroomName.trim()) return;
    const orgCode = user.orgCode || 'default';
    const result = await createClassroomGroup(user.id, orgCode, newClassroomTrack, newClassroomName.trim());
    if (result) {
      setShowCreateModal(false);
      setNewClassroomName('');
      await loadData();
      setSelectedClassroomId(result.id);
    } else {
      alert('교실 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // ─── 교실 삭제 ───
  const handleDeleteClassroom = async (groupId: string) => {
    if (!confirm('이 교실을 삭제하시겠습니까? 소속 팀도 모두 삭제됩니다.')) return;
    await deleteClassroomGroup(groupId);
    if (selectedClassroomId === groupId) setSelectedClassroomId(null);
    await loadData();
  };

  // ─── 학생 교실 배정 ───
  const handleAssignStudents = async () => {
    if (!selectedClassroomId || selectedStudentIds.size === 0) return;
    for (const studentId of selectedStudentIds) {
      const student = allStudents.find(s => s.id === studentId);
      if (student) {
        await addClassroomMember(selectedClassroomId, student.id, student.name);
      }
    }
    setSelectedStudentIds(new Set());
    setIsAssignMode(false);
    await loadData();
  };

  // ─── 교실에서 학생 제거 ───
  const handleRemoveMember = async (memberId: string) => {
    await removeClassroomMember(memberId);
    await loadData();
  };

  // ─── 팀 생성 ───
  const handleCreateTeam = async () => {
    if (!user?.id || !selectedClassroomId || !newTeamName.trim()) return;
    const result = await createTeam(selectedClassroomId, newTeamName.trim(), user.id);
    if (!result) {
      alert('팀 생성에 실패했습니다. 다시 시도해주세요.');
      return;
    }
    setShowCreateTeamModal(false);
    setNewTeamName('');
    await loadData();
  };

  // ─── 팀 삭제 ───
  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('이 팀을 삭제하시겠습니까?')) return;
    await deleteTeam(teamId);
    await loadData();
  };

  // ─── 멤버 팀 배정 ───
  const handleAssignToTeam = async () => {
    if (!targetTeamId || selectedMemberIds.size === 0 || !selectedClassroom) return;
    for (const memberId of selectedMemberIds) {
      const member = selectedClassroom.members.find(m => m.id === memberId);
      if (member) {
        await addTeamMember(targetTeamId, member.user_id, member.user_name);
      }
    }
    setSelectedMemberIds(new Set());
    setIsTeamAssignMode(false);
    setTargetTeamId(null);
    await loadData();
  };

  // ─── 팀에서 멤버 제거 ───
  const handleRemoveTeamMember = async (teamMemberId: string) => {
    await removeTeamMember(teamMemberId);
    await loadData();
  };

  // ─── 트랙 라벨/컬러 ───
  const trackInfo = (track: string) => {
    const t = TRACK_OPTIONS.find(o => o.value === track);
    if (!t) return { label: track, colorClass: 'bg-gray-100 text-gray-600' };
    const colors: Record<string, string> = {
      purple: 'bg-purple-100 text-purple-700',
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
    };
    return { label: t.label, colorClass: colors[t.color] || 'bg-gray-100 text-gray-600' };
  };

  // ─── 로딩 ───
  if (isLoading && classrooms.length === 0) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-8 h-8 text-gray-300 mx-auto mb-3 animate-spin" />
        <p className="text-gray-500 text-sm">팀 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── 상단: 교실 목록 + 생성 ─── */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            교실 관리
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              교실 생성
            </button>
          </div>
        </div>

        {/* 교실 목록 */}
        {classrooms.length === 0 ? (
          <div className="text-center py-8">
            <UsersRound className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">아직 생성된 교실이 없습니다.</p>
            <p className="text-gray-400 text-xs mt-1">
              "교실 생성" 버튼으로 첫 교실을 만들어보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {classrooms.map(c => {
              const info = trackInfo(c.group.track);
              const isSelected = selectedClassroomId === c.group.id;
              return (
                <button
                  key={c.group.id}
                  onClick={() => setSelectedClassroomId(isSelected ? null : c.group.id)}
                  className={`p-4 border rounded-xl text-left transition-all ${
                    isSelected
                      ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-gray-800 text-sm">{c.group.classroom_name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${info.colorClass}`}>
                      {info.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {c.members.length}명
                    </span>
                    <span className="flex items-center gap-1">
                      <UsersRound className="w-3 h-3" />
                      {c.teams.length}개 팀
                    </span>
                  </div>
                  {isSelected && (
                    <ChevronDown className="w-4 h-4 text-purple-500 mt-2 mx-auto" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 선택된 교실 상세 ─── */}
      {selectedClassroom && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-6">
          {/* 교실 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-purple-500" />
                {selectedClassroom.group.classroom_name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {trackInfo(selectedClassroom.group.track).label} • {selectedClassroom.members.length}명 • {selectedClassroom.teams.length}개 팀
              </p>
            </div>
            <button
              onClick={() => handleDeleteClassroom(selectedClassroom.group.id)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="교실 삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* ─ 교실 멤버 ─ */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                교실 멤버 ({selectedClassroom.members.length}명)
              </h4>
              <button
                onClick={() => setIsAssignMode(!isAssignMode)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isAssignMode
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isAssignMode ? '배정 취소' : '+ 학생 배정'}
              </button>
            </div>

            {/* 학생 배정 모드 */}
            {isAssignMode && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3">
                <p className="text-xs text-blue-600 font-medium mb-2">
                  배정할 학생을 선택하세요 (미배정: {unassignedStudents.length}명)
                </p>
                {unassignedStudents.length === 0 ? (
                  <p className="text-xs text-gray-500">모든 학생이 이미 교실에 배정되어 있습니다.</p>
                ) : (
                  <>
                    <div className="max-h-40 overflow-y-auto space-y-1 mb-3">
                      {unassignedStudents.map(s => (
                        <label
                          key={s.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
                        >
                          {selectedStudentIds.has(s.id) ? (
                            <CheckSquare
                              className="w-4 h-4 text-blue-600 flex-shrink-0"
                              onClick={() => {
                                const next = new Set(selectedStudentIds);
                                next.delete(s.id);
                                setSelectedStudentIds(next);
                              }}
                            />
                          ) : (
                            <Square
                              className="w-4 h-4 text-gray-400 flex-shrink-0"
                              onClick={() => {
                                const next = new Set(selectedStudentIds);
                                next.add(s.id);
                                setSelectedStudentIds(next);
                              }}
                            />
                          )}
                          <span className="text-sm text-gray-700">{s.name}</span>
                          <span className="text-xs text-gray-400">{s.email}</span>
                        </label>
                      ))}
                    </div>
                    <button
                      onClick={handleAssignStudents}
                      disabled={selectedStudentIds.size === 0}
                      className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {selectedStudentIds.size}명 배정하기
                    </button>
                  </>
                )}
              </div>
            )}

            {/* 멤버 목록 */}
            {selectedClassroom.members.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">아직 배정된 학생이 없습니다.</p>
            ) : (
              <div className="space-y-1">
                {selectedClassroom.members.map(m => (
                  <div
                    key={m.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors ${
                      isTeamAssignMode ? 'cursor-pointer' : ''
                    } ${
                      selectedMemberIds.has(m.id) ? 'bg-green-50 ring-1 ring-green-200' : ''
                    }`}
                    onClick={() => {
                      if (!isTeamAssignMode) return;
                      const next = new Set(selectedMemberIds);
                      if (next.has(m.id)) next.delete(m.id);
                      else next.add(m.id);
                      setSelectedMemberIds(next);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {isTeamAssignMode && (
                        selectedMemberIds.has(m.id) ? (
                          <CheckSquare className="w-4 h-4 text-green-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )
                      )}
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{m.user_name[0]}</span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{m.user_name}</span>
                    </div>
                    {!isTeamAssignMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveMember(m.id);
                        }}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                        title="멤버 제거"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─ 팀 관리 ─ */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                <UsersRound className="w-4 h-4 text-green-500" />
                팀 목록 ({selectedClassroom.teams.length}개)
              </h4>
              <div className="flex items-center gap-2">
                {selectedClassroom.members.length > 0 && (
                  <button
                    onClick={() => {
                      setIsTeamAssignMode(!isTeamAssignMode);
                      if (isTeamAssignMode) {
                        setSelectedMemberIds(new Set());
                        setTargetTeamId(null);
                      }
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      isTeamAssignMode
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isTeamAssignMode ? '배정 취소' : '팀 배정 모드'}
                  </button>
                )}
                <button
                  onClick={() => setShowCreateTeamModal(true)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  팀 생성
                </button>
              </div>
            </div>

            {/* 팀 배정 바 */}
            {isTeamAssignMode && selectedMemberIds.size > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 flex items-center gap-3">
                <span className="text-xs text-green-700 font-medium flex-shrink-0">
                  {selectedMemberIds.size}명 선택 →
                </span>
                <select
                  value={targetTeamId || ''}
                  onChange={e => setTargetTeamId(e.target.value || null)}
                  className="flex-1 text-sm border border-green-300 rounded-lg px-2 py-1.5 bg-white"
                >
                  <option value="">팀 선택...</option>
                  {selectedClassroom.teams.map(t => (
                    <option key={t.team.id} value={t.team.id}>{t.team.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleAssignToTeam}
                  disabled={!targetTeamId}
                  className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  배정
                </button>
              </div>
            )}

            {/* 팀 목록 */}
            {selectedClassroom.teams.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">아직 생성된 팀이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {selectedClassroom.teams.map(t => (
                  <div key={t.team.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800 flex items-center gap-2">
                        <Gem className="w-4 h-4 text-amber-500" />
                        {t.team.name}
                        <span className="text-xs text-gray-400">({t.members.length}명)</span>
                      </span>
                      <button
                        onClick={() => handleDeleteTeam(t.team.id)}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                        title="팀 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {t.members.length === 0 ? (
                      <p className="text-xs text-gray-400">팀원이 없습니다</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {t.members.map(m => (
                          <div
                            key={m.id}
                            className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg group"
                          >
                            <span className="text-sm">{m.animal_icon || '👤'}</span>
                            <span className="text-xs text-gray-700 font-medium">{m.user_name}</span>
                            {m.aptitude_type && (
                              <span className="text-xs text-gray-400">({m.aptitude_type})</span>
                            )}
                            <button
                              onClick={() => handleRemoveTeamMember(m.id)}
                              className="ml-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 팀 미배정 멤버 */}
            {selectedClassroom.members.length > 0 && (
              (() => {
                const unassigned = getUnassignedMembers(selectedClassroom);
                if (unassigned.length === 0) return null;
                return (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs text-amber-700 font-medium mb-2">
                      팀 미배정 ({unassigned.length}명)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {unassigned.map(m => (
                        <span
                          key={m.id}
                          className="text-xs bg-white border border-amber-200 px-2.5 py-1 rounded-full text-amber-700"
                        >
                          {m.user_name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}

      {/* ─── 교실 생성 모달 ─── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-4">교실 생성</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 font-medium mb-1 block">교실 이름</label>
                <input
                  type="text"
                  value={newClassroomName}
                  onChange={e => setNewClassroomName(e.target.value)}
                  placeholder="예: A반, 오전반, 2024-1기"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium mb-1 block">학과</label>
                <select
                  value={newClassroomTrack}
                  onChange={e => setNewClassroomTrack(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {TRACK_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => { setShowCreateModal(false); setNewClassroomName(''); }}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreateClassroom}
                disabled={!newClassroomName.trim()}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 팀 생성 모달 ─── */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-4">팀 생성</h3>
            <div>
              <label className="text-sm text-gray-600 font-medium mb-1 block">팀 이름</label>
              <input
                type="text"
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                placeholder="예: 1조, 마케팅A팀"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => { setShowCreateTeamModal(false); setNewTeamName(''); }}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={!newTeamName.trim()}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
