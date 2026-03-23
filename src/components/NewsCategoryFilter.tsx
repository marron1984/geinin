"use client";

import { motion } from "framer-motion";

const categories = [
  { key: "all", label: "すべて" },
  { key: "tv", label: "テレビ" },
  { key: "live", label: "ライブ" },
  { key: "award", label: "受賞" },
  { key: "debut", label: "デビュー" },
  { key: "other", label: "その他" },
] as const;

interface NewsCategoryFilterProps {
  active: string;
  onSelect: (category: string) => void;
}

export default function NewsCategoryFilter({
  active,
  onSelect,
}: NewsCategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {categories.map((cat) => (
        <motion.button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          whileTap={{ scale: 0.9 }}
          className={`relative flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === cat.key
              ? "text-white"
              : "text-gray-600 bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {active === cat.key && (
            <motion.div
              layoutId="activeCategoryBg"
              className="absolute inset-0 bg-yoshimoto-red rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
