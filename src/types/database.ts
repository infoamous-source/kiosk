// ─── Supabase DB row types ───

export interface ProfileRow {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor';
  organization: string;
  org_code: string;
  instructor_code: string;
  country: string | null;
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  learning_purpose: string;
  gemini_api_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface InstructorRow {
  id: string;
  instructor_code: string;
  assigned_schools: string[];
  created_at: string;
}

export interface EnrollmentRow {
  id: string;
  student_id: string;
  school_id: string;
  instructor_id: string | null;
  status: string;
  enrolled_at: string;
  activated_at: string | null;
  suspended_at: string | null;
  completed_at: string | null;
}

export interface SchoolProfileRow {
  id: string;
  enrollment_id: string;
  student_id: string;
  school_id: string;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SchoolProgressRow {
  id: string;
  enrollment_id: string;
  student_id: string;
  school_id: string;
  stamps: unknown;
  graduation: unknown;
  aptitude_result: unknown;
  simulation_result: unknown;
  created_at: string;
  updated_at: string;
}
