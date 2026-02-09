-- ══════════════════════════════════════════
-- 누락된 테이블만 생성 (enrollments, school_profiles, school_progress, instructor_settings)
-- ══════════════════════════════════════════

-- TABLE: enrollments (student-school many-to-many)
CREATE TABLE IF NOT EXISTS enrollments (
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

-- TABLE: school_profiles (school-specific additional info)
CREATE TABLE IF NOT EXISTS school_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id   UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE UNIQUE,
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id       school_id_enum NOT NULL,
  data            JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABLE: school_progress (stamps, graduation, etc.)
CREATE TABLE IF NOT EXISTS school_progress (
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

-- TABLE: instructor_settings (visibility controls)
CREATE TABLE IF NOT EXISTS instructor_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id   UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE UNIQUE,
  settings        JSONB NOT NULL DEFAULT '{}',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_instructor ON enrollments(instructor_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_school ON enrollments(school_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_school_profiles_student ON school_profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_school_progress_student ON school_progress(student_id);

-- ROW LEVEL SECURITY

-- enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students see own enrollments" ON enrollments;
CREATE POLICY "Students see own enrollments"
  ON enrollments FOR SELECT USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Instructors see all enrollments" ON enrollments;
CREATE POLICY "Instructors see all enrollments"
  ON enrollments FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'instructor')
  );

DROP POLICY IF EXISTS "Instructors can create enrollments" ON enrollments;
CREATE POLICY "Instructors can create enrollments"
  ON enrollments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'instructor')
  );

DROP POLICY IF EXISTS "Instructors can update enrollments" ON enrollments;
CREATE POLICY "Instructors can update enrollments"
  ON enrollments FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'instructor')
  );

-- school_profiles
ALTER TABLE school_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students see own school profiles" ON school_profiles;
CREATE POLICY "Students see own school profiles"
  ON school_profiles FOR SELECT USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can insert own school profiles" ON school_profiles;
CREATE POLICY "Students can insert own school profiles"
  ON school_profiles FOR INSERT WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can update own school profiles" ON school_profiles;
CREATE POLICY "Students can update own school profiles"
  ON school_profiles FOR UPDATE USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Instructors see all school profiles" ON school_profiles;
CREATE POLICY "Instructors see all school profiles"
  ON school_profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'instructor')
  );

-- school_progress
ALTER TABLE school_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students see own progress" ON school_progress;
CREATE POLICY "Students see own progress"
  ON school_progress FOR SELECT USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can insert own progress" ON school_progress;
CREATE POLICY "Students can insert own progress"
  ON school_progress FOR INSERT WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Students can update own progress" ON school_progress;
CREATE POLICY "Students can update own progress"
  ON school_progress FOR UPDATE USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Instructors see all progress" ON school_progress;
CREATE POLICY "Instructors see all progress"
  ON school_progress FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'instructor')
  );

-- instructor_settings
ALTER TABLE instructor_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Instructors manage own settings" ON instructor_settings;
CREATE POLICY "Instructors manage own settings"
  ON instructor_settings FOR ALL USING (instructor_id = auth.uid());
