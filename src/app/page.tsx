"use client";

import {
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuestCard from "@/components/QuestCard";
import { useQuests } from "@/hooks/useQuests";

const QUESTS_PER_PAGE = 3;

export default function Home() {
  const router = useRouter();

  const {
    quests,
    loading,
  } = useQuests();

  const [page, setPage] = useState(0);

  /*
   * ==============================
   * QUEST PAGINATION
   * ==============================
   */

  const totalPages = Math.ceil(
    quests.length / QUESTS_PER_PAGE
  );

  const startIndex =
    page * QUESTS_PER_PAGE;

  const endIndex =
    startIndex + QUESTS_PER_PAGE;

  const currentQuests =
    quests.slice(
      startIndex,
      endIndex
    );

  const canGoPrevious =
    page > 0;

  const canGoNext =
    page < totalPages - 1;

  /*
   * ==============================
   * PREVIOUS
   * ==============================
   */

  const handlePrevious = () => {
    if (canGoPrevious) {
      setPage(
        (currentPage) =>
          currentPage - 1
      );
    }
  };

  /*
   * ==============================
   * NEXT
   * ==============================
   */

  const handleNext = () => {
    if (canGoNext) {
      setPage(
        (currentPage) =>
          currentPage + 1
      );
    }
  };

  return (
    <>
      <Navbar />

      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: 1400,
          mx: "auto",
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          py: {
            xs: 3,
            md: 5,
          },
          boxSizing: "border-box",
        }}
      >
        {/* ==============================
            HERO
        ============================== */}

        <Hero />

        {/* ==============================
            RECOMMENDED QUESTS
        ============================== */}

        <Box
          sx={{
            mt: {
              xs: 5,
              md: 7,
            },
          }}
        >
          {/* HEADER */}

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "flex-end",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 0.5,
                }}
              >
                Recommended Quests
              </Typography>

              <Typography
                color="text.secondary"
              >
                Quests you might want
                to try
              </Typography>
            </Box>

            {/* VIEW ALL */}

            <Button
              variant="outlined"
              onClick={() =>
                router.push(
                  "/quests"
                )
              }
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                textTransform:
                  "none",
              }}
            >
              ดู Quest ทั้งหมด
            </Button>
          </Box>

          {/* ==============================
              LOADING
          ============================== */}

          {loading && (
            <Box
              sx={{
                py: 8,
                textAlign: "center",
              }}
            >
              <Typography
                color="text.secondary"
              >
                กำลังโหลด Quest...
              </Typography>
            </Box>
          )}

          {/* ==============================
              QUEST LIST
          ============================== */}

          {!loading &&
            currentQuests.length > 0 && (
              <Grid
                container
                spacing={3}
              >
                {currentQuests.map(
                  (quest) => (
                    <Grid
                      key={quest.id}
                      size={{
                        xs: 12,
                        md: 4,
                      }}
                    >
                      <QuestCard
                        quest={quest}
                      />
                    </Grid>
                  )
                )}
              </Grid>
            )}

          {/* ==============================
              NO QUEST
          ============================== */}

          {!loading &&
            quests.length === 0 && (
              <Box
                sx={{
                  textAlign: "center",
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
                  ลองสร้าง Quest
                  แรกของคุณดู
                </Typography>

                <Button
                  variant="contained"
                  onClick={() =>
                    router.push(
                      "/create-quest"
                    )
                  }
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform:
                      "none",
                  }}
                >
                  สร้าง Quest
                </Button>
              </Box>
            )}

          {/* ==============================
              PAGINATION
          ============================== */}

          {!loading &&
            quests.length > 3 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "center",
                  alignItems: "center",
                  gap: 2,
                  mt: 4,
                }}
              >
                {/* PREVIOUS */}

                <Button
                  variant="outlined"
                  startIcon={
                    <ArrowBackIcon />
                  }
                  disabled={
                    !canGoPrevious
                  }
                  onClick={
                    handlePrevious
                  }
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform:
                      "none",
                  }}
                >
                  ก่อนหน้า
                </Button>

                {/* PAGE */}

                <Typography
                  sx={{
                    fontWeight: 700,
                    minWidth: 70,
                    textAlign:
                      "center",
                  }}
                >
                  {page + 1} /{" "}
                  {totalPages}
                </Typography>

                {/* NEXT */}

                <Button
                  variant="contained"
                  endIcon={
                    <ArrowForwardIcon />
                  }
                  disabled={
                    !canGoNext
                  }
                  onClick={
                    handleNext
                  }
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform:
                      "none",
                  }}
                >
                  ถัดไป
                </Button>
              </Box>
            )}
        </Box>
      </Box>
    </>
  );
}