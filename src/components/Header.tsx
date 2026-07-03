import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      {/* 幕風トップバー */}
      <div className="curtain-stripe text-white">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs font-bold">
          <span className="drop-shadow">🎤 NSC芸人データベース</span>
          <span className="hidden sm:inline drop-shadow">
            大阪48期＋東京31期＝全79期をぜんぶ網羅！
          </span>
        </div>
      </div>
      {/* メインヘッダー */}
      <div className="bg-warai-yellow border-b-4 border-warai-ink">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex-shrink-0 group">
              <h1 className="text-2xl md:text-3xl font-black text-warai-ink tracking-tight">
                <span className="inline-block group-hover:-rotate-6 transition-transform">
                  芸人
                </span>
                <span className="inline-block bg-yoshimoto-red text-white px-2 py-0.5 rounded-lg ml-1 border-2 border-warai-ink shadow-pop-sm group-hover:rotate-3 transition-transform">
                  ナビ
                </span>
              </h1>
            </Link>
            <div className="hidden md:block flex-1 max-w-md">
              <SearchBar compact />
            </div>
            <nav className="flex items-center gap-1.5 text-sm font-bold">
              <Link
                href="/osaka"
                className="px-3 py-1.5 bg-white text-warai-ink border-2 border-warai-ink rounded-full hover:bg-yoshimoto-red hover:text-white transition-colors shadow-pop-sm"
              >
                大阪校
              </Link>
              <Link
                href="/tokyo"
                className="px-3 py-1.5 bg-white text-warai-ink border-2 border-warai-ink rounded-full hover:bg-yoshimoto-red hover:text-white transition-colors shadow-pop-sm"
              >
                東京校
              </Link>
              <Link
                href="/timeline"
                className="hidden sm:inline-block px-3 py-1.5 bg-white text-warai-ink border-2 border-warai-ink rounded-full hover:bg-yoshimoto-red hover:text-white transition-colors shadow-pop-sm"
              >
                年表
              </Link>
              <Link
                href="/news"
                className="hidden sm:inline-block px-3 py-1.5 bg-white text-warai-ink border-2 border-warai-ink rounded-full hover:bg-yoshimoto-red hover:text-white transition-colors shadow-pop-sm"
              >
                ニュース
              </Link>
            </nav>
          </div>
        </div>
        {/* モバイル検索バー */}
        <div className="md:hidden px-4 pb-3">
          <SearchBar compact />
        </div>
      </div>
    </header>
  );
}
