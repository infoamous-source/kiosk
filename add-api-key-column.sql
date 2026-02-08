-- ══════════════════════════════════════════
-- API 키 컬럼 추가 (profiles 테이블)
-- ══════════════════════════════════════════

-- gemini_api_key 컬럼 추가 (암호화된 형태로 저장)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS gemini_api_key TEXT DEFAULT NULL;

-- 인덱스 추가 (검색 최적화)
CREATE INDEX IF NOT EXISTS idx_profiles_api_key ON profiles(id) WHERE gemini_api_key IS NOT NULL;

COMMENT ON COLUMN profiles.gemini_api_key IS '학생별 Google Gemini API 키 (앱 내 모든 AI 도구에서 사용)';
