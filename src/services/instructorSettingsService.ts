import { supabase } from '../lib/supabase';
import type { InstructorSettingsRow } from '../types/database';

/** 강사 설정 조회 (instructor의 user ID로 조회) */
export async function fetchInstructorSettings(instructorUserId: string): Promise<InstructorSettingsRow | null> {
  const { data, error } = await supabase
    .from('instructor_settings')
    .select('*')
    .eq('instructor_id', instructorUserId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // no rows
    console.error('Fetch instructor settings error:', error.message);
    return null;
  }
  return data as InstructorSettingsRow;
}

/** 강사 설정 upsert (instructor의 user ID로 upsert) */
export async function upsertInstructorSettings(
  instructorUserId: string,
  settings: Record<string, unknown>,
): Promise<boolean> {
  const { error } = await supabase
    .from('instructor_settings')
    .upsert(
      {
        instructor_id: instructorUserId,
        settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'instructor_id' },
    );

  if (error) {
    console.error('Upsert instructor settings error:', error.message);
    return false;
  }
  return true;
}
