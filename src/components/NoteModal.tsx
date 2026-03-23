"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NoteCategory, ComedianNote } from "@/lib/types";

const categoryOptions: { key: NoteCategory; label: string; emoji: string }[] = [
  { key: "family", label: "家族・背景", emoji: "👨‍👩‍👧" },
  { key: "neta", label: "ネタ・芸風", emoji: "🎤" },
  { key: "schedule", label: "観劇予定", emoji: "📅" },
  { key: "impression", label: "感想", emoji: "💭" },
  { key: "other", label: "その他", emoji: "📝" },
];

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: NoteCategory, content: string) => void;
  comedianName: string;
  editNote?: ComedianNote | null;
}

export default function NoteModal({
  isOpen,
  onClose,
  onSave,
  comedianName,
  editNote,
}: NoteModalProps) {
  const [category, setCategory] = useState<NoteCategory>(editNote?.category || "impression");
  const [content, setContent] = useState(editNote?.content || "");

  const handleSave = () => {
    if (!content.trim()) return;
    onSave(category, content.trim());
    setContent("");
    setCategory("impression");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-x-4 bottom-4 top-auto md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  {editNote ? "メモを編集" : "メモを追加"}
                </h3>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <p className="text-sm text-yoshimoto-red font-medium">{comedianName}</p>

              <div>
                <label className="block text-xs text-gray-500 mb-2">カテゴリ</label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((opt) => (
                    <motion.button
                      key={opt.key}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCategory(opt.key)}
                      className={`relative px-3 py-1.5 rounded-full text-sm ${
                        category === opt.key
                          ? "text-white"
                          : "text-gray-600 bg-gray-100"
                      }`}
                    >
                      {category === opt.key && (
                        <motion.div
                          layoutId="noteCategoryBg"
                          className="absolute inset-0 bg-yoshimoto-red rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">
                        {opt.emoji} {opt.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">内容</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    category === "family"
                      ? "家族構成、出身地、経歴など..."
                      : category === "neta"
                      ? "ネタの特徴、芸風、得意なジャンルなど..."
                      : category === "schedule"
                      ? "次回の劇場出演、ライブ日程など..."
                      : category === "impression"
                      ? "ライブの感想、印象に残ったことなど..."
                      : "自由にメモ..."
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yoshimoto-red focus:ring-2 focus:ring-yoshimoto-red/20 outline-none text-sm text-gray-800 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  キャンセル
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={!content.trim()}
                  className="flex-1 py-2.5 text-sm text-white bg-yoshimoto-red rounded-lg hover:bg-yoshimoto-red-dark disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {editNote ? "更新する" : "保存する"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
