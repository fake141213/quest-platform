"use client";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PROFILE_STORAGE_KEY = "quest-profile";

type Profile = {
  name: string;
  avatar?: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [name, setName] =
    useState("User");

  const [savedName, setSavedName] =
    useState("User");

  const [avatar, setAvatar] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    try {
      const stored =
        localStorage.getItem(
          PROFILE_STORAGE_KEY
        );

      if (!stored) {
        return;
      }

      const profile: Profile =
        JSON.parse(stored);

      if (
        profile &&
        typeof profile.name ===
          "string" &&
        profile.name.trim()
      ) {
        setName(profile.name);
        setSavedName(profile.name);
      }

      if (
        profile &&
        typeof profile.avatar ===
          "string"
      ) {
        setAvatar(profile.avatar);
      }
    } catch (error) {
      console.error(
        "Load profile error:",
        error
      );
    }
  };

  const getInitial = (
    value: string
  ) => {
    const text = value.trim();

    if (!text) {
      return "U";
    }

    return text
      .charAt(0)
      .toUpperCase();
  };

  const handleSave = () => {
    const cleanName =
      name.trim();

    if (!cleanName) {
      setMessage(
        "กรุณากรอกชื่อก่อนบันทึก"
      );
      return;
    }

    const profile: Profile = {
      name: cleanName,
      avatar: avatar || undefined,
    };

    localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(profile)
    );

    setName(cleanName);
    setSavedName(cleanName);

    /*
     * แจ้ง Navbar ให้โหลดชื่อใหม่ทันที
     */
    window.dispatchEvent(
      new Event("profile-updated")
    );

    setMessage(
      "บันทึกโปรไฟล์เรียบร้อยแล้ว"
    );
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 72px)",
        py: {
          xs: 4,
          md: 7,
        },
      }}
    >
      <Container
        maxWidth="md"
      >
        {/* BACK */}

        <Button
          startIcon={
            <ArrowBackIcon />
          }
          onClick={() =>
            router.back()
          }
          sx={{
            mb: 3,
            fontWeight: 700,
            textTransform:
              "none",
          }}
        >
          กลับ
        </Button>

        {/* TITLE */}

        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            mb: 1,

            fontSize: {
              xs: "2rem",
              md: "3rem",
            },

            background:
              "linear-gradient(90deg, #6D28D9, #2563EB)",

            backgroundClip:
              "text",

            WebkitBackgroundClip:
              "text",

            WebkitTextFillColor:
              "transparent",
          }}
        >
          Profile
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mb: 4,
          }}
        >
          จัดการข้อมูลโปรไฟล์ของคุณ
        </Typography>

        {/* PROFILE CARD */}

        <Card
          sx={{
            borderRadius: 5,

            background:
              "rgba(255,255,255,0.82)",

            backdropFilter:
              "blur(12px)",

            border:
              "1px solid rgba(124,58,237,0.15)",

            boxShadow:
              "0 15px 40px rgba(76,29,149,0.12)",
          }}
        >
          <CardContent
            sx={{
              p: {
                xs: 3,
                md: 5,
              },
            }}
          >
            {/* AVATAR */}

            <Box
              sx={{
                display: "flex",
                flexDirection:
                  "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Avatar
                src={
                  avatar || undefined
                }
                sx={{
                  width: 110,
                  height: 110,

                  mb: 2,

                  fontSize: 42,
                  fontWeight: 900,

                  background:
                    "linear-gradient(135deg, #7C3AED, #2563EB)",

                  boxShadow:
                    "0 10px 30px rgba(124,58,237,0.28)",
                }}
              >
                {getInitial(name)}
              </Avatar>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                }}
              >
                {name || "User"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Questly Member
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* NAME */}

            <Typography
              sx={{
                fontWeight: 800,
                mb: 1,
              }}
            >
              ชื่อผู้ใช้
            </Typography>

            <TextField
              fullWidth
              value={name}
              onChange={(event) => {
                setName(
                  event.target.value
                );

                setMessage("");
              }}
              placeholder="กรอกชื่อของคุณ"
              sx={{
                mb: 3,

                "& .MuiOutlinedInput-root":
                  {
                    borderRadius: 3,
                  },
              }}
            />

            {/* AVATAR URL */}

            <Typography
              sx={{
                fontWeight: 800,
                mb: 1,
              }}
            >
              รูปโปรไฟล์
            </Typography>

            <TextField
              fullWidth
              value={avatar}
              onChange={(event) => {
                setAvatar(
                  event.target.value
                );

                setMessage("");
              }}
              placeholder="URL รูปภาพ (ถ้ามี)"
              helperText="ถ้าไม่ใส่ ระบบจะแสดงตัวอักษรแรกของชื่อ"
              sx={{
                mb: 3,

                "& .MuiOutlinedInput-root":
                  {
                    borderRadius: 3,
                  },
              }}
            />

            {/* SAVE */}

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={
                <SaveIcon />
              }
              onClick={handleSave}
              sx={{
                py: 1.5,

                borderRadius: 3,

                fontWeight: 900,

                textTransform:
                  "none",

                background:
                  "linear-gradient(90deg, #7C3AED, #2563EB)",

                "&:hover": {
                  background:
                    "linear-gradient(90deg, #6D28D9, #1D4ED8)",
                },
              }}
            >
              บันทึกโปรไฟล์
            </Button>

            {/* MESSAGE */}

            {message && (
              <Typography
                sx={{
                  mt: 2,
                  textAlign: "center",
                  fontWeight: 700,
                  color:
                    message.includes(
                      "เรียบร้อย"
                    )
                      ? "#16A34A"
                      : "#DC2626",
                }}
              >
                {message}
              </Typography>
            )}

            {/* CURRENT NAME */}

            <Box
              sx={{
                mt: 4,
                p: 2,

                borderRadius: 3,

                background:
                  "#F5F3FF",

                border:
                  "1px solid #DDD6FE",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                ชื่อที่บันทึกไว้
              </Typography>

              <Typography
                sx={{
                  fontWeight: 900,
                  color: "#5B21B6",
                }}
              >
                {savedName}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}