import Link from "next/link";
import { getOsakaData, getTokyoData } from "@/lib/data";
import ComedianTag from "@/components/ComedianTag";

function getHeroClass() {
  const osaka = getOsakaData();
  // 1期生（ダウンタウン）をヒーローに
  return osaka.classes[0];
}

function getFeaturedClasses() {
  const osaka = getOsakaData();
  const tokyo = getTokyoData();

  // 注目の期をピックアップ（卒業生が多い期）
  const all = [
    ...osaka.classes.map((c) => ({ ...c, schoolLabel: "大阪校", path: "osaka" })),
    ...tokyo.classes.map((c) => ({ ...c, schoolLabel: "東京校", path: "tokyo" })),
  ];

  return all
    .filter((c) => c.notableGraduates.length >= 6)
    .sort((a, b) => b.notableGraduates.length - a.notableGraduates.length)
    .slice(0, 6);
}

function getLatestClasses() {
  const osaka = getOsakaData();
  const tokyo = getTokyoData();

  return [
    ...osaka.classes.slice(-5).reverse().map((c) => ({ ...c, schoolLabel: "大阪校", path: "osaka" })),
    ...tokyo.classes.slice(-5).reverse().map((c) => ({ ...c, schoolLabel: "東京校", path: "tokyo" })),
  ];
}

export default function Home() {
  const osaka = getOsakaData();
  const tokyo = getTokyoData();
  const hero = getHeroClass();
  const featured = getFeaturedClasses();
  const latest = getLatestClasses();

  return (
    <div className="space-y-8">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-br from-yoshimoto-red to-yoshimoto-red-dark rounded-xl p-6 md:p-8 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-white/20 text-xs px-2 py-1 rounded font-medium">FEATURED</span>
          <span className="text-white/70 text-xs">NSC大阪校</span>
        </div>
        <Link href="/osaka/1">
          <h2 className="text-2xl md:text-3xl font-black mb-2 hover:underline underline-offset-4">
            NSC大阪校 第1期 — 伝説の始まり
          </h2>
        </Link>
        <p className="text-white/80 text-sm md:text-base mb-4">
          {hero.enrollmentYear}年入学。ダウンタウン、ハイヒール、トミーズなど、
          お笑い界のレジェンドが勢揃いしたNSC最初の期生たち。
        </p>
        <div className="flex flex-wrap gap-2">
          {hero.notableGraduates.slice(0, 6).map((grad, i) => (
            <span
              key={i}
              className="bg-white/20 text-white text-xs px-3 py-1 rounded-full"
            >
              {grad.name}
            </span>
          ))}
        </div>
      </div>

      {/* 校舎カード */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/osaka"
          className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-yoshimoto-red hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-yoshimoto-red text-white text-xs font-bold px-2 py-1 rounded">大阪</span>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-yoshimoto-red transition-colors">
              NSC大阪校
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            {osaka.startYear}年開校 ・ 全{osaka.classes.length}期 ・ ダウンタウンの母校
          </p>
        </Link>

        <Link
          href="/tokyo"
          className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-yoshimoto-red hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">東京</span>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-yoshimoto-red transition-colors">
              NSC東京校
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            {tokyo.startYear}年開校 ・ 全{tokyo.classes.length}期 ・ 品川庄司の1期
          </p>
        </Link>
      </div>

      {/* 注目の期 - ニュースカードグリッド */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-gray-900 border-l-4 border-yoshimoto-red pl-3">
            注目の期
          </h2>
          <span className="text-xs text-gray-400">卒業生が多い期をピックアップ</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {featured.map((cls) => (
            <Link
              key={`${cls.path}-${cls.classNumber}`}
              href={`/${cls.path}/${cls.classNumber}`}
              className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-yoshimoto-red hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  cls.path === "osaka"
                    ? "bg-red-100 text-yoshimoto-red"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {cls.schoolLabel}
                </span>
                <span className="text-xs text-gray-400">{cls.enrollmentYear}年入学</span>
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-yoshimoto-red transition-colors mb-2">
                第{cls.classNumber}期 — {cls.notableGraduates.length}組の主な卒業生
              </h3>
              <div className="flex flex-wrap gap-1">
                {cls.notableGraduates.slice(0, 4).map((grad, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {grad.name}
                  </span>
                ))}
                {cls.notableGraduates.length > 4 && (
                  <span className="text-xs text-gray-400">
                    +{cls.notableGraduates.length - 4}組
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 最新の期 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-gray-900 border-l-4 border-gray-800 pl-3">
            最新の期
          </h2>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {latest.map((cls) => (
            <Link
              key={`${cls.path}-${cls.classNumber}`}
              href={`/${cls.path}/${cls.classNumber}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  cls.path === "osaka"
                    ? "bg-red-100 text-yoshimoto-red"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {cls.schoolLabel}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  第{cls.classNumber}期
                </span>
                <span className="text-xs text-gray-500">
                  {cls.enrollmentYear}年入学
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {cls.notableGraduates.length > 0
                  ? `${cls.notableGraduates.length}組`
                  : "データ準備中"}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
