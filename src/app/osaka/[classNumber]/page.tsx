import { getOsakaData, getClassByNumber } from "@/lib/data";
import ComedianTag from "@/components/ComedianTag";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  const data = getOsakaData();
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
    title: `NSC大阪校 ${params.classNumber}期 | 芸人ナビ`,
    description: `NSC大阪校 第${params.classNumber}期の卒業生一覧・芸人データベース`,
  };
}

export default function OsakaClassPage({
  params,
}: {
  params: { classNumber: string };
}) {
  const classNumber = parseInt(params.classNumber);
  const cls = getClassByNumber("osaka", classNumber);

  if (!cls) return notFound();

  const data = getOsakaData();
  const maxClass = data.classes.length;

  return (
    <article className="space-y-6">
      {/* パンくずリスト */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-yoshimoto-red">トップ</Link>
        <span>/</span>
        <Link href="/osaka" className="hover:text-yoshimoto-red">大阪校</Link>
        <span>/</span>
        <span className="text-gray-700">{classNumber}期</span>
      </nav>

      {/* 記事ヘッダー */}
      <header className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-yoshimoto-red text-white text-xs font-bold px-2 py-1 rounded">大阪校</span>
          <span className="text-xs text-gray-400">{cls.enrollmentYear}年入学</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          NSC大阪校 第{classNumber}期
        </h1>
        <p className="text-gray-500 text-sm">
          {cls.enrollmentYear}年入学の期生。
          {cls.notableGraduates.length > 0
            ? `${cls.notableGraduates.length}組の主な卒業生を掲載。`
            : "卒業生データは準備中です。"}
        </p>
        {cls.classNote && (
          <p className="mt-3 text-sm text-gray-700 bg-red-50 border-l-4 border-yoshimoto-red rounded-r px-3 py-2">
            {cls.classNote}
          </p>
        )}
      </header>

      {/* 卒業生リスト */}
      {cls.notableGraduates.length > 0 ? (
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-black text-gray-900 mb-4 text-lg border-l-4 border-yoshimoto-red pl-3">
            主な卒業生
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {cls.notableGraduates.map((grad, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-yoshimoto-red font-bold text-sm w-6 text-right flex-shrink-0 pt-1">{i + 1}</span>
                <div className="min-w-0">
                  <ComedianTag comedian={grad} />
                  {grad.note && (
                    <p className="text-xs text-gray-400 mt-1 pl-1">{grad.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-gray-400 text-center">
          主な卒業生のデータはまだありません
        </div>
      )}

      {/* 前後ナビゲーション */}
      <nav className="flex justify-between items-center bg-white rounded-lg border border-gray-200 p-4">
        {classNumber > 1 ? (
          <Link
            href={`/osaka/${classNumber - 1}`}
            className="text-sm text-yoshimoto-red hover:underline flex items-center gap-1"
          >
            <span>←</span>
            <span>{classNumber - 1}期</span>
          </Link>
        ) : (
          <div />
        )}
        <Link href="/osaka" className="text-xs text-gray-400 hover:text-gray-600">
          一覧に戻る
        </Link>
        {classNumber < maxClass ? (
          <Link
            href={`/osaka/${classNumber + 1}`}
            className="text-sm text-yoshimoto-red hover:underline flex items-center gap-1"
          >
            <span>{classNumber + 1}期</span>
            <span>→</span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
