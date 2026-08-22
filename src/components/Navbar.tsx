"use client";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCoins } from "@/lib/questStorage";

const PROFILE_STORAGE_KEY = "quest-profile";

type Profile = {
  name: string;
  avatar?: string;
};

export default function Navbar() {
  const router = useRouter();

  const [profile, setProfile] =
    useState<Profile>({
      name: "User",
    });

  const [coins, setCoins] =
    useState(0);

  /*
   * โหลด Profile
   */
  const loadProfile = () => {
    try {
      const stored =
        localStorage.getItem(
          PROFILE_STORAGE_KEY
        );

      if (!stored) {
        return;
      }

      const parsed =
        JSON.parse(stored);

      if (
        parsed &&
        typeof parsed.name ===
          "string" &&
        parsed.name.trim()
      ) {
        setProfile({
          name: parsed.name,
          avatar:
            typeof parsed.avatar ===
            "string"
              ? parsed.avatar
              : undefined,
        });
      }
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error
      );
    }
  };

  /*
   * โหลดจำนวน QC จริง
   * จาก questStorage.ts
   */
  const loadCoins = () => {
    try {
      const currentCoins =
        getCoins();

      setCoins(currentCoins);
    } catch (error) {
      console.error(
        "Failed to load coins:",
        error
      );

      setCoins(0);
    }
  };

  useEffect(() => {
    /*
     * โหลดครั้งแรก
     */
    loadProfile();
    loadCoins();

    /*
     * Profile เปลี่ยน
     */
    const handleProfileUpdate =
      () => {
        loadProfile();
      };

    /*
     * QC เปลี่ยน
     */
    const handleWalletUpdate =
      () => {
        loadCoins();
      };

    window.addEventListener(
      "profile-updated",
      handleProfileUpdate
    );

    window.addEventListener(
      "wallet-updated",
      handleWalletUpdate
    );

    return () => {
      window.removeEventListener(
        "profile-updated",
        handleProfileUpdate
      );

      window.removeEventListener(
        "wallet-updated",
        handleWalletUpdate
      );
    };
  }, []);

  /*
   * ตัวอักษร Avatar
   */
  const getInitial = () => {
    const name =
      profile.name.trim();

    if (!name) {
      return "U";
    }

    return name
      .charAt(0)
      .toUpperCase();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backgroundColor:
          "rgba(255,255,255,0.88)",

        backdropFilter:
          "blur(12px)",

        borderBottom:
          "1px solid rgba(124,58,237,0.12)",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 72,

            display: "flex",

            justifyContent:
              "space-between",

            gap: 2,
          }}
        >
          {/* =========================
              LOGO
          ========================== */}

          <Box
            onClick={() =>
              router.push("/")
            }
            sx={{
              display: "flex",
              alignItems: "center",

              cursor: "pointer",

              flexShrink: 0,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,

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
              Questly
            </Typography>
          </Box>

          {/* =========================
              MENU
          ========================== */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },

              alignItems: "center",

              gap: 1,
            }}
          >
            <Button
              onClick={() =>
                router.push("/")
              }
              sx={{
                fontWeight: 700,

                textTransform:
                  "none",
              }}
            >
              Home
            </Button>

            <Button
              onClick={() =>
                router.push(
                  "/quests"
                )
              }
              sx={{
                fontWeight: 700,

                textTransform:
                  "none",
              }}
            >
              Quests
            </Button>

            <Button
              onClick={() =>
                router.push(
                  "/my-quests"
                )
              }
              sx={{
                fontWeight: 700,

                textTransform:
                  "none",
              }}
            >
              My Quests
            </Button>

            <Button
              onClick={() =>
                router.push(
                  "/wallet"
                )
              }
              sx={{
                fontWeight: 700,

                textTransform:
                  "none",
              }}
            >
              🪙 Wallet
            </Button>
          </Box>

          {/* =========================
              RIGHT SIDE
          ========================== */}

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 1,
            }}
          >
            {/* =========================
                QC จริง
            ========================== */}

            <Button
              onClick={() =>
                router.push(
                  "/wallet"
                )
              }
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                },

                fontWeight: 800,

                textTransform:
                  "none",

                minWidth: "auto",

                color:
                  "text.primary",
              }}
            >
              🪙 {coins} QC
            </Button>

            {/* =========================
                PROFILE
            ========================== */}

            <Avatar
              onClick={() =>
                router.push(
                  "/profile"
                )
              }
              src={
                profile.avatar ||
                undefined
              }
              alt={profile.name}
              sx={{
                width: 40,
                height: 40,

                cursor: "pointer",

                fontWeight: 900,

                background:
                  "linear-gradient(135deg, #7C3AED, #2563EB)",

                boxShadow:
                  "0 4px 12px rgba(124,58,237,0.25)",

                transition:
                  "all 0.2s ease",

                "&:hover": {
                  transform:
                    "scale(1.08)",

                  boxShadow:
                    "0 6px 18px rgba(37,99,235,0.3)",
                },
              }}
            >
              {getInitial()}
            </Avatar>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}