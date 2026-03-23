import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-yoshimoto-red text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-90">
          NSC期別リスト
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/osaka" className="hover:underline underline-offset-4">
            大阪校
          </Link>
          <Link href="/tokyo" className="hover:underline underline-offset-4">
            東京校
          </Link>
        </nav>
      </div>
    </header>
  );
}
