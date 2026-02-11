import { supabase } from '../lib/supabase';

export interface ActivityLogRow {
  id: string;
  user_id: string;
  track_id: string | null;
  module_id: string | null;
  action: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export async function createActivityLog(log: {
  userId: string;
  trackId?: string;
  moduleId?: string;
  action: string;
  metadata?: Record<string, unknown>;
}): Promise<boolean> {
  const { error } = await supabase.from('activity_logs').insert({
    user_id: log.userId,
    track_id: log.trackId ?? null,
    module_id: log.moduleId ?? null,
    action: log.action,
    metadata: log.metadata ?? null,
  });

  if (error) {
    console.error('Create activity log error:', error.message);
    return false;
  }
  return true;
}

export async function getActivityLogs(userId: string, limit?: number): Promise<ActivityLogRow[]> {
  let query = supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Get activity logs error:', error.message);
    return [];
  }
  return data as ActivityLogRow[];
}

export async function getActivityLogsByTrack(userId: string, trackId: string): Promise<ActivityLogRow[]> {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('track_id', trackId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get activity logs by track error:', error.message);
    return [];
  }
  return data as ActivityLogRow[];
}
