import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "芸人ナビ - NSC期別芸人データベース",
  description:
    "NSC（吉本総合芸能学院）大阪校・東京校の期別卒業生データベース。ダウンタウンの1期から最新期まで、お笑い芸人の情報を網羅。",
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
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 lg:flex lg:gap-8">
          <main className="flex-1 min-w-0">{children}</main>
          <Sidebar />
        </div>
        <footer className="bg-gray-900 text-gray-400 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8 text-sm">
              <div>
                <h4 className="text-white font-bold mb-3">芸人ナビについて</h4>
                <p className="leading-relaxed">
                  NSC（吉本総合芸能学院）の卒業生データベース。大阪校・東京校の全期の芸人情報を網羅しています。
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3">カテゴリ</h4>
                <ul className="space-y-2">
                  <li><a href="/osaka" className="hover:text-white transition-colors">NSC大阪校</a></li>
                  <li><a href="/tokyo" className="hover:text-white transition-colors">NSC東京校</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3">ご注意</h4>
                <p className="leading-relaxed">
                  期の所属は資料により異なる場合があります。主な卒業生のみ掲載しています。
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs">
              <p>&copy; 2025 芸人ナビ All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
