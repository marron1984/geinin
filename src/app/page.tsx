import Link from "next/link";
import { getOsakaData, getTokyoData } from "@/lib/data";

export default function Home() {
  const osaka = getOsakaData();
  const tokyo = getTokyoData();
  const totalComedians = [...osaka.classes, ...tokyo.classes].reduce(
    (sum, cls) => sum + cls.notableGraduates.length,
    0
  );

  return (
    <div className="space-y-10">
      {/* ヒーロー */}
      <section className="text-center space-y-4 py-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          芸人データベース
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          お笑い芸人の情報をまとめたデータベースサイト
        </p>
      </section>

      {/* コンテンツ一覧 */}
      <section>
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 border-b-2 border-yoshimoto-red pb-2">
          コンテンツ
        </h2>
        <div className="grid gap-6">
          {/* NSC期別リスト */}
          <Link
            href="/nsc"
            className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-yoshimoto-red group-hover:underline">
                  NSC期別リスト
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  吉本総合芸能学院（NSC）大阪校・東京校の卒業生を期別に検索・閲覧
                </p>
                <div className="flex gap-4 mt-3 text-sm text-gray-400 dark:text-gray-500">
                  <span>大阪校 {osaka.classes.length}期</span>
                  <span>東京校 {tokyo.classes.length}期</span>
                  <span>掲載芸人 {totalComedians}組</span>
                </div>
              </div>
              <span className="text-yoshimoto-red text-2xl group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* サイト情報 */}
      <section className="bg-white dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-300">
          このサイトについて
        </h3>
        <p>
          芸人データベースは、お笑い芸人に関する情報をまとめたデータベースサイトです。
          現在はNSC（吉本総合芸能学院）の期別卒業生リストを公開しています。
          今後もコンテンツを拡充していく予定です。
        </p>
      </section>
    </div>
  );
}
