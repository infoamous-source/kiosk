-- =====================================================
-- Phase 9: 교실/팀 그룹핑 시스템 — Supabase SQL Editor에서 실행
-- =====================================================

-- 교실 그룹
CREATE TABLE IF NOT EXISTS classroom_groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_code text NOT NULL,
  track text NOT NULL,
  classroom_name text NOT NULL,
  instructor_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- 교실 멤버
CREATE TABLE IF NOT EXISTS classroom_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid REFERENCES classroom_groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  user_name text NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- 팀 그룹
CREATE TABLE IF NOT EXISTS team_groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  classroom_group_id uuid REFERENCES classroom_groups(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- 팀 멤버
CREATE TABLE IF NOT EXISTS team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id uuid REFERENCES team_groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  user_name text NOT NULL,
  aptitude_type text,
  animal_icon text,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- 팀 아이디어 보석함
CREATE TABLE IF NOT EXISTS team_ideas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id uuid REFERENCES team_groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  user_name text NOT NULL,
  animal_icon text,
  tool_id text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ─── RLS 활성화 ───
ALTER TABLE classroom_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_ideas ENABLE ROW LEVEL SECURITY;

-- ─── RLS 정책 ───

-- 강사: 자기 교실 관리
CREATE POLICY "cg_instructor" ON classroom_groups FOR ALL USING (auth.uid() = instructor_id);
-- 학생: 소속 교실 읽기
CREATE POLICY "cg_student_read" ON classroom_groups FOR SELECT USING (
  EXISTS (SELECT 1 FROM classroom_members WHERE group_id = id AND user_id = auth.uid())
);

-- 강사: 자기 교실의 멤버 관리
CREATE POLICY "cm_instructor" ON classroom_members FOR ALL USING (
  EXISTS (SELECT 1 FROM classroom_groups WHERE id = group_id AND instructor_id = auth.uid())
);
-- 학생: 자기 정보만 읽기
CREATE POLICY "cm_student_read" ON classroom_members FOR SELECT USING (user_id = auth.uid());

-- 강사: 자기 교실의 팀 관리
CREATE POLICY "tg_instructor" ON team_groups FOR ALL USING (
  EXISTS (SELECT 1 FROM classroom_groups cg WHERE cg.id = classroom_group_id AND cg.instructor_id = auth.uid())
);
-- 학생: 소속 팀 읽기
CREATE POLICY "tg_student_read" ON team_groups FOR SELECT USING (
  EXISTS (SELECT 1 FROM team_members WHERE team_id = id AND user_id = auth.uid())
);

-- 강사: 자기 교실의 팀 멤버 관리
CREATE POLICY "tm_instructor" ON team_members FOR ALL USING (
  EXISTS (SELECT 1 FROM team_groups tg JOIN classroom_groups cg ON cg.id = tg.classroom_group_id WHERE tg.id = team_id AND cg.instructor_id = auth.uid())
);
-- 학생: 같은 팀원 읽기
CREATE POLICY "tm_student_read" ON team_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM team_members tm2 WHERE tm2.team_id = team_id AND tm2.user_id = auth.uid())
);

-- 보석함: 같은 팀원 읽기
CREATE POLICY "ti_team_read" ON team_ideas FOR SELECT USING (
  EXISTS (SELECT 1 FROM team_members WHERE team_id = team_ideas.team_id AND user_id = auth.uid())
);
-- 보석함: 본인만 추가
CREATE POLICY "ti_insert" ON team_ideas FOR INSERT WITH CHECK (user_id = auth.uid());
-- 보석함: 본인만 삭제
CREATE POLICY "ti_delete" ON team_ideas FOR DELETE USING (user_id = auth.uid());

-- ─── Realtime 활성화 ───
ALTER PUBLICATION supabase_realtime ADD TABLE team_ideas;
ALTER PUBLICATION supabase_realtime ADD TABLE classroom_groups;
ALTER PUBLICATION supabase_realtime ADD TABLE team_members;
