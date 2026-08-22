import { Quest } from "@/types/quest";

export const quests: Quest[] = [
  {
    id: "quest-001",

    title: "อ่านหนังสือ 30 นาที",

    description:
      "ใช้เวลาอ่านหนังสือที่สนใจอย่างน้อย 30 นาที",

    category: "Learning",

    reward: 30,

    currency: "QC",

    requirement: 1,

    progress: 0,

    progressStep: 1,

    creator: {
      id: "system",
      name: "Quest System",
      avatar: "",
    },

    type: "system",

    status: "available",

    participants: 0,

    maxParticipants: 100,
  },

  {
    id: "quest-002",

    title: "เดินให้ครบ 5,000 ก้าว",

    description:
      "เดินหรือออกกำลังกายให้ครบอย่างน้อย 5,000 ก้าว",

    category: "Health",

    reward: 50,

    currency: "QC",

    requirement: 5000,

    progress: 0,

    progressStep: 500,

    creator: {
      id: "system",
      name: "Quest System",
      avatar: "",
    },

    type: "system",

    status: "available",

    participants: 0,

    maxParticipants: 100,
  },

  {
    id: "quest-003",

    title: "ฝึกเขียนโปรแกรม 1 ชั่วโมง",

    description:
      "ฝึกเขียนโปรแกรมหรือเรียนรู้เทคโนโลยีใหม่เป็นเวลา 1 ชั่วโมง",

    category: "Coding",

    reward: 80,

    currency: "QC",

    requirement: 1,

    progress: 0,

    progressStep: 1,

    creator: {
      id: "system",
      name: "Quest System",
      avatar: "",
    },

    type: "system",

    status: "available",

    participants: 0,

    maxParticipants: 50,
  },

  {
    id: "quest-004",

    title: "เล่นเกมด้วยกัน 5 รอบ",

    description:
      "หาเพื่อนร่วมเล่นเกมและเล่นด้วยกันให้ครบ 5 รอบ",

    category: "Gaming",

    reward: 50,

    currency: "QC",

    requirement: 5,

    progress: 0,

    progressStep: 1,

    creator: {
      id: "user-001",
      name: "Alex",
      avatar: "",
    },

    type: "user",

    status: "available",

    participants: 2,

    maxParticipants: 5,
  },

  {
    id: "quest-005",

    title: "หาคนเล่นเกมด้วย 5 รอบ",

    description:
      "ชวนผู้เล่นคนอื่นมาทำ Quest และเล่นเกมด้วยกัน",

    category: "Social",

    reward: 50,

    currency: "QC",

    requirement: 5,

    progress: 0,

    progressStep: 1,

    creator: {
      id: "user-002",
      name: "Mew",
      avatar: "",
    },

    type: "user",

    status: "available",

    participants: 3,

    maxParticipants: 5,
  },

  {
    id: "quest-006",

    title: "เรียนรู้ภาษาใหม่",

    description:
      "ใช้เวลาเรียนรู้คำศัพท์หรือบทเรียนภาษาใหม่อย่างน้อย 30 นาที",

    category: "Learning",

    reward: 40,

    currency: "QC",

    requirement: 1,

    progress: 0,

    progressStep: 1,

    creator: {
      id: "system",
      name: "Quest System",
      avatar: "",
    },

    type: "system",

    status: "available",

    participants: 0,

    maxParticipants: 100,
  },
];