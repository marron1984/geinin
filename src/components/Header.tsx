"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-yoshimoto-red text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-90">
          芸人データベース
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden sm:flex gap-4 text-sm">
            <Link href="/nsc" className="hover:underline underline-offset-4">
              NSC期別リスト
            </Link>
          </nav>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-white/10"
            aria-label="メニュー"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="sm:hidden border-t border-white/20 px-4 py-2 space-y-1">
          <Link
            href="/nsc"
            className="block py-2 hover:bg-white/10 rounded px-2"
            onClick={() => setMenuOpen(false)}
          >
            NSC期別リスト
          </Link>
          <Link
            href="/nsc/osaka"
            className="block py-2 hover:bg-white/10 rounded px-2 pl-6 text-sm opacity-90"
            onClick={() => setMenuOpen(false)}
          >
            大阪校
          </Link>
          <Link
            href="/nsc/tokyo"
            className="block py-2 hover:bg-white/10 rounded px-2 pl-6 text-sm opacity-90"
            onClick={() => setMenuOpen(false)}
          >
            東京校
          </Link>
        </nav>
      )}
    </header>
  );
}
