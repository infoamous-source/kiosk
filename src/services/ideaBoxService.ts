import { supabase } from '../lib/supabase';

export interface IdeaBoxItemRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string;
  preview: string | null;
  tool_id: string | null;
  tags: string[] | null;
  created_at: string;
}

export async function getIdeaBoxItems(userId: string): Promise<IdeaBoxItemRow[]> {
  const { data, error } = await supabase
    .from('idea_box_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get idea box items error:', error.message);
    return [];
  }
  return data as IdeaBoxItemRow[];
}

export async function addIdeaBoxItem(item: {
  id: string;
  userId: string;
  type: string;
  title: string;
  content: string;
  preview?: string;
  toolId?: string;
  tags?: string[];
}): Promise<boolean> {
  const { error } = await supabase.from('idea_box_items').insert({
    id: item.id,
    user_id: item.userId,
    type: item.type,
    title: item.title,
    content: item.content,
    preview: item.preview ?? null,
    tool_id: item.toolId ?? null,
    tags: item.tags ?? null,
  });

  if (error) {
    console.error('Add idea box item error:', error.message);
    return false;
  }
  return true;
}

export async function removeIdeaBoxItem(itemId: string): Promise<boolean> {
  const { error } = await supabase
    .from('idea_box_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Remove idea box item error:', error.message);
    return false;
  }
  return true;
}
