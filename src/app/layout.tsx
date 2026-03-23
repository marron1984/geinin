import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "NSC期別リスト - 吉本総合芸能学院 卒業生一覧",
  description:
    "NSC（吉本総合芸能学院）大阪校・東京校の期別卒業生リスト。ダウンタウンの1期から最新期まで検索・閲覧できます。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="text-center text-xs text-gray-400 py-8 border-t border-gray-100">
          <p>
            ※ 期の所属は資料により異なる場合があります。主な卒業生のみ掲載しています。
          </p>
        </footer>
      </body>
    </html>
  );
}
