-- 공지 테이블 생성
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID REFERENCES profiles(id),
  target_type TEXT NOT NULL DEFAULT 'all', -- 'all' | 'no_api_key' | 'specific'
  target_student_ids UUID[] DEFAULT '{}',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 활성화
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 선생님은 자신의 공지 조회/생성 가능
CREATE POLICY "Instructors can manage own notifications" ON notifications
  FOR ALL USING (
    instructor_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor')
  );

-- 학생은 자신에게 해당하는 공지만 조회 가능
CREATE POLICY "Students can view targeted notifications" ON notifications
  FOR SELECT USING (
    target_type = 'all'
    OR auth.uid() = ANY(target_student_ids)
  );
