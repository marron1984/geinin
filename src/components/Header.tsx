import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* トップバー */}
      <div className="bg-yoshimoto-red text-white">
        <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between text-xs">
          <span>NSC芸人データベース</span>
          <span className="hidden sm:inline">大阪校48期 + 東京校31期 = 全79期を網羅</span>
        </div>
      </div>
      {/* メインヘッダー */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              芸人<span className="text-yoshimoto-red">ナビ</span>
            </h1>
          </Link>
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar compact />
          </div>
          <nav className="flex items-center gap-1">
            <Link
              href="/osaka"
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-yoshimoto-red hover:bg-red-50 rounded-md transition-colors"
            >
              大阪校
            </Link>
            <Link
              href="/tokyo"
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-yoshimoto-red hover:bg-red-50 rounded-md transition-colors"
            >
              東京校
            </Link>
            <Link
              href="/timeline"
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-yoshimoto-red hover:bg-red-50 rounded-md transition-colors"
            >
              年表
            </Link>
          </nav>
        </div>
      </div>
      {/* モバイル検索バー */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar compact />
      </div>
    </header>
  );
}
