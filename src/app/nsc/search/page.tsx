"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
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

      {query && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          「{query}」の検索結果: {results.length}件
        </p>
      )}

      {results.length === 0 && query && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-lg">該当する結果がありません</p>
          <p className="text-sm mt-2">
            芸人名、期番号、入学年で検索できます
          </p>
        </div>
      )}

      {osakaResults.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">
            大阪校 ({osakaResults.length}件)
          </h2>
          <div className="grid gap-3">
            {osakaResults.map((r) => (
              <ClassCard
                key={`osaka-${r.cls.classNumber}`}
                cls={r.cls}
                highlightNames={r.matchedNames}
              />
            ))}
          </div>
        </div>
      )}

      {tokyoResults.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-3">
            東京校 ({tokyoResults.length}件)
          </h2>
          <div className="grid gap-3">
            {tokyoResults.map((r) => (
              <ClassCard
                key={`tokyo-${r.cls.classNumber}`}
                cls={r.cls}
                highlightNames={r.matchedNames}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">検索中...</div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
