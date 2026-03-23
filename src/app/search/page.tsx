"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import ClassCard from "@/components/ClassCard";
import { searchComedians } from "@/lib/search";
import { getAllData } from "@/lib/data";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const allData = getAllData();
  const results = searchComedians(query, allData);

  const osakaResults = results.filter((r) => r.school === "osaka");
  const tokyoResults = results.filter((r) => r.school === "tokyo");

  return (
    <div className="space-y-6">
      <SearchBar />

      <AnimatePresence mode="wait">
        {query && (
          <motion.p
            key="count"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-500"
          >
            「{query}」の検索結果: {results.length}件
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {results.length === 0 && query && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12 text-gray-400"
          >
            <p className="text-lg">該当する結果がありません</p>
            <p className="text-sm mt-2">
              芸人名、期番号、入学年で検索できます
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {osakaResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-lg font-bold text-gray-700 mb-3">
            大阪校 ({osakaResults.length}件)
          </h2>
          <div className="grid gap-3">
            {osakaResults.map((r, i) => (
              <motion.div
                key={`osaka-${r.cls.classNumber}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ClassCard
                  cls={r.cls}
                  highlightNames={r.matchedNames}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {tokyoResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="text-lg font-bold text-gray-700 mb-3">
            東京校 ({tokyoResults.length}件)
          </h2>
          <div className="grid gap-3">
            {tokyoResults.map((r, i) => (
              <motion.div
                key={`tokyo-${r.cls.classNumber}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ClassCard
                  cls={r.cls}
                  highlightNames={r.matchedNames}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12 text-gray-400">検索中...</div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
