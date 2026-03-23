"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NoteCategory, ComedianNote } from "@/lib/types";

const categoryOptions: { key: NoteCategory; label: string; emoji: string }[] = [
  { key: "impression", label: "感想", emoji: "💭" },
  { key: "neta", label: "ネタ", emoji: "🎤" },
  { key: "schedule", label: "予定", emoji: "📅" },
  { key: "family", label: "背景", emoji: "👨‍👩‍👧" },
  { key: "other", label: "他", emoji: "📝" },
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
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto"
          >
            {/* ドラッグハンドル（モバイル） */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    {editNote ? "メモを編集" : "メモを追加"}
                  </h3>
                  <p className="text-xs text-yoshimoto-red font-medium">{comedianName}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 -mr-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* カテゴリ */}
              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                {categoryOptions.map((opt) => (
                  <motion.button
                    key={opt.key}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCategory(opt.key)}
                    className={`relative flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                      category === opt.key
                        ? "text-white"
                        : "text-gray-600 bg-gray-100"
                    }`}
                  >
                    {category === opt.key && (
                      <motion.div
                        layoutId="modalCategoryBg"
                        className="absolute inset-0 bg-yoshimoto-red rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{opt.emoji} {opt.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* テキスト */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`${comedianName}について...`}
                rows={3}
                autoFocus
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yoshimoto-red focus:ring-2 focus:ring-yoshimoto-red/20 outline-none text-sm text-gray-800 resize-none"
              />

              {/* ボタン */}
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-lg active:bg-gray-200"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSave}
                  disabled={!content.trim()}
                  className="flex-1 py-2.5 text-sm text-white bg-yoshimoto-red rounded-lg active:bg-yoshimoto-red-dark disabled:opacity-30"
                >
                  {editNote ? "更新" : "保存"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
