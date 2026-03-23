"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface SchoolTabsProps {
  active: "osaka" | "tokyo";
}

export default function SchoolTabs({ active }: SchoolTabsProps) {
  return (
    <div className="flex border-b border-gray-200 mb-6 relative">
      <motion.div whileTap={{ scale: 0.93 }} className="relative">
        <Link
          href="/osaka"
          className={`block px-4 sm:px-6 py-3 text-sm font-medium transition-colors ${
            active === "osaka"
              ? "text-yoshimoto-red"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          大阪校
        </Link>
        {active === "osaka" && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-yoshimoto-red"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
      <motion.div whileTap={{ scale: 0.93 }} className="relative">
        <Link
          href="/tokyo"
          className={`block px-4 sm:px-6 py-3 text-sm font-medium transition-colors ${
            active === "tokyo"
              ? "text-yoshimoto-red"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          東京校
        </Link>
        {active === "tokyo" && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-yoshimoto-red"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
    </div>
  );
}
