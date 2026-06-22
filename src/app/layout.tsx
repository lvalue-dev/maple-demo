import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "MapleInfo - 메이플스토리 캐릭터 정보",
  description: "메이플스토리 캐릭터 검색, 스탯, 장비, 유니온 정보를 한눈에 확인하세요.",
  keywords: ["메이플스토리", "maple", "캐릭터", "스탯", "장비", "유니온"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-maple-gradient antialiased">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
