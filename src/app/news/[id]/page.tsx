import { getNewsArticles, getNewsArticleById } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FadeInUp, FadeIn, SlideInLeft, TapButton, ScaleIn } from "@/components/MotionWrapper";

const categoryLabels: Record<string, string> = {
  theater: "劇場",
  live: "ライブ",
  tv: "テレビ",
  award: "受賞",
  debut: "デビュー",
  other: "その他",
};

const categoryColors: Record<string, string> = {
  theater: "bg-orange-100 text-orange-700",
  live: "bg-purple-100 text-purple-700",
  tv: "bg-blue-100 text-blue-700",
  award: "bg-yellow-100 text-yellow-700",
  debut: "bg-green-100 text-green-700",
  other: "bg-gray-100 text-gray-600",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function generateStaticParams() {
  const articles = getNewsArticles();
  return articles.map((a) => ({ id: a.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const article = getNewsArticleById(decodeURIComponent(params.id));
  if (!article) return { title: "記事が見つかりません" };
  return {
    title: `${article.title} - NSC若手芸人ニュース`,
    description: article.summary,
  };
}

export default function NewsDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const article = getNewsArticleById(decodeURIComponent(params.id));
  if (!article) return notFound();

  const allArticles = getNewsArticles();
  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;
  const nextArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <SlideInLeft>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/news" className="hover:text-yoshimoto-red">
            ニュース
          </Link>
          <span>/</span>
          <span className="truncate">{article.title}</span>
        </div>
      </SlideInLeft>

      <FadeInUp delay={0.1}>
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {article.imageEmoji && (
            <ScaleIn delay={0.2}>
              <div className="bg-gray-50 py-8 text-center">
                <span className="text-7xl">{article.imageEmoji}</span>
              </div>
            </ScaleIn>
          )}

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[article.category]}`}
              >
                {categoryLabels[article.category]}
              </span>
              <span className="text-sm text-gray-400">
                {formatDate(article.date)}
              </span>
              {article.school && (
                <Link
                  href={`/${article.school}`}
                  className="text-xs text-yoshimoto-red hover:underline"
                >
                  {article.school === "osaka" ? "大阪校" : "東京校"}
                  {article.classNumber && ` ${article.classNumber}期`}
                </Link>
              )}
            </div>

            <h1 className="text-xl font-bold text-gray-800 leading-relaxed">
              {article.title}
            </h1>

            {article.comedians.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.comedians.map((name) => (
                  <span
                    key={name}
                    className="text-sm px-3 py-1 bg-yoshimoto-red/5 text-yoshimoto-red rounded-full border border-yoshimoto-red/10"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}

            {(article.venue || article.eventDate) && (
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 space-y-2">
                <p className="text-sm font-bold text-orange-700">イベント情報</p>
                {article.venue && (
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <span>📍</span> {article.venue}
                  </p>
                )}
                {article.eventDate && (
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <span>📅</span> {formatDate(article.eventDate)}
                  </p>
                )}
              </div>
            )}

            <div className="border-t border-gray-100 pt-4">
              {article.body.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </FadeInUp>

      <FadeIn delay={0.35}>
        <div className="flex justify-between pt-2">
          {prevArticle ? (
            <TapButton>
              <Link
                href={`/news/${prevArticle.id}`}
                className="inline-block text-sm text-yoshimoto-red hover:underline px-3 py-2 -mx-3 rounded-lg active:bg-red-50 max-w-[45%]"
              >
                <span className="block text-xs text-gray-400 mb-0.5">← 前の記事</span>
                <span className="line-clamp-1">{prevArticle.title}</span>
              </Link>
            </TapButton>
          ) : (
            <div />
          )}
          {nextArticle ? (
            <TapButton>
              <Link
                href={`/news/${nextArticle.id}`}
                className="inline-block text-sm text-yoshimoto-red hover:underline px-3 py-2 -mx-3 rounded-lg active:bg-red-50 text-right max-w-[45%]"
              >
                <span className="block text-xs text-gray-400 mb-0.5">次の記事 →</span>
                <span className="line-clamp-1">{nextArticle.title}</span>
              </Link>
            </TapButton>
          ) : (
            <div />
          )}
        </div>
      </FadeIn>
    </div>
  );
}
