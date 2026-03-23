import Link from "next/link";
import { NscClass } from "@/lib/types";
import ComedianTag from "./ComedianTag";

interface ClassCardProps {
  cls: NscClass;
  highlightNames?: string[];
}

export default function ClassCard({ cls, highlightNames = [] }: ClassCardProps) {
  const schoolPath = cls.school === "osaka" ? "osaka" : "tokyo";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
      <Link href={`/${schoolPath}/${cls.classNumber}`}>
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-2xl font-bold text-yoshimoto-red">
            {cls.classNumber}期
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {cls.enrollmentYear}年入学
          </span>
        </div>
      </Link>
      {cls.notableGraduates.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {cls.notableGraduates.map((grad, i) => (
            <ComedianTag
              key={i}
              comedian={grad}
              highlight={highlightNames.includes(grad.name)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500">データなし</p>
      )}
    </div>
  );
}
