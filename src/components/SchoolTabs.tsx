import Link from "next/link";

interface SchoolTabsProps {
  active: "osaka" | "tokyo";
}

export default function SchoolTabs({ active }: SchoolTabsProps) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
      <Link
        href="/nsc/osaka"
        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
          active === "osaka"
            ? "border-yoshimoto-red text-yoshimoto-red"
            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
      >
        大阪校
      </Link>
      <Link
        href="/nsc/tokyo"
        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
          active === "tokyo"
            ? "border-yoshimoto-red text-yoshimoto-red"
            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
      >
        東京校
      </Link>
    </div>
  );
}
