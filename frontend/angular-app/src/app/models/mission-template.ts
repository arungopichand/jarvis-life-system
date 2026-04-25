export interface MissionTemplate {
  id: number;
  title: string;
  description?: string;
  xpReward: number;
  category: string;
  isEnabled: boolean;
}
