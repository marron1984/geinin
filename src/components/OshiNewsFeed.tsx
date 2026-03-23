"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useOshi } from "@/lib/useOshi";
import { NewsArticle } from "@/lib/types";
import NewsCard from "./NewsCard";

interface OshiNewsFeedProps {
  articles: NewsArticle[];
  limit?: number;
  showOshiSection?: boolean;
}

export default function OshiNewsFeed({ articles, limit = 6, showOshiSection = true }: OshiNewsFeedProps) {
  const { oshiList, loaded } = useOshi();

  const oshiNames = useMemo(() => new Set(oshiList.map((o) => o.name)), [oshiList]);

  const oshiNews = useMemo(() => {
    if (oshiNames.size === 0) return [];
    return articles.filter((a) =>
      a.comedians.some((c) => oshiNames.has(c))
    );
  }, [articles, oshiNames]);

  const otherNews = useMemo(() => {
    if (oshiNames.size === 0) return articles.slice(0, limit);
    const oshiIds = new Set(oshiNews.map((a) => a.id));
    return articles.filter((a) => !oshiIds.has(a.id)).slice(0, limit);
  }, [articles, oshiNames, oshiNews, limit]);

  if (!loaded) {
    return <div className="space-y-3">{articles.slice(0, 3).map((a, i) => <NewsCard key={a.id} article={a} index={i} />)}</div>;
  }

  return (
    <div className="space-y-5">
      {/* 推しニュース */}
      {showOshiSection && oshiNews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-yoshimoto-red">❤️ 推しのニュース</span>
            <span className="text-xs text-gray-400">({oshiNews.length}件)</span>
          </div>
          {oshiNews.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative"
            >
              <div className="absolute -left-1 top-3 bottom-3 w-0.5 bg-yoshimoto-red rounded-full" />
              <NewsCard article={article} index={i} />
            </motion.div>
          ))}
        </div>
      )}

      {/* その他のニュース */}
      <div className="space-y-3">
        {oshiNews.length > 0 && otherNews.length > 0 && (
          <p className="text-sm font-bold text-gray-700">その他のニュース</p>
        )}
        {otherNews.map((article, i) => (
          <NewsCard key={article.id} article={article} index={i} />
        ))}
      </div>

      {/* 推し未設定の案内 */}
      {oshiList.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-pink-50 border border-pink-100 rounded-lg p-3 text-center"
        >
          <p className="text-xs text-gray-600">
            <Link href="/mypage" className="text-yoshimoto-red font-medium hover:underline">
              マイページで推し芸人を登録
            </Link>
            すると、関連ニュースが優先表示されます
          </p>
        </motion.div>
      )}
    </div>
  );
}
