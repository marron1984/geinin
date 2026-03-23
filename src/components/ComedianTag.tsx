import { Comedian } from "@/lib/types";

interface ComedianTagProps {
  comedian: Comedian;
  highlight?: boolean;
}

export default function ComedianTag({ comedian, highlight }: ComedianTagProps) {
  const className = `inline-block px-3 py-1 rounded-full text-sm border transition-colors ${
    highlight
      ? "bg-yoshimoto-red text-white border-yoshimoto-red"
      : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
  }`;

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
        <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-3 w-3 ml-1 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
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
