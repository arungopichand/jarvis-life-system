export type BlogDraftStatus = 'Draft' | 'Ready';

export interface BlogDraft {
  id: number;
  title: string;
  topic: string;
  content: string;
  status: BlogDraftStatus;
  createdAt: string;
  updatedAt: string;
}
