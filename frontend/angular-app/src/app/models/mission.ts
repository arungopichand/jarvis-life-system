export interface Mission {
  id: number;
  title: string;
  description?: string;
  xpReward: number;
  isCompleted: boolean;
  missionDate: string;
  category: string;
}
