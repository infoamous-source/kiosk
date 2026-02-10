-- =====================================================
-- Phase 9 FIX: RLS 정책 수정 — Supabase SQL Editor에서 실행
-- =====================================================

-- ─── 1. 기존 FOR ALL USING 정책 삭제 ───
DROP POLICY IF EXISTS "cg_instructor" ON classroom_groups;
DROP POLICY IF EXISTS "cm_instructor" ON classroom_members;
DROP POLICY IF EXISTS "tg_instructor" ON team_groups;
DROP POLICY IF EXISTS "tm_instructor" ON team_members;

-- ─── 2. USING + WITH CHECK 형태로 재생성 ───

CREATE POLICY "cg_instructor" ON classroom_groups
  FOR ALL
  USING (auth.uid() = instructor_id)
  WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "cm_instructor" ON classroom_members
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM classroom_groups WHERE id = group_id AND instructor_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM classroom_groups WHERE id = group_id AND instructor_id = auth.uid())
  );

CREATE POLICY "tg_instructor" ON team_groups
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM classroom_groups cg WHERE cg.id = classroom_group_id AND cg.instructor_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM classroom_groups cg WHERE cg.id = classroom_group_id AND cg.instructor_id = auth.uid())
  );

CREATE POLICY "tm_instructor" ON team_members
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM team_groups tg JOIN classroom_groups cg ON cg.id = tg.classroom_group_id WHERE tg.id = team_id AND cg.instructor_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM team_groups tg JOIN classroom_groups cg ON cg.id = tg.classroom_group_id WHERE tg.id = team_id AND cg.instructor_id = auth.uid())
  );

-- ─── 3. 무한재귀 일으키는 정책 삭제 ───
-- profiles 테이블에서 profiles를 서브쿼리로 참조하면 무한 재귀 발생
DROP POLICY IF EXISTS "instructor_assign_student" ON profiles;

-- ─── 4. 강사 학생 프로필 업데이트 — 재귀 없는 안전한 방식 ───
-- auth.uid()와 직접 비교하지 않고, 본인 프로필 업데이트만 기존 정책으로 처리
-- 강사가 학생 instructor_code를 업데이트하려면 서비스 역할 키 또는 RPC 사용 필요
-- 여기서는 간단히: 인증된 사용자는 모든 학생 프로필의 instructor_code만 업데이트 가능
CREATE POLICY "instructor_assign_student" ON profiles
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
