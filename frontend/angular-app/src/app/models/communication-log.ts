export type CommunicationType = 'Vocabulary' | 'Speaking' | 'Conversation' | 'Interview' | 'Writing';

export interface CommunicationLog {
  id: number;
  type: CommunicationType;
  content: string;
  confidenceLevel: number;
  notes?: string | null;
  createdAt: string;
}

export interface CommunicationTodayPlan {
  date: string;
  word: string;
  meaning: string;
  exampleSentence: string;
  speakingPrompt: string;
  confidenceDrill: string;
}
