export interface MissionHistoryItem {
  id: number;
  title: string;
  xpReward: number;
  isCompleted: boolean;
  category: string;
}

export interface MissionHistoryDay {
  date: string;
  totalMissions: number;
  completedMissions: number;
  completionPercentage: number;
  missions: MissionHistoryItem[];
}
