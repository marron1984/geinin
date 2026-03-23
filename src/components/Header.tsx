"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="bg-yoshimoto-red text-white shadow-lg"
    >
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div whileTap={{ scale: 0.95 }}>
          <Link href="/" className="text-xl font-bold tracking-tight">
            NSC期別リスト
          </Link>
        </motion.div>
        <nav className="flex gap-1 text-sm">
          <motion.div
            whileTap={{ scale: 0.9, backgroundColor: "rgba(255,255,255,0.15)" }}
            className="rounded-lg"
          >
            <Link href="/osaka" className="block px-3 py-2 rounded-lg active:bg-white/10">
              大阪校
            </Link>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.9, backgroundColor: "rgba(255,255,255,0.15)" }}
            className="rounded-lg"
          >
            <Link href="/tokyo" className="block px-3 py-2 rounded-lg active:bg-white/10">
              東京校
            </Link>
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
}
