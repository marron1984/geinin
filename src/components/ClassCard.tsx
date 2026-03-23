"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { NscClass } from "@/lib/types";
import ComedianTag from "./ComedianTag";

interface ClassCardProps {
  cls: NscClass;
  highlightNames?: string[];
}

export default function ClassCard({ cls, highlightNames = [] }: ClassCardProps) {
  const schoolPath = cls.school === "osaka" ? "osaka" : "tokyo";

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
    >
      <Link href={`/${schoolPath}/${cls.classNumber}`}>
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-2xl font-bold text-yoshimoto-red">
            {cls.classNumber}期
          </span>
          <span className="text-sm text-gray-500">
            {cls.enrollmentYear}年入学
          </span>
        </div>
      </Link>
      {cls.notableGraduates.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {cls.notableGraduates.map((grad, i) => (
            <ComedianTag
              key={i}
              comedian={grad}
              highlight={highlightNames.includes(grad.name)}
              index={i}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">データなし</p>
      )}
    </motion.div>
  );
}
