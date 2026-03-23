import type { Metadata } from "next";
import Script from "next/script";
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
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-9401062424277030"
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9401062424277030"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-8">{children}</main>
        <footer className="text-center text-xs text-gray-400 py-6 sm:py-8 border-t border-gray-100 px-3">
          <p>
            ※ 期の所属は資料により異なる場合があります。主な卒業生のみ掲載しています。
          </p>
        </footer>
      </body>
    </html>
  );
}
