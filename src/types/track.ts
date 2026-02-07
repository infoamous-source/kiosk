export type TrackId = 'digital-basics' | 'marketing' | 'career';

export interface Track {
  id: TrackId;
  nameKey: string;
  descriptionKey: string;
  icon: string;
  color: string;
  gradient: string;
  borderColor: string;
  modules: TrackModule[];
}

export interface TrackModule {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  duration: string;
  lessons: number;
  stage?: 'foundation' | 'practice' | 'ai';
  toolIds?: string[];
}

export interface ActivityLog {
  userId: string;
  trackId: TrackId;
  moduleId?: string;
  action: 'view' | 'click' | 'start' | 'complete' | 'tool_use' | 'ai_generate' | 'copy_output' | 'export';
  timestamp: string;
  metadata?: Record<string, string>;
}
