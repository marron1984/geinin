import { getNews } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NSC芸人ニュース | 芸人ナビ",
  description:
    "NSC出身芸人に関する最新ニュース。賞レース結果・解散・改名など、自動クロールで随時更新。",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function NewsPage() {
  const news = getNews();

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-2xl border-2 border-warai-ink shadow-pop p-5">
        <h1 className="text-xl font-black text-warai-ink mb-1">
          NSC芸人ニュース
        </h1>
        <p className="text-sm text-gray-500">
          NSC出身芸人に関する最新ニュース（自動クロールで随時更新）
        </p>
      </header>

      {news.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-warai-ink shadow-pop p-6 text-center text-gray-400">
          ニュースはまだありません
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-warai-ink shadow-pop divide-y divide-warai-yellow-light">
          {news.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-4 hover:bg-warai-yellow-light transition-colors"
            >
              <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                  {item.source}
                </span>
                <span>{formatDate(item.date)}</span>
              </div>
              <h2 className="font-bold text-gray-900 leading-snug">
                {item.title}
              </h2>
              {item.matched.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.matched.map((name, j) => (
                    <span
                      key={j}
                      className="text-xs bg-yoshimoto-red text-white px-2 py-0.5 rounded-full"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
