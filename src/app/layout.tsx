import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "芸人データベース - 若手芸人ニュース＆お笑い情報サイト",
  description:
    "若手芸人の最新ニュースとお笑い芸人データベース。NSC期別卒業生リストや芸人に関するコメント機能も充実。",
  other: {
    "google-adsense-account": "ca-pub-9401062424277030",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9401062424277030"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <ScrollToTop />
        <footer className="text-center text-xs text-gray-400 dark:text-gray-600 py-8 border-t border-gray-100 dark:border-gray-800">
          <p>
            ※ 期の所属は資料により異なる場合があります。主な卒業生のみ掲載しています。
          </p>
        </footer>
      </body>
    </html>
  );
}
