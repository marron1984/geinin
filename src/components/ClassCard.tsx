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
      whileTap={{ scale: 0.97, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
    >
      <Link href={`/${schoolPath}/${cls.classNumber}`}>
        <motion.div
          className="flex items-baseline gap-3 mb-3"
          whileTap={{ x: 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <span className="text-2xl font-bold text-yoshimoto-red">
            {cls.classNumber}期
          </span>
          <span className="text-sm text-gray-500">
            {cls.enrollmentYear}年入学
          </span>
          <motion.span
            className="text-gray-300 text-sm ml-auto"
            initial={{ opacity: 0, x: -5 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            →
          </motion.span>
        </motion.div>
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
