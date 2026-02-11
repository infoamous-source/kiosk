import { supabase } from '../lib/supabase';

export interface DigitalProgressRow {
  id: string;
  user_id: string;
  module_id: string;
  completed_steps: string[];
  completed_practices: string[];
  completed_at: string | null;
  updated_at: string;
}

export async function fetchDigitalProgress(userId: string): Promise<DigitalProgressRow[]> {
  const { data, error } = await supabase
    .from('digital_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Fetch digital progress error:', error.message);
    return [];
  }
  return data as DigitalProgressRow[];
}

export async function upsertDigitalProgress(
  userId: string,
  moduleId: string,
  data: {
    completedSteps: string[];
    completedPractices: string[];
    completedAt?: string;
  },
): Promise<boolean> {
  const { error } = await supabase
    .from('digital_progress')
    .upsert(
      {
        user_id: userId,
        module_id: moduleId,
        completed_steps: data.completedSteps,
        completed_practices: data.completedPractices,
        completed_at: data.completedAt ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,module_id' },
    );

  if (error) {
    console.error('Upsert digital progress error:', error.message);
    return false;
  }
  return true;
}
