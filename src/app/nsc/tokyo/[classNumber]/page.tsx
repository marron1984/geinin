import { getTokyoData, getClassByNumber } from "@/lib/data";
import ComedianTag from "@/components/ComedianTag";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  const data = getTokyoData();
  return data.classes.map((cls) => ({
    classNumber: String(cls.classNumber),
  }));
}

export function generateMetadata({
  params,
}: {
  params: { classNumber: string };
}): Metadata {
  return {
    title: `NSC東京校 ${params.classNumber}期`,
    description: `NSC東京校 第${params.classNumber}期の卒業生一覧`,
  };
}

export default function TokyoClassPage({
  params,
}: {
  params: { classNumber: string };
}) {
  const classNumber = parseInt(params.classNumber);
  const cls = getClassByNumber("tokyo", classNumber);

  if (!cls) return notFound();

  const data = getTokyoData();
  const maxClass = data.classes.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/nsc" className="hover:text-yoshimoto-red">
          NSC期別リスト
        </Link>
        <span>/</span>
        <Link href="/nsc/tokyo" className="hover:text-yoshimoto-red">
          東京校
        </Link>
        <span>/</span>
        <span>{classNumber}期</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-yoshimoto-red">
          第{classNumber}期
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          NSC東京校 ・ {cls.enrollmentYear}年入学
        </p>
      </div>

      {cls.notableGraduates.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-bold text-gray-700 dark:text-gray-300 mb-4">主な卒業生</h2>
          <div className="space-y-3">
            {cls.notableGraduates.map((grad, i) => (
              <div key={i} className="flex items-start gap-3">
                <ComedianTag comedian={grad} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-gray-400 dark:text-gray-500">
          主な卒業生のデータはまだありません
        </div>
      )}

      <div className="flex justify-between pt-4">
        {classNumber > 1 ? (
          <Link
            href={`/nsc/tokyo/${classNumber - 1}`}
            className="text-yoshimoto-red hover:underline"
          >
            ← {classNumber - 1}期
          </Link>
        ) : (
          <div />
        )}
        {classNumber < maxClass ? (
          <Link
            href={`/nsc/tokyo/${classNumber + 1}`}
            className="text-yoshimoto-red hover:underline"
          >
            {classNumber + 1}期 →
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
