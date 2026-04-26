export type LearningCategory =
  | 'CSharp'
  | 'DotNet'
  | 'AspNetCore'
  | 'Sql'
  | 'Angular'
  | 'TypeScript'
  | 'SystemDesign'
  | 'GitHub';

export type LearningTopicStatus = 'NotStarted' | 'InProgress' | 'Completed';

export interface LearningLog {
  id: number;
  topic: string;
  category: LearningCategory;
  notes?: string | null;
  difficulty: number;
  completedAt?: string | null;
  createdAt: string;
}

export interface LearningTodayPlan {
  date: string;
  topic: string;
  category: LearningCategory;
  practicePrompt: string;
  todayLogCount: number;
}

export interface LearningRoadmap {
  categories: LearningRoadmapCategory[];
}

export interface LearningRoadmapCategory {
  name: LearningCategory;
  topics: LearningRoadmapTopic[];
}

export interface LearningRoadmapTopic {
  topic: string;
  status: LearningTopicStatus;
  confidenceLevel: number;
  lastPracticedAt?: string | null;
}
