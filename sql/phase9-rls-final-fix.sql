-- =====================================================
-- Phase 9 FINAL FIX: SECURITY DEFINER로 무한재귀 완전 해결
-- Supabase SQL Editor에서 실행
-- =====================================================

-- ─── STEP 1: SECURITY DEFINER 헬퍼 함수 생성 ───
-- 이 함수들은 RLS를 우회하여 cross-table 검사를 수행합니다.
-- 정책 내에서 다른 테이블을 참조할 때 무한재귀를 방지합니다.

-- 1a) 해당 교실의 강사인지 확인
CREATE OR REPLACE FUNCTION rls_is_classroom_instructor(p_group_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM classroom_groups
    WHERE id = p_group_id AND instructor_id = p_user_id
  );
$$;

-- 1b) 해당 교실의 멤버인지 확인
CREATE OR REPLACE FUNCTION rls_is_classroom_member(p_group_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM classroom_members
    WHERE group_id = p_group_id AND user_id = p_user_id
  );
$$;

-- 1c) 해당 팀이 속한 교실의 강사인지 확인
CREATE OR REPLACE FUNCTION rls_is_team_instructor(p_team_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM team_groups tg
    JOIN classroom_groups cg ON cg.id = tg.classroom_group_id
    WHERE tg.id = p_team_id AND cg.instructor_id = p_user_id
  );
$$;

-- 1d) 해당 교실그룹에 속한 팀의 강사인지 확인 (team_groups용)
CREATE OR REPLACE FUNCTION rls_is_classroom_group_instructor(p_classroom_group_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM classroom_groups
    WHERE id = p_classroom_group_id AND instructor_id = p_user_id
  );
$$;

-- 1e) 해당 팀의 멤버인지 확인
CREATE OR REPLACE FUNCTION rls_is_team_member(p_team_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM team_members
    WHERE team_id = p_team_id AND user_id = p_user_id
  );
$$;

-- 1f) 사용자가 instructor 역할인지 확인 (profiles 자기참조 방지)
CREATE OR REPLACE FUNCTION rls_is_instructor(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = p_user_id AND role = 'instructor'
  );
$$;


-- ─── STEP 2: 기존 문제 정책 전부 삭제 ───

-- profiles
DROP POLICY IF EXISTS "Instructors can view all profiles" ON profiles;
DROP POLICY IF EXISTS "instructor_assign_student" ON profiles;

-- classroom_groups
DROP POLICY IF EXISTS "cg_instructor" ON classroom_groups;
DROP POLICY IF EXISTS "cg_student_read" ON classroom_groups;

-- classroom_members
DROP POLICY IF EXISTS "cm_instructor" ON classroom_members;
DROP POLICY IF EXISTS "cm_student_read" ON classroom_members;

-- team_groups
DROP POLICY IF EXISTS "tg_instructor" ON team_groups;
DROP POLICY IF EXISTS "tg_student_read" ON team_groups;

-- team_members
DROP POLICY IF EXISTS "tm_instructor" ON team_members;
DROP POLICY IF EXISTS "tm_student_read" ON team_members;

-- team_ideas
DROP POLICY IF EXISTS "ti_team_read" ON team_ideas;
DROP POLICY IF EXISTS "ti_insert" ON team_ideas;
DROP POLICY IF EXISTS "ti_delete" ON team_ideas;


-- ─── STEP 3: SECURITY DEFINER 함수를 사용한 새 정책 생성 ───

-- === PROFILES ===
-- 강사가 모든 프로필 조회 (rls_is_instructor로 자기참조 방지)
CREATE POLICY "Instructors can view all profiles" ON profiles
  FOR SELECT
  USING (rls_is_instructor(auth.uid()));

-- 강사가 학생 프로필 업데이트 (instructor_code 배정 등)
CREATE POLICY "instructor_assign_student" ON profiles
  FOR UPDATE
  USING (rls_is_instructor(auth.uid()))
  WITH CHECK (rls_is_instructor(auth.uid()));


-- === CLASSROOM_GROUPS ===
-- 강사: 자기 교실 CRUD (직접 비교 — 재귀 없음)
CREATE POLICY "cg_instructor" ON classroom_groups
  FOR ALL
  USING (auth.uid() = instructor_id)
  WITH CHECK (auth.uid() = instructor_id);

-- 학생: 소속 교실 읽기 (SECURITY DEFINER로 classroom_members 참조)
CREATE POLICY "cg_student_read" ON classroom_groups
  FOR SELECT
  USING (rls_is_classroom_member(id, auth.uid()));


-- === CLASSROOM_MEMBERS ===
-- 강사: 자기 교실의 멤버 관리 (SECURITY DEFINER로 classroom_groups 참조)
CREATE POLICY "cm_instructor" ON classroom_members
  FOR ALL
  USING (rls_is_classroom_instructor(group_id, auth.uid()))
  WITH CHECK (rls_is_classroom_instructor(group_id, auth.uid()));

-- 학생: 자기 정보만 읽기 (직접 비교 — 재귀 없음)
CREATE POLICY "cm_student_read" ON classroom_members
  FOR SELECT
  USING (user_id = auth.uid());


-- === TEAM_GROUPS ===
-- 강사: 자기 교실의 팀 관리 (SECURITY DEFINER로 classroom_groups 참조)
CREATE POLICY "tg_instructor" ON team_groups
  FOR ALL
  USING (rls_is_classroom_group_instructor(classroom_group_id, auth.uid()))
  WITH CHECK (rls_is_classroom_group_instructor(classroom_group_id, auth.uid()));

-- 학생: 소속 팀 그룹 읽기 (SECURITY DEFINER로 team_members 참조)
CREATE POLICY "tg_student_read" ON team_groups
  FOR SELECT
  USING (rls_is_team_member(id, auth.uid()));


-- === TEAM_MEMBERS ===
-- 강사: 자기 교실의 팀 멤버 관리 (SECURITY DEFINER로 team_groups+classroom_groups 참조)
CREATE POLICY "tm_instructor" ON team_members
  FOR ALL
  USING (rls_is_team_instructor(team_id, auth.uid()))
  WITH CHECK (rls_is_team_instructor(team_id, auth.uid()));

-- 학생: 같은 팀원 읽기 (SECURITY DEFINER로 team_members 자기참조 방지)
CREATE POLICY "tm_student_read" ON team_members
  FOR SELECT
  USING (rls_is_team_member(team_id, auth.uid()));


-- === TEAM_IDEAS ===
-- 같은 팀원 읽기 (SECURITY DEFINER로 team_members 참조)
CREATE POLICY "ti_team_read" ON team_ideas
  FOR SELECT
  USING (rls_is_team_member(team_id, auth.uid()));

-- 본인만 추가 (직접 비교 — 재귀 없음)
CREATE POLICY "ti_insert" ON team_ideas
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 본인만 삭제 (직접 비교 — 재귀 없음)
CREATE POLICY "ti_delete" ON team_ideas
  FOR DELETE
  USING (user_id = auth.uid());


-- ─── 완료 메시지 ───
-- 모든 cross-table 참조가 SECURITY DEFINER 함수를 통해 수행되므로
-- 무한재귀가 발생하지 않습니다.
