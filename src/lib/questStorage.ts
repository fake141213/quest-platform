import { Quest, QuestStatus } from "@/types/quest";

const QUEST_STORAGE_KEY = "quests";
const COIN_STORAGE_KEY = "quest-coins";
const TRANSACTION_STORAGE_KEY =
  "quest-coin-transactions";
const CURRENT_USER_KEY =
  "quest-current-user";

export type CoinTransaction = {
  id: string;
  type: "earned" | "spent";
  amount: number;
  title: string;
  date: string;
};

export type QuestProgress = {
  questId: string;
  progress: number;
  status: QuestStatus;
  completed: boolean;
};

/* =====================================
   GET CURRENT USER
===================================== */

export function getCurrentUserId(): string {
  if (typeof window === "undefined") {
    return "user-1";
  }

  return (
    localStorage.getItem(
      CURRENT_USER_KEY
    ) || "user-1"
  );
}

export function setCurrentUserId(
  userId: string
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    CURRENT_USER_KEY,
    userId
  );
}

/* =====================================
   GET QUESTS
===================================== */

export function getQuests(): Quest[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored =
      localStorage.getItem(
        QUEST_STORAGE_KEY
      );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.error(
      "Failed to get quests:",
      error
    );

    return [];
  }
}

/* =====================================
   SAVE QUESTS
===================================== */

export function saveQuests(
  quests: Quest[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    QUEST_STORAGE_KEY,
    JSON.stringify(quests)
  );

  window.dispatchEvent(
    new Event("quests-updated")
  );
}

/* =====================================
   GET QUEST BY ID
===================================== */

export function getQuestById(
  questId: string
): Quest | null {
  const quests = getQuests();

  return (
    quests.find(
      (quest) =>
        quest.id === questId
    ) ?? null
  );
}

/* =====================================
   CREATE DEFAULT TODOS
===================================== */

function createDefaultTodos(
  count: number
) {
  const safeCount =
    Math.max(1, count || 1);

  return Array.from(
    { length: safeCount },
    (_, index) => ({
      id: `todo-${index + 1}`,
      title: `ทำขั้นตอนที่ ${
        index + 1
      }`,
      completed: false,
    })
  );
}

/* =====================================
   ACCEPT QUEST
===================================== */

export function acceptQuest(
  questId: string
): Quest | null {
  const quests = getQuests();

  const userId =
    getCurrentUserId();

  const index = quests.findIndex(
    (quest) =>
      quest.id === questId
  );

  if (index === -1) {
    return null;
  }

  const quest = quests[index];

  /* เจ้าของรับ Quest ตัวเองไม่ได้ */

  if (
    quest.creator.id === userId
  ) {
    return quest;
  }

  /* ป้องกันรับ Quest ซ้ำ */

  if (
    quest.status ===
      "in_progress" ||
    quest.status ===
      "completed" ||
    quest.status ===
      "rewarded"
  ) {
    return quest;
  }

  /* ตรวจจำนวนผู้เข้าร่วม */

  if (
    quest.participants >=
    quest.maxParticipants
  ) {
    return quest;
  }

  const todos =
    quest.todos ??
    createDefaultTodos(
      quest.requirement
    );

  const updatedQuest: Quest = {
    ...quest,

    status: "in_progress",

    progress: 0,

    progressStep: 0,

    todos,

    participants:
      quest.participants + 1,
  };

  quests[index] =
    updatedQuest;

  saveQuests(quests);

  return updatedQuest;
}

/* =====================================
   COMPLETE TODO
===================================== */

export function completeTodo(
  questId: string,
  todoId: string
): Quest | null {
  const quests = getQuests();

  const index = quests.findIndex(
    (quest) =>
      quest.id === questId
  );

  if (index === -1) {
    return null;
  }

  const quest = quests[index];

  if (
    quest.status !==
    "in_progress"
  ) {
    return quest;
  }

  const todos =
    quest.todos ??
    createDefaultTodos(
      quest.requirement
    );

  const todoIndex =
    todos.findIndex(
      (todo) =>
        todo.id === todoId
    );

  if (todoIndex === -1) {
    return quest;
  }

  /* ป้องกันกดทำซ้ำ */

  if (
    todos[todoIndex].completed
  ) {
    return quest;
  }

  const updatedTodos =
    todos.map((todo) =>
      todo.id === todoId
        ? {
            ...todo,
            completed: true,
          }
        : todo
    );

  const completedCount =
    updatedTodos.filter(
      (todo) =>
        todo.completed
    ).length;

  const totalCount =
    updatedTodos.length;

  const isCompleted =
    completedCount >=
    totalCount;

  const updatedQuest: Quest = {
    ...quest,

    todos: updatedTodos,

    progress:
      completedCount,

    progressStep:
      completedCount,

    status: isCompleted
      ? "completed"
      : "in_progress",
  };

  quests[index] =
    updatedQuest;

  saveQuests(quests);

  return updatedQuest;
}

