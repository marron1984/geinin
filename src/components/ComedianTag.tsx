"use client";

import { motion } from "framer-motion";
import { Comedian } from "@/lib/types";

interface ComedianTagProps {
  comedian: Comedian;
  highlight?: boolean;
  index?: number;
}

export default function ComedianTag({ comedian, highlight, index = 0 }: ComedianTagProps) {
  const className = `inline-block px-3 py-1 rounded-full text-sm border ${
    highlight
      ? "bg-yoshimoto-red text-white border-yoshimoto-red"
      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
  } transition-colors`;

  const content = (
    <>
      {comedian.name}
      {comedian.members && (
        <span className="text-xs opacity-70 ml-1">
          ({comedian.members.join("・")})
        </span>
      )}
    </>
  );

  const motionProps = {
    initial: { opacity: 0, scale: 0.7 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.3,
      delay: index * 0.04,
      type: "spring" as const,
      stiffness: 260,
      damping: 20,
    },
    whileHover: { scale: 1.08 },
    whileTap: { scale: 0.95 },
  };

  if (comedian.profileUrl) {
    return (
      <motion.a
        href={comedian.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        title={comedian.members ? comedian.members.join("・") : undefined}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.span
      className={className}
      title={comedian.members ? comedian.members.join("・") : undefined}
      {...motionProps}
    >
      {content}
    </motion.span>
  );
}
