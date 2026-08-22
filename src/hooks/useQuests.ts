"use client";

import { useEffect, useState } from "react";

import { Quest } from "@/types/quest";
import { quests as defaultQuests } from "@/data/quests";

const STORAGE_KEY = "quests";

const CURRENT_USER_ID = "user-001";

export function useQuests() {
  const [quests, setQuests] =
    useState<Quest[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LOAD QUESTS
  // =========================

  const loadQuests = () => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    try {
      const stored =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!stored) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            defaultQuests
          )
        );

        setQuests(
          defaultQuests
        );

        setLoading(false);

        return;
      }

      const parsed: unknown =
        JSON.parse(stored);

      if (
        Array.isArray(parsed)
      ) {
        setQuests(
          parsed as Quest[]
        );
      } else {
        setQuests(
          defaultQuests
        );
      }
    } catch (error) {
      console.error(
        "Failed to load quests:",
        error
      );

      setQuests(
        defaultQuests
      );
    }

    setLoading(false);
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadQuests();

    const handleUpdate = () => {
      loadQuests();
    };

    window.addEventListener(
      "quests-updated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "quests-updated",
        handleUpdate
      );
    };
  }, []);

  // =========================
  // SAVE ALL
  // =========================

  const saveQuests = (
    updatedQuests: Quest[]
  ) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          updatedQuests
        )
      );

      setQuests(
        updatedQuests
      );

      window.dispatchEvent(
        new Event(
          "quests-updated"
        )
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to save quests:",
        error
      );

      return false;
    }
  };

  // =========================
  // ADD QUEST
  // =========================

  const addQuest = (
    quest: Quest
  ) => {
    return saveQuests([
      ...quests,
      quest,
    ]);
  };

  // =========================
  // UPDATE QUEST
  // =========================

  const updateQuest = (
    questId: string,
    updates: Partial<Quest>
  ) => {
    const target =
      quests.find(
        (quest) =>
          quest.id === questId
      );

    if (!target) {
      return false;
    }

    // ป้องกันการแก้ Quest
    // ที่ไม่ได้เป็นของตัวเอง
    if (
      target.creator.id !==
      CURRENT_USER_ID
    ) {
      console.warn(
        "You cannot edit this quest."
      );

      return false;
    }

    const updatedQuests =
      quests.map(
        (quest) =>
          quest.id === questId
            ? {
                ...quest,
                ...updates,
                creator:
                  quest.creator,
              }
            : quest
      );

    return saveQuests(
      updatedQuests
    );
  };

  // =========================
  // DELETE QUEST
  // =========================

  const deleteQuest = (
    questId: string
  ) => {
    const target =
      quests.find(
        (quest) =>
          quest.id === questId
      );

    if (!target) {
      return false;
    }

    // ป้องกันการลบ Quest
    // ที่ไม่ได้เป็นของตัวเอง
    if (
      target.creator.id !==
      CURRENT_USER_ID
    ) {
      console.warn(
        "You cannot delete this quest."
      );

      return false;
    }

    const updatedQuests =
      quests.filter(
        (quest) =>
          quest.id !==
          questId
      );

    return saveQuests(
      updatedQuests
    );
  };

  // =========================
  // CHECK OWNER
  // =========================

  const isOwner = (
    quest: Quest
  ) => {
    return (
      quest.creator.id ===
      CURRENT_USER_ID
    );
  };

  return {
    quests,
    loading,

    addQuest,
    updateQuest,
    deleteQuest,

    isOwner,

    reload: loadQuests,
  };
}