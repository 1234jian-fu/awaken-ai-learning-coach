export interface StudyStep {
  id: number;
  title: string;
  description: string;
  duration: string;
  status: 'completed' | 'active' | 'pending';
  icon: string;
}

export interface DayBlueprint {
  day: string;
  title: string;
  subtitle: string;
  goal: string;
  level: 'Concept' | 'Structure' | 'Mastery';
  duration: '1 Day' | '3 Days' | '1 Week';
  coverImage: string;
  progressPercent: number;
  pausedStep: string;
  pausedStage: string;
  pausedProgress: number;
  steps: StudyStep[];
  completedSnapshot: string[];
  pendingSnapshot: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
