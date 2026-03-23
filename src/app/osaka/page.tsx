import { getOsakaData } from "@/lib/data";
import SchoolTabs from "@/components/SchoolTabs";
import ClassList from "@/components/ClassList";
import SearchBar from "@/components/SearchBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NSC大阪校 期別リスト",
  description: "NSC大阪校の1期（ダウンタウン）から最新期までの卒業生一覧",
};

export default function OsakaPage() {
  const data = getOsakaData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {data.schoolName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {data.startYear}年開校 ・ 全{data.classes.length}期
        </p>
      </div>

      <SearchBar />
      <SchoolTabs active="osaka" />
      <ClassList classes={data.classes} />
    </div>
  );
}
