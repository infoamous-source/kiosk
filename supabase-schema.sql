-- ══════════════════════════════════════════
-- Kiosk Seven - 멀티 학교 등록 시스템 스키마
-- Supabase SQL Editor에서 실행
-- ══════════════════════════════════════════

-- ENUM TYPES
CREATE TYPE user_role AS ENUM ('student', 'instructor');
CREATE TYPE enrollment_status AS ENUM ('pending_info', 'active', 'suspended', 'completed');
CREATE TYPE school_id_enum AS ENUM ('digital-basics', 'marketing', 'career');

-- ══════════════════════════════════════════
-- TABLE: profiles (extends Supabase auth.users)
-- ══════════════════════════════════════════

CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  role          user_role NOT NULL DEFAULT 'student',
  organization  TEXT DEFAULT '',
  org_code      TEXT DEFAULT '',
  instructor_code TEXT DEFAULT '',
  country       TEXT,
  age           INTEGER,
  gender        TEXT CHECK (gender IN ('male', 'female', 'other')),
  learning_purpose TEXT DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════
-- TABLE: instructors (instructor-specific data)
-- ══════════════════════════════════════════

CREATE TABLE instructors (
  id              UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  instructor_code TEXT NOT NULL UNIQUE,
  assigned_schools school_id_enum[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════
-- TABLE: enrollments (student-school many-to-many)
-- ══════════════════════════════════════════

CREATE TABLE enrollments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id       school_id_enum NOT NULL,
  instructor_id   UUID REFERENCES instructors(id),
  status          enrollment_status NOT NULL DEFAULT 'pending_info',
  enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  activated_at    TIMESTAMPTZ,
  suspended_at    TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  UNIQUE(student_id, school_id)
);

-- ══════════════════════════════════════════
-- TABLE: school_profiles (school-specific additional info)
-- ══════════════════════════════════════════

CREATE TABLE school_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id   UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE UNIQUE,
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id       school_id_enum NOT NULL,
  data            JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════
-- TABLE: school_progress (stamps, graduation, etc.)
-- ══════════════════════════════════════════

CREATE TABLE school_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id   UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE UNIQUE,
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id       school_id_enum NOT NULL,
  stamps          JSONB NOT NULL DEFAULT '[]',
  graduation      JSONB NOT NULL DEFAULT '{"isGraduated": false}',
  aptitude_result JSONB,
  simulation_result JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════
-- TABLE: instructor_settings (visibility controls)
-- ══════════════════════════════════════════

CREATE TABLE instructor_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id   UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE UNIQUE,
  settings        JSONB NOT NULL DEFAULT '{}',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_instructor ON enrollments(instructor_id);
CREATE INDEX idx_enrollments_school ON enrollments(school_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_school_profiles_student ON school_profiles(student_id);
CREATE INDEX idx_school_progress_student ON school_progress(student_id);

-- ══════════════════════════════════════════
-- Auto-create profile on signup (trigger)
-- ══════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ══════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Instructors can view all profiles"
  ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'instructor')
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students see own enrollments"
  ON enrollments FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Instructors see all enrollments"
  ON enrollments FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'instructor')
  );

CREATE POLICY "Instructors can create enrollments"
  ON enrollments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'instructor')
  );

CREATE POLICY "Instructors can update enrollments"
  ON enrollments FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'instructor')
  );

-- school_profiles
ALTER TABLE school_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students see own school profiles"
  ON school_profiles FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can insert own school profiles"
  ON school_profiles FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own school profiles"
  ON school_profiles FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "Instructors see all school profiles"
  ON school_profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'instructor')
  );

-- school_progress
ALTER TABLE school_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students see own progress"
  ON school_progress FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can insert own progress"
  ON school_progress FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own progress"
  ON school_progress FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "Instructors see all progress"
  ON school_progress FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'instructor')
  );

-- instructors
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instructors see own record"
  ON instructors FOR SELECT USING (id = auth.uid());

CREATE POLICY "Anyone can read instructors for validation"
  ON instructors FOR SELECT USING (true);

-- instructor_settings
ALTER TABLE instructor_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instructors manage own settings"
  ON instructor_settings FOR ALL USING (instructor_id = auth.uid());
