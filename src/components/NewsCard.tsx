"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { NewsArticle } from "@/lib/types";

const categoryLabels: Record<NewsArticle["category"], string> = {
  theater: "劇場",
  live: "ライブ",
  tv: "テレビ",
  award: "受賞",
  debut: "デビュー",
  other: "その他",
};

const categoryColors: Record<NewsArticle["category"], string> = {
  theater: "bg-orange-100 text-orange-700",
  live: "bg-purple-100 text-purple-700",
  tv: "bg-blue-100 text-blue-700",
  award: "bg-yellow-100 text-yellow-700",
  debut: "bg-green-100 text-green-700",
  other: "bg-gray-100 text-gray-600",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

interface NewsCardProps {
  article: NewsArticle;
  index?: number;
}

export default function NewsCard({ article, index = 0 }: NewsCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <Link href={`/news/${article.id}`} className="block p-3 sm:p-4">
        <div className="flex items-start gap-3">
          {article.imageEmoji && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: index * 0.06 + 0.2,
                type: "spring",
                stiffness: 260,
                damping: 15,
              }}
              className="text-2xl sm:text-3xl flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-50 rounded-lg"
            >
              {article.imageEmoji}
            </motion.div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${categoryColors[article.category]}`}
              >
                {categoryLabels[article.category]}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(article.date)}
              </span>
              {article.school && (
                <span className="text-xs text-gray-400">
                  {article.school === "osaka" ? "大阪" : "東京"}{article.classNumber && `${article.classNumber}期`}
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-gray-800 mb-0.5 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-2 hidden sm:block">
              {article.summary}
            </p>
            {(article.venue || article.eventDate) && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs text-gray-500">
                {article.venue && (
                  <span className="flex items-center gap-0.5 truncate max-w-full">
                    <span className="text-orange-400 flex-shrink-0">📍</span>
                    <span className="truncate">{article.venue}</span>
                  </span>
                )}
                {article.eventDate && (
                  <span className="flex items-center gap-0.5 flex-shrink-0">
                    <span className="text-orange-400">📅</span>
                    {formatDate(article.eventDate)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
