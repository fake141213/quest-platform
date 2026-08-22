"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TransactionType = "earned" | "spent";

type CoinTransaction = {
  id: string;
  type: TransactionType;
  amount: number;
  title: string;
  date: string;
};

const COIN_STORAGE_KEY = "quest-coins";

const TRANSACTION_STORAGE_KEY =
  "quest-coin-transactions";

const DEFAULT_COINS = 0;

export default function WalletPage() {
  const router = useRouter();

  const [coins, setCoins] =
    useState<number>(DEFAULT_COINS);

  const [transactions, setTransactions] =
    useState<CoinTransaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadWallet();

    const handleWalletUpdate = () => {
      loadWallet();
    };

    window.addEventListener(
      "wallet-updated",
      handleWalletUpdate
    );

    window.addEventListener(
      "storage",
      handleWalletUpdate
    );

    return () => {
      window.removeEventListener(
        "wallet-updated",
        handleWalletUpdate
      );

      window.removeEventListener(
        "storage",
        handleWalletUpdate
      );
    };
  }, []);

  const loadWallet = () => {
    try {
      const savedCoins =
        localStorage.getItem(
          COIN_STORAGE_KEY
        );

      const savedTransactions =
        localStorage.getItem(
          TRANSACTION_STORAGE_KEY
        );

      if (savedCoins !== null) {
        const parsedCoins =
          Number(savedCoins);

        if (
          Number.isFinite(parsedCoins) &&
          parsedCoins >= 0
        ) {
          setCoins(parsedCoins);
        } else {
          setCoins(DEFAULT_COINS);
        }
      } else {
        localStorage.setItem(
          COIN_STORAGE_KEY,
          String(DEFAULT_COINS)
        );

        setCoins(DEFAULT_COINS);
      }

      if (savedTransactions) {
        const parsedTransactions =
          JSON.parse(savedTransactions);

        if (
          Array.isArray(
            parsedTransactions
          )
        ) {
          setTransactions(
            parsedTransactions
          );
        } else {
          setTransactions([]);
        }
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error(
        "Failed to load wallet:",
        error
      );

      setCoins(DEFAULT_COINS);
      setTransactions([]);
    }

    setLoading(false);
  };

  const formatDate = (
    date: string
  ) => {
    try {
      return new Date(
        date
      ).toLocaleString("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return date;
    }
  };

  const totalEarned =
    transactions
      .filter(
        (item) =>
          item.type === "earned"
      )
      .reduce(
        (total, item) =>
          total + item.amount,
        0
      );

  const totalSpent =
    transactions
      .filter(
        (item) =>
          item.type === "spent"
      )
      .reduce(
        (total, item) =>
          total + item.amount,
        0
      );

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        maxWidth: 1100,
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
      }}
    >
      {/* BACK BUTTON */}

      <Button
        variant="outlined"
        startIcon={
          <ArrowBackIcon />
        }
        onClick={() =>
          router.back()
        }
        sx={{
          mb: 4,
          borderRadius: 2,
          fontWeight: 700,
          textTransform: "none",
        }}
      >
        ย้อนกลับ
      </Button>

      {/* HEADER */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            mb: 1,
            fontSize: {
              xs: "2rem",
              sm: "2.5rem",
              md: "3rem",
            },
          }}
        >
          My Wallet
        </Typography>

        <Typography
          color="text.secondary"
        >
          กระเป๋าเหรียญ QC ของคุณ
        </Typography>
      </Box>

      {/* BALANCE */}

      <Card
        sx={{
          borderRadius: 4,
          mb: 4,
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 3,
              sm: 4,
              md: 5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                backgroundColor:
                  "action.hover",
                fontSize: 30,
              }}
            >
              🪙
            </Box>

            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.2rem",
              }}
            >
              ยอดคงเหลือ
            </Typography>
          </Box>

          <Typography
            sx={{
              fontWeight: 900,
              fontSize: {
                xs: "3rem",
                sm: "4rem",
              },
              lineHeight: 1,
              mb: 1,
            }}
          >
            🪙 {coins.toLocaleString()} QC
          </Typography>

          <Typography
            color="text.secondary"
          >
            เหรียญที่สามารถนำไปใช้ได้
          </Typography>
        </CardContent>
      </Card>

      {/* SUMMARY */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
          gap: 2,
          mb: 5,
        }}
      >
        <Card
          sx={{
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              🟢 ได้รับทั้งหมด
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
              }}
            >
              +{totalEarned.toLocaleString()} QC
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              🔴 ใช้ไปทั้งหมด
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
              }}
            >
              -{totalSpent.toLocaleString()} QC
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* TRANSACTIONS */}

      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 2,
          }}
        >
          ประวัติรายการ
        </Typography>

        <Card
          sx={{
            borderRadius: 4,
          }}
        >
          {loading ? (
            <CardContent
              sx={{
                py: 6,
                textAlign: "center",
              }}
            >
              <Typography
                color="text.secondary"
              >
                กำลังโหลด...
              </Typography>
            </CardContent>
          ) : transactions.length ===
            0 ? (
            <CardContent
              sx={{
                py: 8,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                ยังไม่มีรายการ
              </Typography>

              <Typography
                color="text.secondary"
              >
                เมื่อคุณทำ Quest
                สำเร็จและได้รับเหรียญ
                รายการจะแสดงที่นี่
              </Typography>
            </CardContent>
          ) : (
            <Box>
              {transactions.map(
                (transaction, index) => {
                  const isEarned =
                    transaction.type ===
                    "earned";

                  return (
                    <Box
                      key={
                        transaction.id
                      }
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "space-between",
                          gap: 2,
                          p: {
                            xs: 2,
                            sm: 3,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: 2,
                            minWidth: 0,
                          }}
                        >
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              flexShrink: 0,
                              borderRadius: 2,
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              backgroundColor:
                                "action.hover",
                              fontSize: 22,
                            }}
                          >
                            {isEarned
                              ? "🟢"
                              : "🔴"}
                          </Box>

                          <Box
                            sx={{
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 700,
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {
                                transaction.title
                              }
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {formatDate(
                                transaction.date
                              )}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          sx={{
                            fontWeight: 900,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {isEarned
                            ? "+"
                            : "-"}
                          {
                            transaction.amount
                          }{" "}
                          QC
                        </Typography>
                      </Box>

                      {index <
                        transactions.length -
                          1 && (
                        <Divider />
                      )}
                    </Box>
                  );
                }
              )}
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  );
}