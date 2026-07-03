import Link from "next/link";

interface SchoolTabsProps {
  active: "osaka" | "tokyo";
}

export default function SchoolTabs({ active }: SchoolTabsProps) {
  return (
    <div className="flex gap-2">
      <Link
        href="/osaka"
        className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${
          active === "osaka"
            ? "bg-yoshimoto-red text-white border-2 border-warai-ink shadow-pop-sm"
            : "bg-white text-warai-ink border-2 border-warai-ink hover:bg-warai-yellow-light shadow-pop-sm"
        }`}
      >
        大阪校
      </Link>
      <Link
        href="/tokyo"
        className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${
          active === "tokyo"
            ? "bg-warai-ink text-warai-yellow border-2 border-warai-ink shadow-pop-sm"
            : "bg-white text-warai-ink border-2 border-warai-ink hover:bg-warai-yellow-light shadow-pop-sm"
        }`}
      >
        東京校
      </Link>
    </div>
  );
}
