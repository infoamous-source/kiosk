-- ================================================
-- localStorage → Supabase Migration
-- Run in Supabase SQL Editor
-- Safe to run multiple times (IF NOT EXISTS used)
-- ================================================

-- ------------------------------------------------
-- 1. ALTER school_progress (add new columns)
-- ------------------------------------------------
ALTER TABLE school_progress ADD COLUMN IF NOT EXISTS market_compass_data JSONB;
ALTER TABLE school_progress ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMPTZ DEFAULT now();

-- Instructor update policy for school_progress (existing RLS stays)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'school_progress' AND policyname = 'Instructors can update school_progress'
  ) THEN
    CREATE POLICY "Instructors can update school_progress" ON school_progress
      FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor')
      );
  END IF;
END $$;

-- ------------------------------------------------
-- 2. portfolio_entries
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio_entries (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  input JSONB NOT NULL DEFAULT '{}',
  output JSONB NOT NULL DEFAULT '{}',
  is_mock_data BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE portfolio_entries ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_portfolio_entries_user_id ON portfolio_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_entries_created_at ON portfolio_entries(created_at);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'portfolio_entries' AND policyname = 'Users can view own portfolio entries'
  ) THEN
    CREATE POLICY "Users can view own portfolio entries" ON portfolio_entries
      FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor')
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'portfolio_entries' AND policyname = 'Users can insert own portfolio entries'
  ) THEN
    CREATE POLICY "Users can insert own portfolio entries" ON portfolio_entries
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'portfolio_entries' AND policyname = 'Users can update own portfolio entries'
  ) THEN
    CREATE POLICY "Users can update own portfolio entries" ON portfolio_entries
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'portfolio_entries' AND policyname = 'Users can delete own portfolio entries'
  ) THEN
    CREATE POLICY "Users can delete own portfolio entries" ON portfolio_entries
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ------------------------------------------------
-- 3. activity_logs
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  track_id TEXT,
  module_id TEXT,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'Users can view own activity logs'
  ) THEN
    CREATE POLICY "Users can view own activity logs" ON activity_logs
      FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor')
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'Users can insert own activity logs'
  ) THEN
    CREATE POLICY "Users can insert own activity logs" ON activity_logs
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'Users can update own activity logs'
  ) THEN
    CREATE POLICY "Users can update own activity logs" ON activity_logs
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'Users can delete own activity logs'
  ) THEN
    CREATE POLICY "Users can delete own activity logs" ON activity_logs
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ------------------------------------------------
-- 4. idea_box_items
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS idea_box_items (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  preview TEXT,
  tool_id TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE idea_box_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_idea_box_items_user_id ON idea_box_items(user_id);
CREATE INDEX IF NOT EXISTS idx_idea_box_items_created_at ON idea_box_items(created_at);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'idea_box_items' AND policyname = 'Users can view own idea box items'
  ) THEN
    CREATE POLICY "Users can view own idea box items" ON idea_box_items
      FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor')
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'idea_box_items' AND policyname = 'Users can insert own idea box items'
  ) THEN
    CREATE POLICY "Users can insert own idea box items" ON idea_box_items
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'idea_box_items' AND policyname = 'Users can update own idea box items'
  ) THEN
    CREATE POLICY "Users can update own idea box items" ON idea_box_items
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'idea_box_items' AND policyname = 'Users can delete own idea box items'
  ) THEN
    CREATE POLICY "Users can delete own idea box items" ON idea_box_items
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ------------------------------------------------
-- 5. digital_progress
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS digital_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  completed_steps TEXT[] DEFAULT '{}',
  completed_practices TEXT[] DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE digital_progress ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_digital_progress_user_id ON digital_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_digital_progress_created_at ON digital_progress(updated_at);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'digital_progress' AND policyname = 'Users can view own digital progress'
  ) THEN
    CREATE POLICY "Users can view own digital progress" ON digital_progress
      FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor')
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'digital_progress' AND policyname = 'Users can insert own digital progress'
  ) THEN
    CREATE POLICY "Users can insert own digital progress" ON digital_progress
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'digital_progress' AND policyname = 'Users can update own digital progress'
  ) THEN
    CREATE POLICY "Users can update own digital progress" ON digital_progress
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'digital_progress' AND policyname = 'Users can delete own digital progress'
  ) THEN
    CREATE POLICY "Users can delete own digital progress" ON digital_progress
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ------------------------------------------------
-- 6. marketing_progress
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS marketing_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  viewed_at TIMESTAMPTZ,
  tool_used_at TIMESTAMPTZ,
  tool_output_count INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE marketing_progress ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_marketing_progress_user_id ON marketing_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_progress_created_at ON marketing_progress(updated_at);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'marketing_progress' AND policyname = 'Users can view own marketing progress'
  ) THEN
    CREATE POLICY "Users can view own marketing progress" ON marketing_progress
      FOR SELECT USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor')
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'marketing_progress' AND policyname = 'Users can insert own marketing progress'
  ) THEN
    CREATE POLICY "Users can insert own marketing progress" ON marketing_progress
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'marketing_progress' AND policyname = 'Users can update own marketing progress'
  ) THEN
    CREATE POLICY "Users can update own marketing progress" ON marketing_progress
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'marketing_progress' AND policyname = 'Users can delete own marketing progress'
  ) THEN
    CREATE POLICY "Users can delete own marketing progress" ON marketing_progress
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ------------------------------------------------
-- 7. instructor_settings (기존 테이블에 컬럼 추가)
-- instructor_id (UUID) 컬럼이 이미 존재함
-- ------------------------------------------------
ALTER TABLE instructor_settings ADD COLUMN IF NOT EXISTS settings JSONB NOT NULL DEFAULT '{}';
ALTER TABLE instructor_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE instructor_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'instructor_settings' AND policyname = 'Instructors can view own settings'
  ) THEN
    CREATE POLICY "Instructors can view own settings" ON instructor_settings
      FOR SELECT USING (
        instructor_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor')
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'instructor_settings' AND policyname = 'Instructors can insert own settings'
  ) THEN
    CREATE POLICY "Instructors can insert own settings" ON instructor_settings
      FOR INSERT WITH CHECK (
        instructor_id = auth.uid()
        AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor')
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'instructor_settings' AND policyname = 'Instructors can update own settings'
  ) THEN
    CREATE POLICY "Instructors can update own settings" ON instructor_settings
      FOR UPDATE USING (
        instructor_id = auth.uid()
        AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor')
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'instructor_settings' AND policyname = 'Instructors can delete own settings'
  ) THEN
    CREATE POLICY "Instructors can delete own settings" ON instructor_settings
      FOR DELETE USING (
        instructor_id = auth.uid()
        AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor')
      );
  END IF;
END $$;

-- ================================================
-- Migration complete
-- ================================================
