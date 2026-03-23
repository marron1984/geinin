import Link from "next/link";

interface SchoolTabsProps {
  active: "osaka" | "tokyo";
}

export default function SchoolTabs({ active }: SchoolTabsProps) {
  return (
    <div className="flex gap-2">
      <Link
        href="/osaka"
        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
          active === "osaka"
            ? "bg-yoshimoto-red text-white"
            : "bg-white text-gray-600 border border-gray-200 hover:border-yoshimoto-red hover:text-yoshimoto-red"
        }`}
      >
        大阪校
      </Link>
      <Link
        href="/tokyo"
        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
          active === "tokyo"
            ? "bg-gray-800 text-white"
            : "bg-white text-gray-600 border border-gray-200 hover:border-gray-800 hover:text-gray-800"
        }`}
      >
        東京校
      </Link>
    </div>
  );
}
