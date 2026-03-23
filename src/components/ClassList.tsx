"use client";

import { useState } from "react";
import { NscClass } from "@/lib/types";
import ClassCard from "./ClassCard";

interface ClassListProps {
  classes: NscClass[];
}

function getDecade(year: number): string {
  return `${Math.floor(year / 10) * 10}年代`;
}

export default function ClassList({ classes }: ClassListProps) {
  const [filter, setFilter] = useState<string>("all");

  const decades = Array.from(
    new Set(classes.map((cls) => getDecade(cls.enrollmentYear)))
  ).sort();

  const filtered =
    filter === "all"
      ? classes
      : classes.filter((cls) => getDecade(cls.enrollmentYear) === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            filter === "all"
              ? "bg-yoshimoto-red text-white border-yoshimoto-red"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-yoshimoto-red hover:text-yoshimoto-red"
          }`}
        >
          すべて ({classes.length})
        </button>
        {decades.map((decade) => {
          const count = classes.filter(
            (cls) => getDecade(cls.enrollmentYear) === decade
          ).length;
          return (
            <button
              key={decade}
              onClick={() => setFilter(decade)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                filter === decade
                  ? "bg-yoshimoto-red text-white border-yoshimoto-red"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-yoshimoto-red hover:text-yoshimoto-red"
              }`}
            >
              {decade} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid gap-4">
        {filtered.map((cls) => (
          <ClassCard key={cls.classNumber} cls={cls} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-8 text-gray-400 dark:text-gray-500">
          該当する期がありません
        </p>
      )}
    </div>
  );
}
