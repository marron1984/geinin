import Link from "next/link";
import { getOsakaData, getTokyoData } from "@/lib/data";

function getPopularClasses() {
  const osaka = getOsakaData();
  const tokyo = getTokyoData();

  // 卒業生が多い期をピックアップ
  const osakaPopular = osaka.classes
    .filter((c) => c.notableGraduates.length >= 8)
    .sort((a, b) => b.notableGraduates.length - a.notableGraduates.length)
    .slice(0, 5);

  const tokyoPopular = tokyo.classes
    .filter((c) => c.notableGraduates.length >= 8)
    .sort((a, b) => b.notableGraduates.length - a.notableGraduates.length)
    .slice(0, 5);

  return { osakaPopular, tokyoPopular };
}

function getRecentClasses() {
  const osaka = getOsakaData();
  const tokyo = getTokyoData();
  return {
    osakaRecent: osaka.classes.slice(-3).reverse(),
    tokyoRecent: tokyo.classes.slice(-3).reverse(),
  };
}

export default function Sidebar() {
  const { osakaPopular, tokyoPopular } = getPopularClasses();
  const { osakaRecent, tokyoRecent } = getRecentClasses();

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0 space-y-6">
      {/* 注目の期 */}
      <div className="bg-white rounded-2xl border-2 border-warai-ink overflow-hidden shadow-pop">
        <div className="bg-yoshimoto-red text-white px-4 py-3 font-black text-sm border-b-2 border-warai-ink">
          🔥 注目の期（卒業生が多い期）
        </div>
        <div className="divide-y divide-gray-100">
          {osakaPopular.map((cls) => (
            <Link
              key={`osaka-${cls.classNumber}`}
              href={`/osaka/${cls.classNumber}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-warai-yellow-light transition-colors"
            >
              <div>
                <span className="text-sm font-medium text-gray-900">
                  大阪{cls.classNumber}期
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {cls.enrollmentYear}年
                </span>
              </div>
              <span className="text-xs bg-yoshimoto-red text-white font-bold px-2 py-0.5 rounded-full">
                {cls.notableGraduates.length}組
              </span>
            </Link>
          ))}
          {tokyoPopular.map((cls) => (
            <Link
              key={`tokyo-${cls.classNumber}`}
              href={`/tokyo/${cls.classNumber}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-warai-yellow-light transition-colors"
            >
              <div>
                <span className="text-sm font-medium text-gray-900">
                  東京{cls.classNumber}期
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {cls.enrollmentYear}年
                </span>
              </div>
              <span className="text-xs bg-yoshimoto-red text-white font-bold px-2 py-0.5 rounded-full">
                {cls.notableGraduates.length}組
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 最新期 */}
      <div className="bg-white rounded-2xl border-2 border-warai-ink overflow-hidden shadow-pop">
        <div className="bg-warai-ink text-warai-yellow px-4 py-3 font-black text-sm border-b-2 border-warai-ink">
          🆕 最新の期
        </div>
        <div className="divide-y divide-gray-100">
          {osakaRecent.map((cls) => (
            <Link
              key={`osaka-${cls.classNumber}`}
              href={`/osaka/${cls.classNumber}`}
              className="block px-4 py-3 hover:bg-warai-yellow-light transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">
                大阪{cls.classNumber}期
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {cls.enrollmentYear}年入学
              </span>
            </Link>
          ))}
          {tokyoRecent.map((cls) => (
            <Link
              key={`tokyo-${cls.classNumber}`}
              href={`/tokyo/${cls.classNumber}`}
              className="block px-4 py-3 hover:bg-warai-yellow-light transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">
                東京{cls.classNumber}期
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {cls.enrollmentYear}年入学
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* NSCとは */}
      <div className="bg-warai-yellow-light rounded-2xl border-2 border-warai-ink p-4 shadow-pop">
        <h3 className="font-black text-warai-ink text-sm mb-2">🎓 NSCとは？</h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          NSC（New Star Creation）は、吉本興業が1982年に大阪で開校したお笑い芸人の養成所。
          1期生のダウンタウンをはじめ、数多くの人気芸人を輩出。東京校は1995年に開校。
        </p>
        <Link href="/osaka" className="text-xs text-yoshimoto-red hover:underline mt-2 inline-block">
          詳しく見る →
        </Link>
      </div>
    </aside>
  );
}
