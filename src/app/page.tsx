import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { getOsakaData, getTokyoData } from "@/lib/data";

export default function Home() {
  const osaka = getOsakaData();
  const tokyo = getTokyoData();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          NSC期別リスト
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          吉本総合芸能学院（NSC）大阪校・東京校の卒業生を期別に検索・閲覧
        </p>
      </div>

      <SearchBar />

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Link
          href="/osaka"
          className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
        >
          <h2 className="text-2xl font-bold text-yoshimoto-red group-hover:underline">
            大阪校
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {osaka.startYear}年開校 ・ {osaka.classes.length}期
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            1期: ダウンタウン、ハイヒール、トミーズ...
          </p>
        </Link>

        <Link
          href="/tokyo"
          className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
        >
          <h2 className="text-2xl font-bold text-yoshimoto-red group-hover:underline">
            東京校
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {tokyo.startYear}年開校 ・ {tokyo.classes.length}期
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            1期: 品川庄司、東京ダイナマイト...
          </p>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-sm text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-300">NSCとは？</h3>
        <p>
          NSC（New Star Creation）は、吉本興業が1982年に大阪で開校したお笑い芸人の養成所です。
          1期生のダウンタウンをはじめ、数多くの人気芸人を輩出しています。
          東京校は1995年に開校し、東京NSC1期生は大阪NSC15期生と同期にあたります。
        </p>
      </div>
    </div>
  );
}
