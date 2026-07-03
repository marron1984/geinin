import Link from "next/link";
import { NscClass } from "@/lib/types";

interface ClassCardProps {
  cls: NscClass;
  highlightNames?: string[];
}

export default function ClassCard({ cls, highlightNames = [] }: ClassCardProps) {
  const schoolPath = cls.school === "osaka" ? "osaka" : "tokyo";
  const isOsaka = cls.school === "osaka";

  return (
    <Link
      href={`/${schoolPath}/${cls.classNumber}`}
      className="block bg-white rounded-2xl border-2 border-warai-ink p-4 shadow-pop hover:-translate-y-1 hover:shadow-pop-red transition-all group"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
          isOsaka ? "bg-yoshimoto-red text-white border border-warai-ink" : "bg-warai-ink text-warai-yellow border border-warai-ink"
        }`}>
          {isOsaka ? "大阪" : "東京"}
        </span>
        <span className="text-xs text-gray-400">{cls.enrollmentYear}年入学</span>
      </div>
      <h3 className="font-bold text-gray-900 group-hover:text-yoshimoto-red transition-colors mb-2">
        第{cls.classNumber}期
      </h3>
      {cls.notableGraduates.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {cls.notableGraduates.slice(0, 5).map((grad, i) => (
            <span
              key={i}
              className={`text-xs px-2 py-0.5 rounded-full ${
                highlightNames.includes(grad.name)
                  ? "bg-yoshimoto-red text-white"
                  : "bg-warai-yellow-light text-warai-ink"
              }`}
            >
              {grad.name}
            </span>
          ))}
          {cls.notableGraduates.length > 5 && (
            <span className="text-xs text-gray-400">
              +{cls.notableGraduates.length - 5}組
            </span>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-400">データ準備中</p>
      )}
    </Link>
  );
}
