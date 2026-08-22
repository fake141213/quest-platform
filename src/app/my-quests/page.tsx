"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { quests } from "@/data/quests";

import {
  getAllQuestProgress,
} from "@/lib/questStorage";

import { QuestStatus } from "@/types/quest";

type MyQuest = {
  id: string;
  title: string;
  description: string;
  category: string;
  reward: number;
  requirement: number;
  progress: number;
  progressStep: number;
  status: QuestStatus;
};

export default function MyQuestsPage() {
  const router = useRouter();

  const [myQuests, setMyQuests] =
    useState<MyQuest[]>([]);

  const loadMyQuests = () => {
    const savedProgress =
      getAllQuestProgress();

    const result: MyQuest[] =
      savedProgress
        .map((saved) => {
          const quest = quests.find(
            (item) =>
              item.id ===
              saved.questId
          );

          if (!quest) {
            return null;
          }

          return {
            id: quest.id,
            title: quest.title,
            description:
              quest.description,
            category:
              quest.category,
            reward: quest.reward,
            requirement:
              quest.requirement,
            progress:
              saved.progress,
            progressStep:
              quest.progressStep,
            status:
              saved.status,
          };
        })
        .filter(
          (
            quest
          ): quest is MyQuest =>
            quest !== null
        );

    setMyQuests(result);
  };

  useEffect(() => {
    loadMyQuests();

    const handleUpdate = () => {
      loadMyQuests();
    };

    window.addEventListener(
      "quest-progress-updated",
      handleUpdate
    );

    window.addEventListener(
      "storage",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "quest-progress-updated",
        handleUpdate
      );

      window.removeEventListener(
        "storage",
        handleUpdate
      );
    };
  }, []);

  const getStatusLabel = (
    status: QuestStatus
  ) => {
    switch (status) {
      case "available":
        return "Available";

      case "in_progress":
        return "In Progress";

      case "waiting_confirmation":
        return "Waiting Confirmation";

      case "completed":
        return "Completed";

      case "rewarded":
        return "Rewarded";

      case "cancelled":
        return "Cancelled";

      default:
        return status;
    }
  };

  const getStatusColor = (
    status: QuestStatus
  ) => {
    switch (status) {
      case "completed":
      case "rewarded":
        return "success";

      case "cancelled":
        return "error";

      case "waiting_confirmation":
        return "warning";

      case "in_progress":
        return "primary";

      default:
        return "default";
    }
  };

  return (
    <Box
      component="main"
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        py: {
          xs: 3,
          md: 6,
        },
      }}
    >
      {/* Back Home */}

      <Button
        variant="outlined"
        onClick={() =>
          router.push("/")
        }
        sx={{
          mb: 4,
          borderRadius: 2,
          fontWeight: 700,
          textTransform:
            "none",
        }}
      >
        กลับหน้าแรก
      </Button>

      {/* Header */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1,
          }}
        >
          My Quests
        </Typography>

        <Typography color="text.secondary">
          Quest ที่คุณกำลังทำ
          และ Quest ที่ทำเสร็จแล้ว
        </Typography>
      </Box>

      {/* Empty */}

      {myQuests.length === 0 && (
        <Card
          sx={{
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <CardContent
            sx={{
              py: 8,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              ยังไม่มี Quest
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mb: 3,
              }}
            >
              ไปเลือก Quest
              ที่คุณสนใจได้เลย
            </Typography>

            <Button
              variant="contained"
              onClick={() =>
                router.push(
                  "/quests"
                )
              }
              sx={{
                borderRadius: 2,
                fontWeight: 700,
              }}
            >
              ดู Quests
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quest List */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },
          gap: 3,
        }}
      >
        {myQuests.map(
          (quest) => {
            const percentage =
              quest.requirement >
              0
                ? Math.min(
                    (quest.progress /
                      quest.requirement) *
                      100,
                    100
                  )
                : 0;

            return (
              <Card
                key={quest.id}
                sx={{
                  borderRadius: 4,
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                  }}
                >
                  {/* Category + Status */}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Chip
                      label={
                        quest.category
                      }
                      color="primary"
                      size="small"
                    />

                    <Chip
                      label={getStatusLabel(
                        quest.status
                      )}
                      color={
                        getStatusColor(
                          quest.status
                        ) as any
                      }
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {/* Title */}

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      mb: 1,
                    }}
                  >
                    {quest.title}
                  </Typography>

                  {/* Description */}

                  <Typography
                    color="text.secondary"
                    sx={{
                      mb: 3,
                    }}
                  >
                    {
                      quest.description
                    }
                  </Typography>

                  {/* Reward */}

                  <Typography
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                    }}
                  >
                    🪙 {quest.reward} QC
                  </Typography>

                  {/* Progress */}

                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        Progress
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {
                          quest.progress
                        }{" "}
                        /{" "}
                        {
                          quest.requirement
                        }
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={
                        percentage
                      }
                      color={
                        quest.status ===
                          "completed" ||
                        quest.status ===
                          "rewarded"
                          ? "success"
                          : quest.status ===
                            "cancelled"
                          ? "error"
                          : "primary"
                      }
                      sx={{
                        height: 8,
                        borderRadius: 10,
                      }}
                    />
                  </Box>

                  {/* Button */}

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() =>
                      router.push(
                        `/quests/${quest.id}`
                      )
                    }
                    sx={{
                      borderRadius: 2,
                      py: 1.25,
                      fontWeight: 700,
                    }}
                  >
                    {quest.status ===
                    "in_progress"
                      ? "ทำต่อ"
                      : "ดู Quest"}
                  </Button>
                </CardContent>
              </Card>
            );
          }
        )}
      </Box>
    </Box>
  );
}