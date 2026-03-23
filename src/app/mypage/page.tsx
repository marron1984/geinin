"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useNotes } from "@/lib/useNotes";
import { getAllComedians, ComedianEntry } from "@/lib/data";
import { NoteCategory } from "@/lib/types";

const categoryInfo: Record<NoteCategory, { label: string; emoji: string; color: string }> = {
  family: { label: "家族・背景", emoji: "👨‍👩‍👧", color: "bg-pink-50 border-pink-200" },
  neta: { label: "ネタ・芸風", emoji: "🎤", color: "bg-blue-50 border-blue-200" },
  schedule: { label: "観劇予定", emoji: "📅", color: "bg-orange-50 border-orange-200" },
  impression: { label: "感想", emoji: "💭", color: "bg-green-50 border-green-200" },
  other: { label: "その他", emoji: "📝", color: "bg-gray-50 border-gray-200" },
};

const categoryOptions: { key: NoteCategory; label: string; emoji: string }[] = [
  { key: "impression", label: "感想", emoji: "💭" },
  { key: "neta", label: "ネタ", emoji: "🎤" },
  { key: "schedule", label: "予定", emoji: "📅" },
  { key: "family", label: "背景", emoji: "👨‍👩‍👧" },
  { key: "other", label: "他", emoji: "📝" },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatDateFull(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export default function MyPage() {
  const { notes, loaded, addNote, updateNote, deleteNote } = useNotes();
  const allComedians = useMemo(() => getAllComedians(), []);

  // 芸人検索・選択
  const [comedianQuery, setComedianQuery] = useState("");
  const [selectedComedian, setSelectedComedian] = useState<ComedianEntry | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // メモ入力
  const [category, setCategory] = useState<NoteCategory>("impression");
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // フィルター
  const [filterCategory, setFilterCategory] = useState("all");
  const [noteSearch, setNoteSearch] = useState("");

  // 編集
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<NoteCategory>("impression");

  // 芸人候補
  const suggestions = useMemo(() => {
    if (!comedianQuery.trim()) return [];
    const q = comedianQuery.trim().toLowerCase();
    return allComedians
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.members && c.members.some((m) => m.toLowerCase().includes(q)))
      )
      .slice(0, 8);
  }, [comedianQuery, allComedians]);

  // 外側クリックで候補閉じる
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // メモ保存
  const handleSave = () => {
    if (!selectedComedian || !content.trim()) return;
    addNote(selectedComedian.name, selectedComedian.school, selectedComedian.classNumber, category, content.trim());
    setContent("");
    textareaRef.current?.focus();
  };

  // 編集保存
  const handleEditSave = (id: string) => {
    if (!editContent.trim()) return;
    updateNote(id, editContent.trim(), editCategory);
    setEditingId(null);
  };

  // 芸人選択
  const selectComedian = (c: ComedianEntry) => {
    setSelectedComedian(c);
    setComedianQuery(c.name);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  // フィルター済みノート
  const filtered = useMemo(() => {
    let result = notes;
    if (filterCategory !== "all") {
      result = result.filter((n) => n.category === filterCategory);
    }
    if (noteSearch.trim()) {
      const q = noteSearch.trim().toLowerCase();
      result = result.filter(
        (n) => n.comedianName.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    }
    return result;
  }, [notes, filterCategory, noteSearch]);

  if (!loaded) {
    return <div className="text-center py-12 text-gray-400">読み込み中...</div>;
  }

  return (
    <div className="space-y-5">
      {/* ヘッダー */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">マイページ</h1>
        <p className="text-xs text-gray-500 mt-0.5">芸人へのコメント・メモを記録</p>
      </div>

      {/* === 書く エリア === */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
        <p className="text-sm font-bold text-gray-700">コメントを書く</p>

        {/* 芸人検索 */}
        <div ref={searchRef} className="relative">
          <input
            type="text"
            value={comedianQuery}
            onChange={(e) => {
              setComedianQuery(e.target.value);
              setShowSuggestions(true);
              if (!e.target.value.trim()) setSelectedComedian(null);
            }}
            onFocus={() => comedianQuery.trim() && setShowSuggestions(true)}
            placeholder="芸人名で検索..."
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-yoshimoto-red focus:ring-2 focus:ring-yoshimoto-red/20 outline-none text-sm text-gray-800"
          />
          {selectedComedian && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {selectedComedian.school === "osaka" ? "大阪" : "東京"}{selectedComedian.classNumber}期
            </span>
          )}

          {/* 候補リスト */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-52 overflow-y-auto"
              >
                {suggestions.map((c) => (
                  <button
                    key={`${c.school}-${c.classNumber}-${c.name}`}
                    onClick={() => selectComedian(c)}
                    className="w-full text-left px-3 py-2.5 hover:bg-gray-50 active:bg-gray-100 border-b border-gray-50 last:border-b-0"
                  >
                    <span className="text-sm font-medium text-gray-800">{c.name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {c.school === "osaka" ? "大阪校" : "東京校"} {c.classNumber}期
                    </span>
                    {c.members && (
                      <span className="text-xs text-gray-400 ml-1">
                        ({c.members.join("・")})
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* カテゴリ選択 */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {categoryOptions.map((opt) => (
            <motion.button
              key={opt.key}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCategory(opt.key)}
              className={`relative flex-shrink-0 px-2.5 py-1.5 rounded-full text-xs font-medium ${
                category === opt.key ? "text-white" : "text-gray-600 bg-gray-100"
              }`}
            >
              {category === opt.key && (
                <motion.div
                  layoutId="writeCategoryBg"
                  className="absolute inset-0 bg-yoshimoto-red rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{opt.emoji} {opt.label}</span>
            </motion.button>
          ))}
        </div>

        {/* テキスト入力 + 送信 */}
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              selectedComedian
                ? `${selectedComedian.name}について...`
                : "まず上で芸人を選んでください"
            }
            disabled={!selectedComedian}
            rows={2}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-yoshimoto-red focus:ring-2 focus:ring-yoshimoto-red/20 outline-none text-sm text-gray-800 resize-none disabled:bg-gray-50 disabled:text-gray-400"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            disabled={!selectedComedian || !content.trim()}
            className="px-4 py-2 bg-yoshimoto-red text-white text-sm rounded-lg font-medium disabled:opacity-30 active:bg-yoshimoto-red-dark flex-shrink-0 min-h-[42px]"
          >
            保存
          </motion.button>
        </div>
      </div>

      {/* === メモ一覧 === */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-gray-700">
            メモ一覧
            {notes.length > 0 && <span className="text-gray-400 font-normal ml-1">({notes.length}件)</span>}
          </p>
        </div>

        {/* 検索 + フィルター */}
        {notes.length > 0 && (
          <div className="space-y-2">
            <input
              type="text"
              value={noteSearch}
              onChange={(e) => setNoteSearch(e.target.value)}
              placeholder="メモを検索..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-yoshimoto-red focus:ring-1 focus:ring-yoshimoto-red/20 outline-none text-xs text-gray-800"
            />
            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {[{ key: "all", label: "全て" }, ...categoryOptions].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFilterCategory(opt.key)}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs ${
                    filterCategory === opt.key
                      ? "bg-yoshimoto-red text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {"emoji" in opt ? `${opt.emoji} ` : ""}{opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ノート一覧 */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((note) => {
              const info = categoryInfo[note.category];
              const isEditing = editingId === note.id;

              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className={`border rounded-lg p-3 ${info.color}`}
                >
                  {/* ヘッダー行 */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <Link
                        href={`/${note.school}/${note.classNumber}`}
                        className="text-sm font-bold text-gray-800 hover:text-yoshimoto-red"
                      >
                        {note.comedianName}
                      </Link>
                      <span className="text-xs text-gray-400 ml-1.5">
                        {info.emoji} {info.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>

                  {isEditing ? (
                    /* 編集モード */
                    <div className="space-y-2">
                      <div className="flex gap-1 flex-wrap">
                        {categoryOptions.map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => setEditCategory(opt.key)}
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              editCategory === opt.key
                                ? "bg-yoshimoto-red text-white"
                                : "bg-white/70 text-gray-500"
                            }`}
                          >
                            {opt.emoji}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full px-2.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 resize-none outline-none focus:border-yoshimoto-red"
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 text-xs text-gray-500 bg-white rounded-lg border border-gray-200"
                        >
                          やめる
                        </button>
                        <button
                          onClick={() => handleEditSave(note.id)}
                          className="px-3 py-1.5 text-xs text-white bg-yoshimoto-red rounded-lg"
                        >
                          更新
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* 表示モード */
                    <>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                      <div className="flex gap-3 mt-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingId(note.id);
                            setEditContent(note.content);
                            setEditCategory(note.category);
                          }}
                          className="text-xs text-gray-400 hover:text-gray-600 py-1"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-xs text-gray-400 hover:text-red-500 py-1"
                        >
                          削除
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 space-y-3"
            >
              <p className="text-3xl">📝</p>
              {notes.length === 0 ? (
                <>
                  <p className="text-sm text-gray-500">まだメモがありません</p>
                  <p className="text-xs text-gray-400">
                    上の検索欄から芸人を選んで、コメントを書いてみましょう
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">該当するメモがありません</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
