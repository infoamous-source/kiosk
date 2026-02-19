-- =====================================================
-- RLS 순환참조 수정: activity_logs & portfolio_entries
-- Supabase SQL Editor에서 실행
-- =====================================================
-- 문제: 이 테이블들의 SELECT 정책이 profiles 테이블을 서브쿼리하는데,
-- profiles 테이블 자체의 RLS가 이를 차단하여 순환 참조 발생
-- → 학생이 본인의 활동내역/도구사용내역을 조회할 수 없음
--
-- 해결: SECURITY DEFINER 헬퍼 함수로 profiles RLS를 우회

-- ─── STEP 1: SECURITY DEFINER 헬퍼 함수 ───
-- 본인이거나 instructor 역할인지 확인 (profiles RLS 우회)
CREATE OR REPLACE FUNCTION rls_is_owner_or_instructor(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT auth.uid() = p_user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor');
$$;

-- ─── STEP 2: activity_logs SELECT 정책 교체 ───
DROP POLICY IF EXISTS "Users can view own activity logs" ON activity_logs;
CREATE POLICY "Users can view own activity logs" ON activity_logs
  FOR SELECT USING (rls_is_owner_or_instructor(user_id));

-- ─── STEP 3: portfolio_entries SELECT 정책 교체 ───
DROP POLICY IF EXISTS "Users can view own portfolio entries" ON portfolio_entries;
CREATE POLICY "Users can view own portfolio entries" ON portfolio_entries
  FOR SELECT USING (rls_is_owner_or_instructor(user_id));

-- ─── 확인 쿼리 (선택) ───
-- SELECT schemaname, tablename, policyname, qual
-- FROM pg_policies
-- WHERE tablename IN ('activity_logs', 'portfolio_entries');
