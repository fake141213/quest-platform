"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Quest } from "@/types/quest";
import { useQuests } from "@/hooks/useQuests";

export default function CreateQuestPage() {
  const router = useRouter();

  const { addQuest } = useQuests();

  // =========================
  // FORM STATE
  // =========================

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("Study");

  const [reward, setReward] =
    useState("30");

  const [requirement, setRequirement] =
    useState("1");

  const [progressStep, setProgressStep] =
    useState("1");

  const [maxParticipants, setMaxParticipants] =
    useState("10");

  const [deadline, setDeadline] =
    useState("");

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  // =========================
  // CREATE QUEST
  // =========================

  const handleCreateQuest = () => {
    setError("");

    // -------------------------
    // VALIDATE TITLE
    // -------------------------

    if (!title.trim()) {
      setError(
        "กรุณากรอกชื่อ Quest"
      );
      return;
    }

    // -------------------------
    // VALIDATE DESCRIPTION
    // -------------------------

    if (!description.trim()) {
      setError(
        "กรุณากรอกรายละเอียด Quest"
      );
      return;
    }

    // -------------------------
    // CONVERT NUMBER
    // -------------------------

    const rewardNumber =
      Number(reward);

    const requirementNumber =
      Number(requirement);

    const progressStepNumber =
      Number(progressStep);

    const maxParticipantsNumber =
      Number(maxParticipants);

    // -------------------------
    // VALIDATE REWARD
    // -------------------------

    if (
      !Number.isFinite(
        rewardNumber
      ) ||
      rewardNumber < 0
    ) {
      setError(
        "Reward ต้องเป็นตัวเลขที่ถูกต้อง"
      );
      return;
    }

    // -------------------------
    // VALIDATE REQUIREMENT
    // -------------------------

    if (
      !Number.isFinite(
        requirementNumber
      ) ||
      requirementNumber <= 0
    ) {
      setError(
        "Requirement ต้องมากกว่า 0"
      );
      return;
    }

    // -------------------------
    // VALIDATE PROGRESS STEP
    // -------------------------

    if (
      !Number.isFinite(
        progressStepNumber
      ) ||
      progressStepNumber <= 0
    ) {
      setError(
        "Progress Step ต้องมากกว่า 0"
      );
      return;
    }

    // -------------------------
    // VALIDATE PARTICIPANTS
    // -------------------------

    if (
      !Number.isFinite(
        maxParticipantsNumber
      ) ||
      maxParticipantsNumber <= 0
    ) {
      setError(
        "จำนวนผู้เข้าร่วมต้องมากกว่า 0"
      );
      return;
    }

    // =========================
    // CREATE QUEST OBJECT
    // =========================

    const newQuest: Quest = {
      id: `quest-${Date.now()}`,

      title: title.trim(),

      description:
        description.trim(),

      category,

      reward: rewardNumber,

      currency: "QC",

      requirement:
        requirementNumber,

      progress: 0,

      progressStep:
        progressStepNumber,

      creator: {
        id: "user-001",
        name: "You",
        avatar: "",
      },

      type: "user",

      status: "available",

      participants: 0,

      maxParticipants:
        maxParticipantsNumber,

      deadline:
        deadline || undefined,
    };

    // =========================
    // SAVE QUEST
    // =========================

    setSaving(true);

    const success =
      addQuest(newQuest);

    if (!success) {
      setSaving(false);

      setError(
        "ไม่สามารถสร้าง Quest ได้"
      );

      return;
    }

    // =========================
    // GO TO QUEST LIST
    // =========================

    router.push("/quests");
  };

  // =========================
  // PAGE
  // =========================

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        maxWidth: 1000,
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
      {/* =========================
          BACK BUTTON
      ========================== */}

      <Button
        variant="outlined"
        color="inherit"
        startIcon={
          <ArrowBackIcon />
        }
        onClick={() =>
          router.push("/quests")
        }
        sx={{
          mb: 3,
          borderRadius: 2,
          fontWeight: 700,
          textTransform:
            "none",
        }}
      >
        กลับหน้า Quests
      </Button>

      {/* =========================
          HEADER
      ========================== */}

      <Box
        sx={{
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1,

            fontSize: {
              xs: "2rem",
              sm: "2.5rem",
              md: "3rem",
            },
          }}
        >
          Create Quest
        </Typography>

        <Typography
          color="text.secondary"
        >
          สร้าง Quest ของคุณ
          เพื่อให้คนอื่นเข้ามาร่วมทำ
        </Typography>
      </Box>

      {/* =========================
          FORM CARD
      ========================== */}

      <Card
        sx={{
          borderRadius: 4,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2.5,
              sm: 4,
              md: 5,
            },
          }}
        >
          {/* =========================
              QUEST INFORMATION
          ========================== */}

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              mb: 3,
            }}
          >
            Quest Information
          </Typography>

          {/* TITLE */}

          <TextField
            fullWidth
            label="Quest Title"
            placeholder="เช่น อ่านหนังสือ 30 นาที"
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value
              )
            }
            sx={{
              mb: 3,
            }}
          />

          {/* DESCRIPTION */}

          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Description"
            placeholder="อธิบายรายละเอียดของ Quest"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            sx={{
              mb: 3,
            }}
          />

          {/* CATEGORY */}

          <TextField
            fullWidth
            select
            label="Category"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            sx={{
              mb: 4,
            }}
          >
            <MenuItem value="Study">
              Study
            </MenuItem>

            <MenuItem value="Health">
              Health
            </MenuItem>

            <MenuItem value="Work">
              Work
            </MenuItem>

            <MenuItem value="Fitness">
              Fitness
            </MenuItem>

            <MenuItem value="Lifestyle">
              Lifestyle
            </MenuItem>

            <MenuItem value="Other">
              Other
            </MenuItem>
          </TextField>

          <Divider
            sx={{
              mb: 4,
            }}
          />

          {/* =========================
              QUEST SETTINGS
          ========================== */}

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              mb: 3,
            }}
          >
            Quest Settings
          </Typography>

          {/* =========================
              REWARD
          ========================== */}

          <TextField
            fullWidth
            type="number"
            label="Reward"
            value={reward}
            onChange={(event) =>
              setReward(
                event.target.value
              )
            }
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
            helperText="จำนวนเหรียญ QC ที่ผู้ทำ Quest จะได้รับ"
            sx={{
              mb: 3,
            }}
          />

          {/* =========================
              REQUIREMENT
          ========================== */}

          <TextField
            fullWidth
            type="number"
            label="Requirement"
            value={requirement}
            onChange={(event) =>
              setRequirement(
                event.target.value
              )
            }
            slotProps={{
              htmlInput: {
                min: 1,
              },
            }}
            helperText="จำนวนครั้งที่ต้องทำ Quest ให้สำเร็จ"
            sx={{
              mb: 3,
            }}
          />

          {/* =========================
              PROGRESS STEP
          ========================== */}

          <TextField
            fullWidth
            type="number"
            label="Progress Step"
            value={progressStep}
            onChange={(event) =>
              setProgressStep(
                event.target.value
              )
            }
            slotProps={{
              htmlInput: {
                min: 1,
              },
            }}
            helperText="เมื่อทำ Todo สำเร็จ จะเพิ่ม Progress เท่าไร"
            sx={{
              mb: 3,
            }}
          />

          {/* =========================
              MAX PARTICIPANTS
          ========================== */}

          <TextField
            fullWidth
            type="number"
            label="Maximum Participants"
            value={
              maxParticipants
            }
            onChange={(event) =>
              setMaxParticipants(
                event.target.value
              )
            }
            slotProps={{
              htmlInput: {
                min: 1,
              },
            }}
            helperText="จำนวนคนสูงสุดที่สามารถรับ Quest นี้"
            sx={{
              mb: 3,
            }}
          />

          {/* =========================
              DEADLINE
          ========================== */}

          <TextField
            fullWidth
            type="datetime-local"
            label="Deadline"
            value={deadline}
            onChange={(event) =>
              setDeadline(
                event.target.value
              )
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            helperText="ไม่กำหนดเวลาก็สามารถเว้นว่างได้"
            sx={{
              mb: 4,
            }}
          />

          {/* =========================
              ERROR
          ========================== */}

          {error && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor:
                  "error.main",
                backgroundColor:
                  "rgba(211, 47, 47, 0.08)",
              }}
            >
              <Typography
                color="error"
                sx={{
                  fontWeight: 600,
                }}
              >
                {error}
              </Typography>
            </Box>
          )}

          {/* =========================
              PREVIEW
          ========================== */}

          <Box
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              backgroundColor:
                "action.hover",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 2,
              }}
            >
              Quest Preview
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              {title ||
                "ชื่อ Quest ของคุณ"}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mb: 2,
              }}
            >
              {description ||
                "รายละเอียด Quest"}
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              🪙 {reward || 0} QC
            </Typography>

            <Typography
              color="text.secondary"
            >
              Progress: 0 /{" "}
              {requirement || 0}
            </Typography>

            <Typography
              color="text.secondary"
            >
              Participants: 0 /{" "}
              {maxParticipants || 0}
            </Typography>

            {deadline && (
              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                }}
              >
                Deadline:{" "}
                {deadline}
              </Typography>
            )}
          </Box>

          {/* =========================
              CREATE BUTTON
          ========================== */}

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={
              <AddIcon />
            }
            disabled={saving}
            onClick={
              handleCreateQuest
            }
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 800,
              fontSize: "1rem",
              textTransform:
                "none",
            }}
          >
            {saving
              ? "กำลังสร้าง Quest..."
              : "สร้าง Quest"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}