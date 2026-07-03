import { getTimeline } from "@/lib/data";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NSCタイムライン | 芸人ナビ",
  description:
    "NSC大阪校・東京校の入学年を軸に、各期の卒業生と賞レース受賞歴を時系列で俯瞰できるタイムライン",
};

const contestColors: Record<string, string> = {
  "M-1グランプリ": "bg-red-600 text-white",
  キングオブコント: "bg-blue-600 text-white",
  "R-1グランプリ": "bg-amber-500 text-white",
  "THE SECOND": "bg-purple-600 text-white",
  "THE W": "bg-pink-500 text-white",
};

const contestShort: Record<string, string> = {
  "M-1グランプリ": "M-1",
  キングオブコント: "KOC",
  "R-1グランプリ": "R-1",
  "THE SECOND": "2ND",
  "THE W": "W",
};

export default function TimelinePage() {
  const timeline = getTimeline();

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-2xl border-2 border-warai-ink shadow-pop p-5">
        <h1 className="text-xl font-black text-warai-ink mb-1">
          NSCタイムライン
        </h1>
        <p className="text-sm text-gray-500">
          入学年を軸に、各期の卒業生と賞レース受賞を時系列で俯瞰
        </p>
      </header>

      {/* 凡例 */}
      <div className="flex flex-wrap gap-2 text-xs">
        {Object.entries(contestColors).map(([name, cls]) => (
          <span key={name} className={`px-2 py-1 rounded font-bold ${cls}`}>
            {contestShort[name]} = {name}
          </span>
        ))}
      </div>

      {/* タイムライン */}
      <div className="relative">
        {/* 中央の縦線 */}
        <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-0">
          {timeline.map((entry) => {
            const hasAwards = entry.awards.length > 0;
            const totalGrads =
              (entry.osakaClass?.notableGraduates.length || 0) +
              (entry.tokyoClass?.notableGraduates.length || 0);

            return (
              <div key={entry.year} className="relative flex gap-4 md:gap-6">
                {/* 年ラベル + ドット */}
                <div className="flex-shrink-0 w-16 md:w-24 text-right relative">
                  <div
                    className={`absolute right-[-12px] md:right-[-16px] top-4 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white z-10 ${
                      hasAwards ? "bg-yoshimoto-red" : "bg-gray-300"
                    }`}
                  />
                  <div
                    className={`text-sm md:text-base font-black pr-4 pt-3 ${
                      hasAwards ? "text-yoshimoto-red" : "text-gray-400"
                    }`}
                  >
                    {entry.year}
                  </div>
                </div>

                {/* コンテンツカード */}
                <div
                  className={`flex-1 mb-3 rounded-lg border p-3 md:p-4 ${
                    hasAwards
                      ? "bg-white border-yoshimoto-red/30 shadow-sm"
                      : "bg-white border-gray-100"
                  }`}
                >
                  {/* 賞レースバッジ */}
                  {hasAwards && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {entry.awards.map((a, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            contestColors[a.contest] || "bg-gray-500 text-white"
                          }`}
                        >
                          {contestShort[a.contest]} {a.result} {a.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 期情報 */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    {entry.osakaClass && (
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/osaka/${entry.osakaClass.classNumber}`}
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-yoshimoto-red hover:underline"
                        >
                          <span className="bg-yoshimoto-red text-white text-xs px-1.5 py-0.5 rounded">
                            大阪
                          </span>
                          {entry.osakaClass.classNumber}期
                        </Link>
                        {entry.osakaClass.notableGraduates.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {entry.osakaClass.notableGraduates
                              .slice(0, 5)
                              .map((g, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                                >
                                  {g.name}
                                </span>
                              ))}
                            {entry.osakaClass.notableGraduates.length > 5 && (
                              <span className="text-xs text-gray-400">
                                +
                                {entry.osakaClass.notableGraduates.length - 5}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {entry.tokyoClass && (
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/tokyo/${entry.tokyoClass.classNumber}`}
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:underline"
                        >
                          <span className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded">
                            東京
                          </span>
                          {entry.tokyoClass.classNumber}期
                        </Link>
                        {entry.tokyoClass.notableGraduates.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {entry.tokyoClass.notableGraduates
                              .slice(0, 5)
                              .map((g, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                                >
                                  {g.name}
                                </span>
                              ))}
                            {entry.tokyoClass.notableGraduates.length > 5 && (
                              <span className="text-xs text-gray-400">
                                +
                                {entry.tokyoClass.notableGraduates.length - 5}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
