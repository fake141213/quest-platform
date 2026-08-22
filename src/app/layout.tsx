import type { Metadata } from "next";
import "./globals.css";
import Providers from "../providers";

export const metadata: Metadata = {
  title: "Questly",
  description:
    "Questly - Complete Quests and Earn Rewards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}