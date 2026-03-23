"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useNotes } from "@/lib/useNotes";
import { useSchedules } from "@/lib/useSchedules";
import { getAllComedians, ComedianEntry } from "@/lib/data";
import { NoteCategory } from "@/lib/types";

// --- メモ用定数 ---
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

function formatScheduleDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getMonth() + 1}/${d.getDate()}(${weekdays[d.getDay()]})`;
}

type Tab = "notes" | "schedule";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("notes");
  const { notes, loaded: notesLoaded, addNote, updateNote, deleteNote } = useNotes();
  const { schedules, loaded: schedulesLoaded, addSchedule, toggleDone, deleteSchedule } = useSchedules();
  const allComedians = useMemo(() => getAllComedians(), []);

  const loaded = notesLoaded && schedulesLoaded;

  if (!loaded) {
    return <div className="text-center py-12 text-gray-400">読み込み中...</div>;
  }

  return (
    <div className="space-y-4">
      {/* ヘッダー + タブ */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">マイページ</h1>
        <div className="flex gap-0 mt-3 border-b border-gray-200">
          {([
            { key: "notes" as Tab, label: "メモ", emoji: "📝", count: notes.length },
            { key: "schedule" as Tab, label: "観劇予定", emoji: "🎭", count: schedules.filter((s) => !s.done).length },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-2.5 text-sm font-medium ${
                activeTab === tab.key ? "text-yoshimoto-red" : "text-gray-400"
              }`}
            >
              {tab.emoji} {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1 text-xs ${activeTab === tab.key ? "text-yoshimoto-red/60" : "text-gray-300"}`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="mypageTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-yoshimoto-red"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "notes" ? (
        <NotesTab
          notes={notes}
          allComedians={allComedians}
          addNote={addNote}
          updateNote={updateNote}
          deleteNote={deleteNote}
        />
      ) : (
        <ScheduleTab
          schedules={schedules}
          addSchedule={addSchedule}
          toggleDone={toggleDone}
          deleteSchedule={deleteSchedule}
        />
      )}
    </div>
  );
}

// ================================
// メモタブ
// ================================
function NotesTab({
  notes,
  allComedians,
  addNote,
  updateNote,
  deleteNote,
}: {
  notes: ReturnType<typeof useNotes>["notes"];
  allComedians: ComedianEntry[];
  addNote: ReturnType<typeof useNotes>["addNote"];
  updateNote: ReturnType<typeof useNotes>["updateNote"];
  deleteNote: ReturnType<typeof useNotes>["deleteNote"];
}) {
  const [comedianQuery, setComedianQuery] = useState("");
  const [selectedComedian, setSelectedComedian] = useState<ComedianEntry | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<NoteCategory>("impression");
  const [content, setContent] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [noteSearch, setNoteSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<NoteCategory>("impression");

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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSave = () => {
    if (!selectedComedian || !content.trim()) return;
    addNote(selectedComedian.name, selectedComedian.school, selectedComedian.classNumber, category, content.trim());
    setContent("");
  };

  const handleEditSave = (id: string) => {
    if (!editContent.trim()) return;
    updateNote(id, editContent.trim(), editCategory);
    setEditingId(null);
  };

  const selectComedian = (c: ComedianEntry) => {
    setSelectedComedian(c);
    setComedianQuery(c.name);
    setShowSuggestions(false);
  };

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

  return (
    <div className="space-y-5">
      {/* 書くエリア */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
        <p className="text-sm font-bold text-gray-700">コメントを書く</p>
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
                      <span className="text-xs text-gray-400 ml-1">({c.members.join("・")})</span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
        <div className="flex gap-2 items-end">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={selectedComedian ? `${selectedComedian.name}について...` : "まず上で芸人を選んでください"}
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

      {/* メモ一覧 */}
      <div className="space-y-3">
        <p className="text-sm font-bold text-gray-700">
          メモ一覧
          {notes.length > 0 && <span className="text-gray-400 font-normal ml-1">({notes.length}件)</span>}
        </p>
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
                    filterCategory === opt.key ? "bg-yoshimoto-red text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {"emoji" in opt ? `${opt.emoji} ` : ""}{opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
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
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <Link
                        href={`/${note.school}/${note.classNumber}`}
                        className="text-sm font-bold text-gray-800 hover:text-yoshimoto-red"
                      >
                        {note.comedianName}
                      </Link>
                      <span className="text-xs text-gray-400 ml-1.5">{info.emoji} {info.label}</span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(note.updatedAt)}</span>
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex gap-1 flex-wrap">
                        {categoryOptions.map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => setEditCategory(opt.key)}
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              editCategory === opt.key ? "bg-yoshimoto-red text-white" : "bg-white/70 text-gray-500"
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
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs text-gray-500 bg-white rounded-lg border border-gray-200">やめる</button>
                        <button onClick={() => handleEditSave(note.id)} className="px-3 py-1.5 text-xs text-white bg-yoshimoto-red rounded-lg">更新</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                      <div className="flex gap-3 mt-2 justify-end">
                        <button
                          onClick={() => { setEditingId(note.id); setEditContent(note.content); setEditCategory(note.category); }}
                          className="text-xs text-gray-400 hover:text-gray-600 py-1"
                        >編集</button>
                        <button onClick={() => deleteNote(note.id)} className="text-xs text-gray-400 hover:text-red-500 py-1">削除</button>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 space-y-3">
              <p className="text-3xl">📝</p>
              {notes.length === 0 ? (
                <>
                  <p className="text-sm text-gray-500">まだメモがありません</p>
                  <p className="text-xs text-gray-400">上の検索欄から芸人を選んで、コメントを書いてみましょう</p>
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

// ================================
// 観劇予定タブ
// ================================
function ScheduleTab({
  schedules,
  addSchedule,
  toggleDone,
  deleteSchedule,
}: {
  schedules: ReturnType<typeof useSchedules>["schedules"];
  addSchedule: ReturnType<typeof useSchedules>["addSchedule"];
  toggleDone: ReturnType<typeof useSchedules>["toggleDone"];
  deleteSchedule: ReturnType<typeof useSchedules>["deleteSchedule"];
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [memo, setMemo] = useState("");
  const [comediansText, setComediansText] = useState("");
  const [showDone, setShowDone] = useState(false);

  const handleAdd = () => {
    if (!title.trim() || !date) return;
    addSchedule({
      title: title.trim(),
      date,
      venue: venue.trim(),
      memo: memo.trim(),
      comedians: comediansText
        .split(/[,、\s]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setTitle("");
    setDate("");
    setVenue("");
    setMemo("");
    setComediansText("");
    setShowForm(false);
  };

  const upcoming = schedules
    .filter((s) => !s.done)
    .sort((a, b) => a.date.localeCompare(b.date));
  const done = schedules
    .filter((s) => s.done)
    .sort((a, b) => b.date.localeCompare(a.date));

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-4">
      {/* 追加ボタン / フォーム */}
      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.button
            key="add-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="w-full py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 active:bg-gray-50"
          >
            + 観劇予定を追加
          </motion.button>
        ) : (
          <motion.div
            key="add-form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3"
          >
            <p className="text-sm font-bold text-gray-700">観劇予定を追加</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="公演名・ライブ名"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-yoshimoto-red focus:ring-2 focus:ring-yoshimoto-red/20 outline-none text-sm text-gray-800"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">日付</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-yoshimoto-red outline-none text-sm text-gray-800"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">会場</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="なんばグランド花月"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-yoshimoto-red outline-none text-sm text-gray-800"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">出演芸人（カンマ区切り）</label>
              <input
                type="text"
                value={comediansText}
                onChange={(e) => setComediansText(e.target.value)}
                placeholder="ダウンタウン、千鳥、かまいたち"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-yoshimoto-red outline-none text-sm text-gray-800"
              />
            </div>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="メモ（座席、持ち物など）"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-yoshimoto-red outline-none text-sm text-gray-800 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-lg active:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                onClick={handleAdd}
                disabled={!title.trim() || !date}
                className="flex-1 py-2.5 text-sm text-white bg-yoshimoto-red rounded-lg active:bg-yoshimoto-red-dark disabled:opacity-30"
              >
                追加
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 今後の予定 */}
      {upcoming.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-700">
            今後の予定 <span className="text-gray-400 font-normal">({upcoming.length}件)</span>
          </p>
          <AnimatePresence>
            {upcoming.map((s) => {
              const isPast = s.date < today;
              return (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className={`bg-white border rounded-lg p-3 ${isPast ? "border-red-200 bg-red-50/30" : "border-gray-100"}`}
                >
                  <div className="flex items-start gap-3">
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => toggleDone(s.id)}
                      className="mt-0.5 w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 active:border-yoshimoto-red flex items-center justify-center"
                    >
                    </motion.button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-bold text-gray-800">{s.title}</p>
                        <button
                          onClick={() => deleteSchedule(s.id)}
                          className="text-xs text-gray-300 hover:text-red-400 flex-shrink-0 py-0.5"
                        >
                          削除
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-gray-500">
                        <span className={isPast ? "text-red-500 font-medium" : ""}>
                          📅 {formatScheduleDate(s.date)}
                          {isPast && " (過ぎてます)"}
                        </span>
                        {s.venue && <span>📍 {s.venue}</span>}
                      </div>
                      {s.comedians.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {s.comedians.map((name) => (
                            <span
                              key={name}
                              className="text-xs px-1.5 py-0.5 bg-yoshimoto-red/5 text-yoshimoto-red rounded-full border border-yoshimoto-red/10"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                      {s.memo && (
                        <p className="text-xs text-gray-500 mt-1.5 whitespace-pre-wrap">{s.memo}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-8 space-y-2">
            <p className="text-3xl">🎭</p>
            <p className="text-sm text-gray-500">観劇予定がありません</p>
            <p className="text-xs text-gray-400">ライブや劇場の予定を登録しましょう</p>
          </div>
        )
      )}

      {/* 観劇済み */}
      {done.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowDone(!showDone)}
            className="text-sm text-gray-400 flex items-center gap-1"
          >
            <span className="text-xs">{showDone ? "▼" : "▶"}</span>
            観劇済み ({done.length}件)
          </button>
          <AnimatePresence>
            {showDone &&
              done.map((s) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 border border-gray-100 rounded-lg p-3"
                >
                  <div className="flex items-start gap-3">
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => toggleDone(s.id)}
                      className="mt-0.5 w-5 h-5 rounded-full border-2 border-yoshimoto-red bg-yoshimoto-red flex-shrink-0 flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.button>
                    <div className="flex-1 min-w-0 opacity-60">
                      <p className="text-sm font-medium text-gray-600 line-through">{s.title}</p>
                      <div className="flex flex-wrap items-center gap-x-3 text-xs text-gray-400 mt-0.5">
                        <span>📅 {formatScheduleDate(s.date)}</span>
                        {s.venue && <span>📍 {s.venue}</span>}
                      </div>
                      {s.comedians.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {s.comedians.map((name) => (
                            <span key={name} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-full">
                              {name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteSchedule(s.id)}
                      className="text-xs text-gray-300 hover:text-red-400 flex-shrink-0"
                    >
                      削除
                    </button>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
