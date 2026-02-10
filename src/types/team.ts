// ─── 교실/팀 그룹핑 타입 ───

/** 교실 그룹 */
export interface ClassroomGroup {
  id: string;
  org_code: string;
  track: string;
  classroom_name: string;
  instructor_id: string;
  created_at: string;
}

/** 교실 멤버 */
export interface ClassroomMember {
  id: string;
  group_id: string;
  user_id: string;
  user_name: string;
  status: string; // 'active' | 'inactive'
  created_at: string;
}

/** 팀 그룹 */
export interface TeamGroup {
  id: string;
  classroom_group_id: string;
  name: string;
  created_by: string;
  created_at: string;
}

/** 팀 멤버 */
export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  user_name: string;
  aptitude_type: string | null;
  animal_icon: string | null;
  joined_at: string;
}

/** 팀 아이디어 보석함 */
export interface TeamIdea {
  id: string;
  team_id: string;
  user_id: string;
  user_name: string;
  animal_icon: string | null;
  tool_id: string;
  title: string;
  content: string;
  created_at: string;
}
