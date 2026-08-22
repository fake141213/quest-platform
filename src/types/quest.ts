export type QuestStatus =
  | "available"
  | "in_progress"
  | "waiting_confirmation"
  | "completed"
  | "rewarded"
  | "cancelled";

export type QuestType =
  | "system"
  | "user";

export type QuestCreator = {
  id: string;
  name: string;
  avatar: string;
};

export type QuestTodo = {
  id: string;
  title: string;
  completed: boolean;
};

export type Quest = {
  id: string;
  title: string;
  description: string;

  category: string;

  reward: number;
  currency: string;

  requirement: number;
  progress: number;
  progressStep: number;

  todos?: QuestTodo[];

  creator: QuestCreator;

  type: QuestType;

  status: QuestStatus;

  participants: number;
  maxParticipants: number;

  deadline?: string;
};