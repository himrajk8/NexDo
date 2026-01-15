export interface Activity {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt: number | null;
}

export interface TaskHistory {
  [key: string]: {
    count: number;
    timestamps: number[];
  };
}

export interface PomodoroSession {
  duration: number;
  label: string;
  timestamp: number;
}