/* =====================================
   UPDATE QUEST STATUS
===================================== */

export function updateQuestStatus(
  questId: string,
  status: QuestStatus
): Quest | null {
  const quests = getQuests();

  const index = quests.findIndex(
    (quest) =>
      quest.id === questId
  );

  if (index === -1) {
    return null;
  }

  const updatedQuest: Quest = {
    ...quests[index],
    status,
  };

  quests[index] =
    updatedQuest;

  saveQuests(quests);

  return updatedQuest;
}

/* =====================================
   QUEST PROGRESS
===================================== */

export function getAllQuestProgress(): QuestProgress[] {
  const quests = getQuests();

  return quests.map((quest) => {
    const todos =
      quest.todos ?? [];

    const completedTodos =
      todos.filter(
        (todo) =>
          todo.completed
      ).length;

    const totalTodos =
      todos.length;

    let progress =
      quest.progress ?? 0;

    if (totalTodos > 0) {
      progress =
        completedTodos;
    }

    const completed =
      quest.status ===
        "completed" ||
      quest.status ===
        "rewarded";

    return {
      questId: quest.id,
      progress,
      status: quest.status,
      completed,
    };
  });
}

/* =====================================
   GET COINS
===================================== */

export function getCoins(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const stored =
      localStorage.getItem(
        COIN_STORAGE_KEY
      );

    if (!stored) {
      return 0;
    }

    const coins =
      Number(stored);

    if (
      !Number.isFinite(coins) ||
      coins < 0
    ) {
      return 0;
    }

    return coins;
  } catch {
    return 0;
  }
}

/* =====================================
   SAVE COINS
===================================== */

function saveCoins(
  coins: number
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    COIN_STORAGE_KEY,
    String(
      Math.max(0, coins)
    )
  );

  window.dispatchEvent(
    new Event("wallet-updated")
  );
}

/* =====================================
   GET COIN TRANSACTIONS
===================================== */

export function getCoinTransactions(): CoinTransaction[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored =
      localStorage.getItem(
        TRANSACTION_STORAGE_KEY
      );

    if (!stored) {
      return [];
    }

    const parsed =
      JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

/* =====================================
   SAVE COIN TRANSACTIONS
===================================== */

function saveCoinTransactions(
  transactions: CoinTransaction[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    TRANSACTION_STORAGE_KEY,
    JSON.stringify(
      transactions
    )
  );

  window.dispatchEvent(
    new Event("wallet-updated")
  );
}

/* =====================================
   CLAIM QUEST REWARD
===================================== */

export function claimQuestReward(
  questId: string
): Quest | null {
  const quests = getQuests();

  const index = quests.findIndex(
    (quest) =>
      quest.id === questId
  );

  if (index === -1) {
    return null;
  }

  const quest = quests[index];

  /* ป้องกันรับรางวัลซ้ำ */

  if (
    quest.status ===
    "rewarded"
  ) {
    return quest;
  }

  /* ต้องทำ Quest ให้เสร็จ */

  if (
    quest.status !==
    "completed"
  ) {
    return quest;
  }

  /* ตรวจ Todo อีกครั้ง */

  const todos =
    quest.todos ?? [];

  if (todos.length > 0) {
    const allCompleted =
      todos.every(
        (todo) =>
          todo.completed
      );

    if (!allCompleted) {
      return quest;
    }
  }

  const reward =
    Number(quest.reward) || 0;

  if (reward <= 0) {
    return quest;
  }

  /* เพิ่มเหรียญ */

  const currentCoins =
    getCoins();

  const newCoins =
    currentCoins + reward;

  saveCoins(newCoins);

  /* เพิ่มประวัติ */

  const transactions =
    getCoinTransactions();

  const transaction: CoinTransaction =
    {
      id: `transaction-${Date.now()}`,
      type: "earned",
      amount: reward,
      title: `ได้รับรางวัลจาก Quest: ${quest.title}`,
      date: new Date().toISOString(),
    };

  saveCoinTransactions([
    transaction,
    ...transactions,
  ]);

  /* เปลี่ยนสถานะ Quest */

  const updatedQuest: Quest = {
    ...quest,
    status: "rewarded",
  };

  quests[index] =
    updatedQuest;

  saveQuests(quests);

  return updatedQuest;
}

/* =====================================
   DELETE QUEST
===================================== */

export function deleteQuest(
  questId: string
): boolean {
  const quests = getQuests();

  const userId =
    getCurrentUserId();

  const quest =
    quests.find(
      (item) =>
        item.id === questId
    );

  if (!quest) {
    return false;
  }

  /* ลบได้เฉพาะเจ้าของ Quest */

  if (
    quest.creator.id !== userId
  ) {
    return false;
  }

  const updated =
    quests.filter(
      (item) =>
        item.id !== questId
    );

  saveQuests(updated);

  return true;
}