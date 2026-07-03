import { Comedian } from "@/lib/types";

interface ComedianTagProps {
  comedian: Comedian;
  highlight?: boolean;
}

export default function ComedianTag({ comedian, highlight }: ComedianTagProps) {
  const className = `inline-block px-3 py-1 rounded-full text-sm border ${
    highlight
      ? "bg-yoshimoto-red text-white border-warai-ink"
      : "bg-white text-warai-ink border-warai-ink hover:bg-warai-yellow-light"
  } transition-colors`;

  const content = (
    <>
      {comedian.name}
      {comedian.members && (
        <span className="text-xs opacity-70 ml-1">
          ({comedian.members.join("・")})
        </span>
      )}
    </>
  );

  if (comedian.profileUrl) {
    return (
      <a
        href={comedian.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        title={comedian.members ? comedian.members.join("・") : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      className={className}
      title={comedian.members ? comedian.members.join("・") : undefined}
    >
      {content}
    </span>
  );
}
