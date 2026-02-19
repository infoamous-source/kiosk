import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  instructor_id: string;
  target_type: 'all' | 'no_api_key' | 'specific';
  target_student_ids: string[];
  title: string;
  message: string;
  action_url: string | null;
  created_at: string;
}

export interface StudentNotification {
  id: string;
  notification_id: string;
  student_id: string;
  read_at: string | null;
  notification: Notification;
}

/** 선생님: 공지 생성 */
export async function createNotification(
  instructorId: string,
  targetType: Notification['target_type'],
  targetStudentIds: string[],
  title: string,
  message: string,
  actionUrl: string | null,
): Promise<Notification | null> {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      instructor_id: instructorId,
      target_type: targetType,
      target_student_ids: targetStudentIds,
      title,
      message,
      action_url: actionUrl,
    })
    .select()
    .single();

  if (error) {
    console.error('Create notification error:', error.message);
    return null;
  }
  return data as Notification;
}

/** 선생님: 본인이 보낸 공지 이력 조회 */
export async function getNotificationHistory(instructorId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Get notification history error:', error.message);
    return [];
  }
  return (data || []) as Notification[];
}

/** 학생: 읽지 않은 공지 조회 */
export async function getUnreadNotifications(studentId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .or(`target_type.eq.all,target_student_ids.cs.{${studentId}}`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Get unread notifications error:', error.message);
    return [];
  }
  return (data || []) as Notification[];
}
