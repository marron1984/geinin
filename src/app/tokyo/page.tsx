import { getTokyoData } from "@/lib/data";
import SchoolTabs from "@/components/SchoolTabs";
import ClassList from "@/components/ClassList";
import SearchBar from "@/components/SearchBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NSC東京校 期別リスト",
  description: "NSC東京校の1期（品川庄司）から最新期までの卒業生一覧",
};

export default function TokyoPage() {
  const data = getTokyoData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {data.schoolName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {data.startYear}年開校 ・ 全{data.classes.length}期
        </p>
      </div>

      <SearchBar />
      <SchoolTabs active="tokyo" />
      <ClassList classes={data.classes} />
    </div>
  );
}
