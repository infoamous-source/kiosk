import { supabase } from '../lib/supabase';

export interface PortfolioEntryRow {
  id: string;
  user_id: string;
  tool_id: string;
  module_id: string;
  tool_name: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  is_mock_data: boolean;
  created_at: string;
}

export async function createPortfolioEntry(entry: {
  id: string;
  userId: string;
  toolId: string;
  moduleId: string;
  toolName: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  isMockData?: boolean;
}): Promise<boolean> {
  const { error } = await supabase.from('portfolio_entries').insert({
    id: entry.id,
    user_id: entry.userId,
    tool_id: entry.toolId,
    module_id: entry.moduleId,
    tool_name: entry.toolName,
    input: entry.input,
    output: entry.output,
    is_mock_data: entry.isMockData ?? false,
  });

  if (error) {
    console.error('Create portfolio entry error:', error.message);
    return false;
  }
  return true;
}

export async function getPortfolioEntries(userId: string): Promise<PortfolioEntryRow[]> {
  const { data, error } = await supabase
    .from('portfolio_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get portfolio entries error:', error.message);
    return [];
  }
  return data as PortfolioEntryRow[];
}

export async function getPortfolioEntriesByTool(userId: string, toolId: string): Promise<PortfolioEntryRow[]> {
  const { data, error } = await supabase
    .from('portfolio_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('tool_id', toolId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Get portfolio entries by tool error:', error.message);
    return [];
  }
  return data as PortfolioEntryRow[];
}

export async function getPortfolioStats(userId: string): Promise<{
  totalEntries: number;
  toolUsage: Record<string, number>;
  aiGenerations: number;
  lastActivity: string | null;
}> {
  const entries = await getPortfolioEntries(userId);

  const toolUsage: Record<string, number> = {};
  entries.forEach((e) => {
    toolUsage[e.tool_id] = (toolUsage[e.tool_id] || 0) + 1;
  });

  return {
    totalEntries: entries.length,
    toolUsage,
    aiGenerations: entries.filter(
      (e) => !e.is_mock_data && (e.tool_id === 'k-copywriter' || e.tool_id === 'sns-ad-maker'),
    ).length,
    lastActivity: entries.length > 0 ? entries[0].created_at : null,
  };
}
