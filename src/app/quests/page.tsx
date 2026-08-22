"use client";

import {
  Box,
  Button,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import Navbar from "@/components/Navbar";
import QuestCard from "@/components/QuestCard";
import { useQuests } from "@/hooks/useQuests";

export default function QuestsPage() {
  const router = useRouter();

  // =========================
  // LOAD QUESTS
  // =========================

  const {
    quests,
    loading,
  } = useQuests();

  // =========================
  // SEARCH
  // =========================

  const [
    searchText,
    setSearchText,
  ] = useState("");

  // =========================
  // CATEGORY
  // =========================

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  // =========================
  // CATEGORIES
  // =========================

  const categories = useMemo(() => {
    const uniqueCategories =
      Array.from(
        new Set(
          quests.map(
            (quest) =>
              quest.category
          )
        )
      );

    return [
      "All",
      ...uniqueCategories,
    ];
  }, [quests]);

  // =========================
  // FILTER + SEARCH
  // =========================

  const filteredQuests =
    useMemo(() => {
      const keyword =
        searchText
          .trim()
          .toLowerCase();

      return quests.filter(
        (quest) => {
          const categoryMatch =
            selectedCategory ===
              "All" ||
            quest.category ===
              selectedCategory;

          const searchMatch =
            keyword === "" ||
            quest.title
              .toLowerCase()
              .includes(keyword) ||
            quest.description
              .toLowerCase()
              .includes(keyword) ||
            quest.category
              .toLowerCase()
              .includes(keyword);

          return (
            categoryMatch &&
            searchMatch
          );
        }
      );
    }, [
      quests,
      selectedCategory,
      searchText,
    ]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
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
            py: 8,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            กำลังโหลด Quest...
          </Typography>
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
          maxWidth: 1400,
          mx: "auto",

          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          py: {
            xs: 4,
            md: 6,
          },

          boxSizing: "border-box",
        }}
      >
        {/* =========================
            TOP BUTTONS
        ========================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 2,
            mb: 4,
            flexWrap: "wrap",
          }}
        >
          {/* BACK */}

          <Button
            variant="outlined"
            color="inherit"
            startIcon={
              <ArrowBackIcon />
            }
            onClick={() =>
              router.push("/")
            }
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1,
              fontWeight: 700,
              textTransform:
                "none",
            }}
          >
            กลับหน้าแรก
          </Button>

          {/* CREATE */}

          <Button
            variant="contained"
            startIcon={
              <AddIcon />
            }
            onClick={() =>
              router.push(
                "/create-quest"
              )
            }
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1,
              fontWeight: 700,
              textTransform:
                "none",
            }}
          >
            สร้าง Quest
          </Button>
        </Box>

        {/* =========================
            HEADER
        ========================== */}

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,

              fontSize: {
                xs: "2rem",
                sm: "2.5rem",
                md: "3rem",
              },

              mb: 1,
            }}
          >
            Explore Quests
          </Typography>

          <Typography
            color="text.secondary"
          >
            ค้นหา Quest ที่สนใจ
            และเลือก Quest
            ที่คุณต้องการทำ
          </Typography>
        </Box>

        {/* =========================
            SEARCH
        ========================== */}

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
            placeholder="ค้นหา Quest..."
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root":
                {
                  borderRadius: 3,
                  backgroundColor:
                    "background.paper",
                },
            }}
          />
        </Box>

        {/* =========================
            CATEGORIES
        ========================== */}

        <Box sx={{ mb: 5 }}>
          <Typography
            sx={{
              fontWeight: 800,
              mb: 2,
            }}
          >
            Categories
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {categories.map(
              (category) => {
                const selected =
                  selectedCategory ===
                  category;

                return (
                  <Chip
                    key={category}
                    label={category}
                    clickable
                    color={
                      selected
                        ? "primary"
                        : "default"
                    }
                    variant={
                      selected
                        ? "filled"
                        : "outlined"
                    }
                    onClick={() =>
                      setSelectedCategory(
                        category
                      )
                    }
                    sx={{
                      fontWeight: 700,
                      borderRadius: 2,
                      px: 1,
                    }}
                  />
                );
              }
            )}
          </Box>
        </Box>

        {/* =========================
            RESULT HEADER
        ========================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            mb: 3,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
            }}
          >
            {selectedCategory ===
            "All"
              ? "All Quests"
              : selectedCategory}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              fontWeight: 600,
            }}
          >
            พบ{" "}
            {
              filteredQuests.length
            }{" "}
            Quest
          </Typography>
        </Box>

        {/* =========================
            QUEST GRID
        ========================== */}

        {filteredQuests.length >
        0 ? (
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },

              gap: {
                xs: 2,
                sm: 3,
                md: 4,
              },

              width: "100%",
            }}
          >
            {filteredQuests.map(
              (quest) => (
                <Box
                  key={quest.id}
                  sx={{
                    minWidth: 0,
                    width: "100%",
                  }}
                >
                  <QuestCard
                    quest={quest}
                  />
                </Box>
              )
            )}
          </Box>
        ) : (
          /* =========================
             NO RESULT
          ========================== */

          <Box
            sx={{
              textAlign: "center",
              py: 10,
            }}
          >
            <SearchIcon
              sx={{
                fontSize: 50,
                mb: 2,
                color:
                  "text.secondary",
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              ไม่พบ Quest
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mb: 3,
              }}
            >
              ไม่พบ Quest ที่ตรงกับ
              "{searchText}"
            </Typography>

            <Button
              variant="contained"
              onClick={() => {
                setSearchText("");
                setSelectedCategory(
                  "All"
                );
              }}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                textTransform:
                  "none",
              }}
            >
              ล้างการค้นหา
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}