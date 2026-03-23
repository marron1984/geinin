"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { motion } from "framer-motion";

function SearchBarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);

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
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.div
          className="absolute -inset-1 rounded-xl bg-yoshimoto-red/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(query);
          }}
          placeholder="芸人名・期番号・年で検索..."
          className="relative w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:border-yoshimoto-red focus:ring-2 focus:ring-yoshimoto-red/20 outline-none text-gray-800 bg-white shadow-sm"
        />
        <motion.button
          onClick={() => handleSearch(query)}
          whileTap={{ scale: 0.8, rotate: -15 }}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-3 text-gray-400 hover:text-yoshimoto-red z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={<div className="w-full max-w-xl mx-auto h-12" />}>
      <SearchBarInner />
    </Suspense>
  );
}
