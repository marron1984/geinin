"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/osaka", label: "大阪校" },
  { href: "/tokyo", label: "東京校" },
  { href: "/news", label: "ニュース" },
  { href: "/mypage", label: "マイページ" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="bg-yoshimoto-red text-white shadow-lg relative z-50"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div whileTap={{ scale: 0.95 }}>
          <Link href="/" className="text-lg font-bold tracking-tight">
            NSC期別リスト
          </Link>
        </motion.div>

        {/* PC: インラインナビ */}
        <nav className="hidden md:flex gap-1 text-sm">
          {navLinks.map((link) => (
            <motion.div
              key={link.href}
              whileTap={{ scale: 0.9 }}
              className="rounded-lg"
            >
              <Link
                href={link.href}
                className="block px-3 py-2 rounded-lg active:bg-white/10 hover:bg-white/10"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* モバイル: ハンバーガー */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 -mr-2 rounded-lg active:bg-white/10"
          aria-label="メニュー"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </motion.button>
      </div>

      {/* モバイルメニュー */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-white/20"
          >
            <div className="px-4 py-2 space-y-1">
              {navLinks.map((link) => (
                <motion.div key={link.href} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-3 rounded-lg active:bg-white/10 text-sm"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
