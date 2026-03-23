import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { getOsakaData, getTokyoData } from "@/lib/data";
import { FadeInUp, FadeIn, HoverLift } from "@/components/MotionWrapper";

export default function Home() {
  const osaka = getOsakaData();
  const tokyo = getTokyoData();

  return (
    <div className="space-y-8">
      <FadeInUp>
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">
            NSC期別リスト
          </h1>
          <p className="text-gray-500">
            吉本総合芸能学院（NSC）大阪校・東京校の卒業生を期別に検索・閲覧
          </p>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.15}>
        <SearchBar />
      </FadeInUp>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <FadeInUp delay={0.25}>
          <HoverLift>
            <Link
              href="/osaka"
              className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 group"
            >
              <h2 className="text-2xl font-bold text-yoshimoto-red group-hover:underline">
                大阪校
              </h2>
              <p className="text-gray-500 mt-2">
                {osaka.startYear}年開校 ・ {osaka.classes.length}期
              </p>
              <p className="text-sm text-gray-400 mt-1">
                1期: ダウンタウン、ハイヒール、トミーズ...
              </p>
            </Link>
          </HoverLift>
        </FadeInUp>

        <FadeInUp delay={0.35}>
          <HoverLift>
            <Link
              href="/tokyo"
              className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 group"
            >
              <h2 className="text-2xl font-bold text-yoshimoto-red group-hover:underline">
                東京校
              </h2>
              <p className="text-gray-500 mt-2">
                {tokyo.startYear}年開校 ・ {tokyo.classes.length}期
              </p>
              <p className="text-sm text-gray-400 mt-1">
                1期: 品川庄司、東京ダイナマイト...
              </p>
            </Link>
          </HoverLift>
        </FadeInUp>
      </div>

      <FadeIn delay={0.5}>
        <div className="bg-white rounded-lg p-4 text-sm text-gray-500 border border-gray-100">
          <h3 className="font-bold mb-2">NSCとは？</h3>
          <p>
            NSC（New Star Creation）は、吉本興業が1982年に大阪で開校したお笑い芸人の養成所です。
            1期生のダウンタウンをはじめ、数多くの人気芸人を輩出しています。
            東京校は1995年に開校し、東京NSC1期生は大阪NSC15期生と同期にあたります。
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
