"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Typography,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";

import { Quest } from "@/types/quest";

type QuestCardProps = {
  quest: Quest;
};

export default function QuestCard({
  quest,
}: QuestCardProps) {
  const router = useRouter();

  const progress =
    quest.requirement > 0
      ? Math.min(
          (quest.progress /
            quest.requirement) *
            100,
          100
        )
      : 0;

  return (
    <Card
      onClick={() =>
        router.push(
          `/quests/${quest.id}`
        )
      }
      sx={{
        height: "100%",
        minHeight: 310,
        borderRadius: 5,
        cursor: "pointer",
        overflow: "hidden",

        border: "2px solid",
        borderColor: "#E9D5FF",

        background:
          "linear-gradient(145deg, #FFFFFF 0%, #FAF5FF 100%)",

        boxShadow:
          "0 8px 25px rgba(124, 58, 237, 0.08)",

        transition:
          "all 0.25s ease",

        "&:hover": {
          transform:
            "translateY(-8px) scale(1.01)",

          borderColor:
            "#8B5CF6",

          boxShadow:
            "0 18px 40px rgba(124, 58, 237, 0.18)",
        },
      }}
    >
      {/* PURPLE TOP */}

      <Box
        sx={{
          height: 8,

          background:
            "linear-gradient(90deg, #6D28D9, #7C3AED, #A855F7, #C084FC)",
        }}
      />

      <CardContent
        sx={{
          p: 3,

          "&:last-child": {
            pb: 3,
          },

          display: "flex",
          flexDirection: "column",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* CATEGORY */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <Chip
            label={quest.category}
            size="small"
            sx={{
              fontWeight: 800,
              borderRadius: 2,

              backgroundColor:
                "#EDE9FE",

              color:
                "#6D28D9",

              border:
                "1px solid #DDD6FE",
            }}
          />

          <Typography
            variant="caption"
            sx={{
              color:
                "#7C3AED",
              fontWeight: 700,
            }}
          >
            {quest.type ===
            "system"
              ? "✨ System"
              : "🎮 User"}
          </Typography>
        </Box>

        {/* TITLE */}

        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            lineHeight: 1.3,
            mb: 1,

            color:
              "#2E1065",

            display:
              "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient:
              "vertical",
            overflow: "hidden",
          }}
        >
          {quest.title}
        </Typography>

        {/* DESCRIPTION */}

        <Typography
          variant="body2"
          sx={{
            color:
              "#6B7280",
            lineHeight: 1.6,
            mb: 2.5,

            display:
              "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient:
              "vertical",
            overflow: "hidden",
          }}
        >
          {quest.description}
        </Typography>

        {/* REWARD */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",

            p: 1.7,
            mb: 2.5,

            borderRadius: 3,

            background:
              "linear-gradient(135deg, #FFF7CC 0%, #FEF3C7 100%)",

            border:
              "1px solid #FDE68A",

            boxShadow:
              "0 4px 12px rgba(245, 158, 11, 0.08)",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color:
                  "#92400E",
                fontWeight: 700,
              }}
            >
              🪙 REWARD
            </Typography>

            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 900,
                color:
                  "#B45309",
                lineHeight: 1.2,
              }}
            >
              {quest.reward}{" "}
              {quest.currency}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,

              borderRadius: 3,

              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",

              background:
                "#FDE68A",

              fontSize: 23,
            }}
          >
            🪙
          </Box>
        </Box>

        {/* PROGRESS */}

        <Box sx={{ mb: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              mb: 0.8,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color:
                  "#6D28D9",
              }}
            >
              ⚡ Progress
            </Typography>

            <Typography
              variant="caption"
              sx={{
                fontWeight: 900,
                color:
                  "#4C1D95",
              }}
            >
              {quest.progress} /{" "}
              {quest.requirement}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 9,
              borderRadius: 10,

              backgroundColor:
                "#E9D5FF",

              "& .MuiLinearProgress-bar":
                {
                  borderRadius: 10,

                  background:
                    "linear-gradient(90deg, #6D28D9, #7C3AED, #A855F7)",
                },
            }}
          />
        </Box>

        {/* BOTTOM */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",

            mt: "auto",
            pt: 1,
          }}
        >
          {/* PARTICIPANTS */}

          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color:
                "#6B7280",
            }}
          >
            👥 {quest.participants}
            {quest.maxParticipants
              ? ` / ${quest.maxParticipants}`
              : ""}
          </Typography>

          {/* DETAIL */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,

              color:
                "#7C3AED",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 900,
              }}
            >
              ดู Quest
            </Typography>

            <ArrowForwardIcon
              sx={{
                fontSize: 18,
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}