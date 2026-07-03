import { getTokyoData } from "@/lib/data";
import SchoolTabs from "@/components/SchoolTabs";
import ClassList from "@/components/ClassList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NSC東京校 期別一覧 | 芸人ナビ",
  description: "NSC東京校の1期（品川庄司）から最新期までの卒業生一覧",
};

export default function TokyoPage() {
  const data = getTokyoData();

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="bg-white rounded-2xl border-2 border-warai-ink shadow-pop p-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">東京校</span>
          <h1 className="text-xl font-black text-warai-ink">
            NSC東京校 期別一覧
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          {data.startYear}年開校 ・ 全{data.classes.length}期 ・ 1期生は品川庄司、東京ダイナマイトなど
        </p>
      </div>

      <SchoolTabs active="tokyo" />
      <ClassList classes={data.classes} />
    </div>
  );
}
