import Link from "next/link";
import { getOsakaData, getTokyoData, getNews } from "@/lib/data";
import ComedianTag from "@/components/ComedianTag";

function formatNewsDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

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
  const news = getNews().slice(0, 5);

  return (
    <div className="space-y-8">
      {/* ヒーローセクション（幕風） */}
      <div className="curtain-stripe rounded-2xl p-6 md:p-8 text-white border-4 border-warai-ink shadow-pop">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-warai-yellow text-warai-ink text-xs px-2.5 py-1 rounded-full font-black border-2 border-warai-ink -rotate-2 inline-block">
            🏆 レジェンドの期
          </span>
          <span className="text-white/90 text-xs font-bold">NSC大阪校</span>
        </div>
        <Link href="/osaka/1">
          <h2 className="text-2xl md:text-3xl font-black mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)] hover:scale-[1.01] transition-transform inline-block">
            NSC大阪校 第1期 — 伝説はここから始まった！
          </h2>
        </Link>
        <p className="text-white/90 text-sm md:text-base mb-4 font-medium">
          {hero.enrollmentYear}年入学。ダウンタウン、ハイヒール、トミーズなど、
          お笑い界のレジェンドが勢揃いしたNSC最初の期生たち。
        </p>
        <div className="flex flex-wrap gap-2">
          {hero.notableGraduates.slice(0, 6).map((grad, i) => (
            <span
              key={i}
              className="bg-white text-yoshimoto-red text-xs font-bold px-3 py-1 rounded-full border-2 border-warai-ink shadow-pop-sm"
            >
              {grad.name}
            </span>
          ))}
        </div>
      </div>

      {/* 最新ニュース */}
      {news.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-warai-ink flex items-center gap-2">
              <span className="bg-yoshimoto-red text-white px-2.5 py-1 rounded-lg border-2 border-warai-ink shadow-pop-sm -rotate-2 inline-block">📰</span>
              最新ニュース
            </h2>
            <Link href="/news" className="text-xs text-yoshimoto-red hover:underline">
              もっと見る →
            </Link>
          </div>
          <div className="bg-white rounded-2xl border-2 border-warai-ink divide-y divide-warai-yellow-light shadow-pop overflow-hidden">
            {news.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-baseline gap-3 px-4 py-3 hover:bg-warai-yellow-light transition-colors"
              >
                <span className="text-xs text-gray-400 flex-shrink-0 w-10">
                  {formatNewsDate(item.date)}
                </span>
                <span className="text-sm font-medium text-gray-900 leading-snug">
                  {item.title}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 校舎カード */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/osaka"
          className="block bg-white rounded-2xl border-2 border-warai-ink p-5 shadow-pop hover:-translate-y-1 hover:shadow-pop-red transition-all group"
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
          className="block bg-white rounded-2xl border-2 border-warai-ink p-5 shadow-pop hover:-translate-y-1 hover:shadow-pop-red transition-all group"
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
          <h2 className="text-xl font-black text-warai-ink flex items-center gap-2">
            <span className="bg-warai-yellow text-warai-ink px-2.5 py-1 rounded-lg border-2 border-warai-ink shadow-pop-sm rotate-2 inline-block">✨</span>
            注目の期
          </h2>
          <span className="text-xs text-gray-400">卒業生が多い期をピックアップ</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {featured.map((cls) => (
            <Link
              key={`${cls.path}-${cls.classNumber}`}
              href={`/${cls.path}/${cls.classNumber}`}
              className="block bg-white rounded-2xl border-2 border-warai-ink p-4 shadow-pop hover:-translate-y-1 hover:shadow-pop-red transition-all group"
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
          <h2 className="text-xl font-black text-warai-ink flex items-center gap-2">
            <span className="bg-warai-orange text-white px-2.5 py-1 rounded-lg border-2 border-warai-ink shadow-pop-sm -rotate-2 inline-block">🌱</span>
            最新の期
          </h2>
        </div>
        <div className="bg-white rounded-2xl border-2 border-warai-ink divide-y divide-warai-yellow-light shadow-pop overflow-hidden">
          {latest.map((cls) => (
            <Link
              key={`${cls.path}-${cls.classNumber}`}
              href={`/${cls.path}/${cls.classNumber}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-warai-yellow-light transition-colors"
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
