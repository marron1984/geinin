"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";

function SearchBarInner({ compact }: { compact?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = useCallback(
    (value: string) => {
      if (value.trim()) {
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }
    },
    [router]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  return (
    <div className={compact ? "w-full" : "w-full max-w-xl mx-auto"}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(query);
          }}
          placeholder="芸人名・期番号・年で検索..."
          className={`w-full pr-10 rounded-lg border border-gray-300 focus:border-yoshimoto-red focus:ring-2 focus:ring-yoshimoto-red/20 outline-none text-gray-800 bg-white ${
            compact ? "px-3 py-2 text-sm" : "px-4 py-3 shadow-sm"
          }`}
        />
        <button
          onClick={() => handleSearch(query)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-yoshimoto-red"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={compact ? "h-4 w-4" : "h-5 w-5"}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function SearchBar({ compact }: { compact?: boolean }) {
  return (
    <Suspense fallback={<div className={compact ? "w-full h-9" : "w-full max-w-xl mx-auto h-12"} />}>
      <SearchBarInner compact={compact} />
    </Suspense>
  );
}
