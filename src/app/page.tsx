import Link from "next/link";
import { getOsakaData, getTokyoData } from "@/lib/data";
import { getNews, formatDate } from "@/lib/news";
import type { NewsArticle } from "@/lib/news";

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block border-b border-gray-100 dark:border-gray-700 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 rounded transition-colors"
    >
      <h3 className="font-bold text-gray-800 dark:text-gray-100 leading-snug">
        {article.title}
      </h3>
      {article.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {article.description}
        </p>
      )}
      <div className="flex gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
        <span>{article.source}</span>
        {article.pubDate && <span>{formatDate(article.pubDate)}</span>}
      </div>
    </a>
  );
}

export default async function Home() {
  const osaka = getOsakaData();
  const tokyo = getTokyoData();
  const totalComedians = [...osaka.classes, ...tokyo.classes].reduce(
    (sum, cls) => sum + cls.notableGraduates.length,
    0
  );
  const news = await getNews();

  return (
    <div className="space-y-8">
      {/* メインニュース */}
      <section>
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 border-b-2 border-yoshimoto-red pb-2">
          若手芸人ニュース
        </h2>

        {news.length > 0 ? (
          <div>
            {/* トップ記事 */}
            <a
              href={news[0].link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow mb-4"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-snug">
                {news[0].title}
              </h3>
              {news[0].description && (
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {news[0].description}
                </p>
              )}
              <div className="flex gap-3 mt-3 text-xs text-gray-400 dark:text-gray-500">
                <span className="bg-yoshimoto-red/10 text-yoshimoto-red px-2 py-0.5 rounded">
                  {news[0].source}
                </span>
                {news[0].pubDate && (
                  <span>{formatDate(news[0].pubDate)}</span>
                )}
              </div>
            </a>

            {/* 記事リスト */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 px-4">
              {news.slice(1, 15).map((article, i) => (
                <NewsCard key={`${article.link}-${i}`} article={article} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-400 dark:text-gray-500">
            ニュースを取得できませんでした。しばらく経ってから再度アクセスしてください。
          </div>
        )}
      </section>

      {/* サブコンテンツ: 芸人データベース */}
      <section>
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 border-b-2 border-yoshimoto-red pb-2">
          芸人データベース
        </h2>
        <div className="grid gap-4">
          <Link
            href="/nsc"
            className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-yoshimoto-red group-hover:underline">
                  NSC期別リスト
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  大阪校 {osaka.classes.length}期 ・ 東京校{" "}
                  {tokyo.classes.length}期 ・ 掲載芸人 {totalComedians}組
                </p>
              </div>
              <span className="text-yoshimoto-red text-xl group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>

          <Link
            href="/mypage"
            className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-yoshimoto-red group-hover:underline">
                  マイページ
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  お気に入り芸人の管理・コメント投稿
                </p>
              </div>
              <span className="text-yoshimoto-red text-xl group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
