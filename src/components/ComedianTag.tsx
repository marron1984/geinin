import { Comedian } from "@/lib/types";

interface ComedianTagProps {
  comedian: Comedian;
  highlight?: boolean;
}

export default function ComedianTag({ comedian, highlight }: ComedianTagProps) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm border ${
        highlight
          ? "bg-yoshimoto-red text-white border-yoshimoto-red"
          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
      } transition-colors`}
      title={comedian.members ? comedian.members.join("・") : undefined}
    >
      {comedian.name}
      {comedian.members && (
        <span className="text-xs opacity-70 ml-1">
          ({comedian.members.join("・")})
        </span>
      )}
    </span>
  );
}
