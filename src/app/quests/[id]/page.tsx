"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import Navbar from "@/components/Navbar";
import { Quest } from "@/types/quest";
import {
  acceptQuest,
  claimQuestReward,
  completeTodo,
  deleteQuest,
  getCurrentUserId,
  getQuestById,
} from "@/lib/questStorage";

export default function QuestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const questId = String(params.id);

  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  const currentUserId = getCurrentUserId();

  useEffect(() => {
    const foundQuest = getQuestById(questId);
    setQuest(foundQuest);
    setLoading(false);
  }, [questId]);

  const todos = useMemo(() => {
    return quest?.todos ?? [];
  }, [quest]);

  const completedTodos = todos.filter(
    (todo) => todo.completed
  ).length;

  const totalTodos = todos.length;

  const progress =
    totalTodos > 0
      ? Math.round((completedTodos / totalTodos) * 100)
      : 0;

  const isOwner =
    quest?.creator.id === currentUserId;

  const canAccept =
    quest?.status === "available" && !isOwner;

  const isInProgress =
    quest?.status === "in_progress";

  const isCompleted =
    quest?.status === "completed";

  const isRewarded =
    quest?.status === "rewarded";

  const handleAcceptQuest = () => {
    if (!quest) return;

    setActionLoading(true);

    const updated = acceptQuest(quest.id);

    if (updated) {
      setQuest(updated);
      setMessage("รับ Quest แล้ว! เริ่มทำได้เลย");
    }

    setActionLoading(false);
  };

  const handleCompleteTodo = (todoId: string) => {
    if (!quest) return;

    if (quest.status !== "in_progress") {
      return;
    }

    setActionLoading(true);

    const updated = completeTodo(
      quest.id,
      todoId
    );

    if (updated) {
      setQuest(updated);

      if (updated.status === "completed") {
        setMessage(
          "ทำ Quest ครบแล้ว! กดรับรางวัลได้เลย 🎉"
        );
      }
    }

    setActionLoading(false);
  };

  const handleClaimReward = () => {
    if (!quest) return;

    if (quest.status !== "completed") {
      return;
    }

    setActionLoading(true);

    const updated = claimQuestReward(
      quest.id
    );

    if (updated) {
      setQuest(updated);

      if (updated.status === "rewarded") {
        setMessage(
          `รับรางวัลสำเร็จ! ได้รับ ${updated.reward} ${updated.currency} 🎉`
        );
      }
    }

    setActionLoading(false);
  };

  const handleDeleteQuest = () => {
    if (!quest || !isOwner) {
      return;
    }

    const confirmed = window.confirm(
      "คุณต้องการลบ Quest นี้ใช่หรือไม่?"
    );

    if (!confirmed) {
      return;
    }

    const success = deleteQuest(
      quest.id
    );

    if (success) {
      router.push("/quests");
    } else {
      setMessage(
        "ไม่สามารถลบ Quest ได้"
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <Box
          sx={{
            maxWidth: 850,
            mx: "auto",
            px: 2,
            py: 6,
            textAlign: "center",
          }}
        >
          <Typography color="text.secondary">
            กำลังโหลด Quest...
          </Typography>
        </Box>
      </>
    );
  }

  if (!quest) {
    return (
      <>
        <Navbar />

        <Box
          sx={{
            maxWidth: 850,
            mx: "auto",
            px: 2,
            py: 6,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              mb: 1,
            }}
          >
            Quest not found
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            ไม่พบ Quest ID: {questId}
          </Typography>

          <Button
            variant="contained"
            onClick={() =>
              router.push("/quests")
            }
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            กลับไป Quest ทั้งหมด
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: 850,
          mx: "auto",
          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },
          py: {
            xs: 2.5,
            md: 4,
          },
        }}
      >
        <Button
          variant="outlined"
          startIcon={
            <ArrowBackIcon />
          }
          onClick={() =>
            router.push("/quests")
          }
          sx={{
            mb: 2,
            borderRadius: 2,
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          กลับไป Quest ทั้งหมด
        </Button>

        <Card
          sx={{
            borderRadius: {
              xs: 3,
              md: 4,
            },
            overflow: "hidden",
            boxShadow:
              "0 8px 30px rgba(124,58,237,0.08)",
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 2,
                sm: 3,
                md: 4,
              },
              "&:last-child": {
                pb: {
                  xs: 2,
                  sm: 3,
                  md: 4,
                },
              },
            }}
          >
            <Chip
              label={quest.category}
              color="primary"
              size="small"
              sx={{
                mb: 1.5,
                fontWeight: 700,
              }}
            />

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: {
                  xs: "1.7rem",
                  sm: "2.2rem",
                  md: "2.6rem",
                },
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              {quest.title}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: 14,
                  sm: 15,
                },
                lineHeight: 1.6,
                mb: 2.5,
              }}
            >
              {quest.description}
            </Typography>

            <Divider sx={{ mb: 2.5 }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, 1fr)",
                },
                gap: 1.5,
                mb: 2.5,
              }}
            >
              <Box
                sx={{
                  p: 1.8,
                  borderRadius: 2.5,
                  background:
                    "linear-gradient(135deg,#F3E8FF,#FAF5FF)",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Reward
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: "1.2rem",
                  }}
                >
                  🪙 {quest.reward}{" "}
                  {quest.currency}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 1.8,
                  borderRadius: 2.5,
                  background:
                    "linear-gradient(135deg,#EEF2FF,#F5F3FF)",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Participants
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                  }}
                >
                  <PeopleIcon fontSize="small" />

                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: "1.2rem",
                    }}
                  >
                    {quest.participants}/
                    {quest.maxParticipants}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 1.8,
                  borderRadius: 2.5,
                  background:
                    "linear-gradient(135deg,#EFF6FF,#F0FDFA)",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Deadline
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                  }}
                >
                  <AccessTimeIcon fontSize="small" />

                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {quest.deadline ??
                      "ไม่กำหนด"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2.5,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg,#7C3AED,#A855F7)",
                  color: "white",
                  fontWeight: 900,
                  fontSize: 18,
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {quest.creator.avatar ||
                  quest.creator.name
                    ?.charAt(0)
                    .toUpperCase() ||
                  "U"}
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Created by
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  {quest.creator.name}
                </Typography>
              </Box>
            </Box>

            {isOwner && (
              <Box
                sx={{
                  p: 1.8,
                  mb: 2.5,
                  borderRadius: 2.5,
                  background:
                    "linear-gradient(135deg,#FFF7ED,#FFFBEB)",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  👑 คุณเป็นเจ้าของ Quest นี้
                </Typography>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={
                    handleDeleteQuest
                  }
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform:
                      "none",
                  }}
                >
                  ลบ Quest
                </Button>
              </Box>
            )}

            {canAccept && (
              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={actionLoading}
                onClick={
                  handleAcceptQuest
                }
                sx={{
                  minHeight: 52,
                  borderRadius: 2.5,
                  fontWeight: 800,
                  textTransform: "none",
                  mb: 2.5,
                  background:
                    "linear-gradient(135deg,#7C3AED,#9333EA)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#6D28D9,#7E22CE)",
                  },
                }}
              >
                {actionLoading
                  ? "กำลังรับ Quest..."
                  : "รับ Quest"}
              </Button>
            )}

            {(isInProgress ||
              isCompleted ||
              isRewarded) &&
              todos.length > 0 && (
                <Box
                  sx={{
                    mb: 2.5,
                    p: {
                      xs: 2,
                      sm: 2.5,
                    },
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg,#FAF5FF,#F5F3FF)",
                    border:
                      "1px solid #E9D5FF",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: {
                          xs: "1rem",
                          sm: "1.15rem",
                        },
                      }}
                    >
                      Quest Progress
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 800,
                        color:
                          "primary.main",
                      }}
                    >
                      {completedTodos}/
                      {totalTodos}
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 10,
                      mb: 2,
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection:
                        "column",
                      gap: 1,
                    }}
                  >
                    {todos.map(
                      (todo) => (
                        <Box
                          key={
                            todo.id
                          }
                          sx={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "space-between",
                            gap: 1,
                            p: 1.5,
                            borderRadius:
                              2,
                            backgroundColor:
                              "white",
                            border:
                              "1px solid",
                            borderColor:
                              "divider",
                          }}
                        >
                          <Box
                            sx={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 1,
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize:
                                  "1.1rem",
                              }}
                            >
                              {todo.completed
                                ? "✅"
                                : "⬜"}
                            </Typography>

                            <Typography
                              sx={{
                                fontWeight:
                                  700,
                                fontSize:
                                  14,
                                textDecoration:
                                  todo.completed
                                    ? "line-through"
                                    : "none",
                                opacity:
                                  todo.completed
                                    ? 0.55
                                    : 1,
                              }}
                            >
                              {
                                todo.title
                              }
                            </Typography>
                          </Box>

                          {!todo.completed &&
                            isInProgress && (
                              <Button
                                variant="contained"
                                size="small"
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  handleCompleteTodo(
                                    todo.id
                                  )
                                }
                                sx={{
                                  flexShrink: 0,
                                  borderRadius: 2,
                                  fontWeight: 700,
                                  textTransform:
                                    "none",
                                }}
                              >
                                ทำเสร็จแล้ว
                              </Button>
                            )}
                        </Box>
                      )
                    )}
                  </Box>
                </Box>
              )}

            {isCompleted && (
              <Box
                sx={{
                  p: 2.5,
                  mb: 2,
                  borderRadius: 3,
                  textAlign: "center",
                  background:
                    "linear-gradient(135deg,#F3E8FF,#FAF5FF)",
                  border:
                    "1px solid #DDD6FE",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 34,
                    mb: 0.5,
                  }}
                >
                  🎉
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: {
                      xs: "1.2rem",
                      sm: "1.4rem",
                    },
                    mb: 0.5,
                  }}
                >
                  Quest Completed!
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: 14,
                    mb: 2,
                  }}
                >
                  คุณทำ Quest
                  ครบทุกขั้นตอนแล้ว
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={actionLoading}
                  onClick={
                    handleClaimReward
                  }
                  sx={{
                    minHeight: 52,
                    borderRadius: 2.5,
                    fontWeight: 900,
                    textTransform:
                      "none",
                    background:
                      "linear-gradient(135deg,#7C3AED,#9333EA)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#6D28D9,#7E22CE)",
                    },
                  }}
                >
                  {actionLoading
                    ? "กำลังรับรางวัล..."
                    : `🪙 รับรางวัล ${quest.reward} ${quest.currency}`}
                </Button>
              </Box>
            )}

            {isRewarded && (
              <Box
                sx={{
                  p: 2.5,
                  mb: 2,
                  borderRadius: 3,
                  textAlign: "center",
                  background:
                    "linear-gradient(135deg,#F3E8FF,#FAF5FF)",
                  border:
                    "1px solid #DDD6FE",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 38,
                    mb: 0.5,
                  }}
                >
                  🪙
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: "1.3rem",
                    mb: 0.5,
                  }}
                >
                  รับรางวัลแล้ว!
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 14 }}
                >
                  คุณได้รับ{" "}
                  <strong>
                    {quest.reward}{" "}
                    {quest.currency}
                  </strong>{" "}
                  จาก Quest นี้แล้ว
                </Typography>
              </Box>
            )}

            {message && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2.5,
                  background:
                    "linear-gradient(135deg,#ECFDF5,#F0FDFA)",
                  border:
                    "1px solid #A7F3D0",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {message}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}