import { supabase } from '../lib/supabase';
import type { Enrollment, SchoolId } from '../types/enrollment';
import type { EnrollmentRow } from '../types/database';

/** EnrollmentRow → Enrollment 변환 */
function rowToEnrollment(row: EnrollmentRow): Enrollment {
  return {
    id: row.id,
    student_id: row.student_id,
    school_id: row.school_id as SchoolId,
    instructor_id: row.instructor_id,
    status: row.status as Enrollment['status'],
    enrolled_at: row.enrolled_at,
    activated_at: row.activated_at,
    suspended_at: row.suspended_at,
    completed_at: row.completed_at,
  };
}

/** 학생의 모든 enrollment 조회 */
export async function getEnrollments(studentId: string): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('student_id', studentId)
    .order('enrolled_at', { ascending: true });

  if (error) {
    console.error('Get enrollments error:', error.message);
    return [];
  }
  return (data as EnrollmentRow[]).map(rowToEnrollment);
}

/** pending_info 상태인 enrollment 조회 */
export async function getPendingEnrollments(studentId: string): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('student_id', studentId)
    .eq('status', 'pending_info');

  if (error) {
    console.error('Get pending enrollments error:', error.message);
    return [];
  }
  return (data as EnrollmentRow[]).map(rowToEnrollment);
}

/** 학생을 학교에 연결 (enrollment 생성) */
export async function createEnrollment(
  studentId: string,
  schoolId: SchoolId,
  instructorId: string | null,
  autoActivate = false,
): Promise<Enrollment | null> {
  const insertData: Record<string, unknown> = {
    student_id: studentId,
    school_id: schoolId,
    instructor_id: instructorId,
    status: autoActivate ? 'active' : 'pending_info',
  };
  if (autoActivate) {
    insertData.activated_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('enrollments')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Create enrollment error:', error.message);
    return null;
  }
  return rowToEnrollment(data as EnrollmentRow);
}

/** 학교별 추가 정보 제출 → enrollment active 전환 */
export async function submitSchoolProfile(
  enrollmentId: string,
  studentId: string,
  schoolId: SchoolId,
  profileData: Record<string, unknown>,
): Promise<boolean> {
  // 1) school_profiles에 추가 정보 저장
  const { error: profileError } = await supabase
    .from('school_profiles')
    .insert({
      enrollment_id: enrollmentId,
      student_id: studentId,
      school_id: schoolId,
      data: profileData,
    });

  if (profileError) {
    console.error('Submit school profile error:', profileError.message);
    return false;
  }

  // 2) enrollment 상태를 active로 변경
  const { error: enrollError } = await supabase
    .from('enrollments')
    .update({
      status: 'active',
      activated_at: new Date().toISOString(),
    })
    .eq('id', enrollmentId);

  if (enrollError) {
    console.error('Activate enrollment error:', enrollError.message);
    return false;
  }

  return true;
}

/** 관리자: enrollment 상태 변경 */
export async function updateEnrollmentStatus(
  enrollmentId: string,
  status: Enrollment['status'],
): Promise<boolean> {
  const updates: Record<string, unknown> = { status };

  if (status === 'suspended') updates.suspended_at = new Date().toISOString();
  if (status === 'completed') updates.completed_at = new Date().toISOString();
  if (status === 'active') updates.activated_at = new Date().toISOString();

  const { error } = await supabase
    .from('enrollments')
    .update(updates)
    .eq('id', enrollmentId);

  if (error) {
    console.error('Update enrollment status error:', error.message);
    return false;
  }
  return true;
}

/** 관리자: 모든 enrollment 조회 */
export async function getAllEnrollments(): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .order('enrolled_at', { ascending: false });

  if (error) {
    console.error('Get all enrollments error:', error.message);
    return [];
  }
  return (data as EnrollmentRow[]).map(rowToEnrollment);
}

/** 특정 학교의 enrollment 조회 */
export async function getEnrollmentsBySchool(schoolId: SchoolId): Promise<Enrollment[]> {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('school_id', schoolId)
    .order('enrolled_at', { ascending: false });

  if (error) {
    console.error('Get enrollments by school error:', error.message);
    return [];
  }
  return (data as EnrollmentRow[]).map(rowToEnrollment);
}
