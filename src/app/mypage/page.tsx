"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useNotes } from "@/lib/useNotes";
import { NoteCategory } from "@/lib/types";
import NoteModal from "@/components/NoteModal";
import { FadeInUp } from "@/components/MotionWrapper";

const categoryInfo: Record<NoteCategory, { label: string; emoji: string; color: string }> = {
  family: { label: "家族・背景", emoji: "👨‍👩‍👧", color: "bg-pink-50 border-pink-200" },
  neta: { label: "ネタ・芸風", emoji: "🎤", color: "bg-blue-50 border-blue-200" },
  schedule: { label: "観劇予定", emoji: "📅", color: "bg-orange-50 border-orange-200" },
  impression: { label: "感想", emoji: "💭", color: "bg-green-50 border-green-200" },
  other: { label: "その他", emoji: "📝", color: "bg-gray-50 border-gray-200" },
};

const filterOptions = [
  { key: "all", label: "すべて" },
  { key: "family", label: "👨‍👩‍👧 家族・背景" },
  { key: "neta", label: "🎤 ネタ・芸風" },
  { key: "schedule", label: "📅 観劇予定" },
  { key: "impression", label: "💭 感想" },
  { key: "other", label: "📝 その他" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export default function MyPage() {
  const { notes, loaded, updateNote, deleteNote } = useNotes();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = notes;
    if (filter !== "all") {
      result = result.filter((n) => n.category === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (n) =>
          n.comedianName.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }
    return result;
  }, [notes, filter, searchQuery]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const note of filtered) {
      const key = note.comedianName;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(note);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const stats = useMemo(() => {
    const comedians = new Set(notes.map((n) => n.comedianName));
    return {
      total: notes.length,
      comedians: comedians.size,
      categories: Object.fromEntries(
        Object.keys(categoryInfo).map((cat) => [
          cat,
          notes.filter((n) => n.category === cat).length,
        ])
      ) as Record<NoteCategory, number>,
    };
  }, [notes]);

  const editTarget = editingNoteId ? notes.find((n) => n.id === editingNoteId) : null;

  if (!loaded) {
    return (
      <div className="text-center py-12 text-gray-400">読み込み中...</div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeInUp>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">マイページ</h1>
          <p className="text-sm text-gray-500 mt-1">
            芸人ごとのメモ・感想・観劇記録を管理
          </p>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg border border-gray-100 p-3 text-center">
            <p className="text-2xl font-bold text-yoshimoto-red">{stats.total}</p>
            <p className="text-xs text-gray-500">メモ数</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-3 text-center">
            <p className="text-2xl font-bold text-yoshimoto-red">{stats.comedians}</p>
            <p className="text-xs text-gray-500">芸人数</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-3 text-center">
            <p className="text-2xl font-bold text-orange-500">{stats.categories.schedule}</p>
            <p className="text-xs text-gray-500">観劇予定</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-3 text-center">
            <p className="text-2xl font-bold text-green-500">{stats.categories.impression}</p>
            <p className="text-xs text-gray-500">感想</p>
          </div>
        </div>
      </FadeInUp>

      <FadeInUp delay={0.15}>
        <div className="space-y-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="芸人名・メモ内容で検索..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-yoshimoto-red focus:ring-2 focus:ring-yoshimoto-red/20 outline-none text-sm text-gray-800 bg-white"
          />
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {filterOptions.map((opt) => (
              <motion.button
                key={opt.key}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFilter(opt.key)}
                className={`relative flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === opt.key
                    ? "text-white"
                    : "text-gray-600 bg-gray-100"
                }`}
              >
                {filter === opt.key && (
                  <motion.div
                    layoutId="mypageFilterBg"
                    className="absolute inset-0 bg-yoshimoto-red rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{opt.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </FadeInUp>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${filter}-${searchQuery}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {grouped.length > 0 ? (
            grouped.map(([comedianName, comedianNotes], gi) => (
              <motion.div
                key={comedianName}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.05 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-800">{comedianName}</h3>
                  <span className="text-xs text-gray-400">
                    {comedianNotes[0].school === "osaka" ? "大阪校" : "東京校"} {comedianNotes[0].classNumber}期
                  </span>
                  <Link
                    href={`/${comedianNotes[0].school}/${comedianNotes[0].classNumber}`}
                    className="text-xs text-yoshimoto-red hover:underline ml-auto"
                  >
                    期別ページ →
                  </Link>
                </div>
                {comedianNotes.map((note) => {
                  const info = categoryInfo[note.category];
                  return (
                    <motion.div
                      key={note.id}
                      layout
                      className={`border rounded-lg p-3 space-y-1.5 ${info.color}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600">
                          {info.emoji} {info.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {formatDate(note.updatedAt)}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => setEditingNoteId(note.id)}
                            className="text-xs text-gray-400 hover:text-gray-600 px-1"
                          >
                            編集
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => deleteNote(note.id)}
                            className="text-xs text-gray-400 hover:text-red-500 px-1"
                          >
                            削除
                          </motion.button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 space-y-4">
              <p className="text-4xl">📝</p>
              <p className="text-gray-500">
                {notes.length === 0
                  ? "まだメモがありません"
                  : "該当するメモが見つかりません"}
              </p>
              {notes.length === 0 && (
                <p className="text-sm text-gray-400">
                  各期の詳細ページから、芸人ごとにメモを追加できます。
                  <br />
                  <Link href="/osaka/1" className="text-yoshimoto-red hover:underline">
                    大阪校1期を見てみる →
                  </Link>
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {editTarget && (
        <NoteModal
          isOpen={!!editingNoteId}
          onClose={() => setEditingNoteId(null)}
          onSave={(category, content) => {
            updateNote(editTarget.id, content, category);
            setEditingNoteId(null);
          }}
          comedianName={editTarget.comedianName}
          editNote={editTarget}
        />
      )}
    </div>
  );
}
