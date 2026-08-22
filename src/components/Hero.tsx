"use client";

import {
  Box,
  Chip,
  Typography,
} from "@mui/material";

export default function Hero() {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 55%, #FFF7ED 100%)",
        borderRadius: {
          xs: 3,
          md: 5,
        },
        p: {
          xs: 3,
          sm: 5,
          md: 7,
        },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          maxWidth: 700,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* BADGE */}

        <Chip
          label="Complete Quests. Earn Rewards."
          color="primary"
          sx={{
            mb: 2,
            fontWeight: 600,
          }}
        />

        {/* TITLE */}

        <Typography
          variant="h2"
          sx={{
            fontSize: {
              xs: "2rem",
              sm: "2.75rem",
              md: "3.5rem",
            },
            fontWeight: 800,
            lineHeight: 1.1,
            mb: 2,
            color: "text.primary",
          }}
        >
          Turn Your Goals
          <br />
          Into{" "}
          <Box
            component="span"
            sx={{
              color: "primary.main",
            }}
          >
            Quests.
          </Box>
        </Typography>

        {/* DESCRIPTION */}

        <Typography
          sx={{
            fontSize: {
              xs: 15,
              md: 18,
            },
            color: "text.secondary",
            maxWidth: 580,
            lineHeight: 1.7,
          }}
        >
          Discover quests, complete challenges,
          connect with people, and earn QC rewards
          along the way.
        </Typography>
      </Box>
    </Box>
  );
}