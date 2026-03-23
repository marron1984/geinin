"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotes } from "@/lib/useNotes";
import { NoteCategory } from "@/lib/types";
import NoteModal from "./NoteModal";

const categoryInfo: Record<NoteCategory, { label: string; emoji: string; color: string }> = {
  family: { label: "家族・背景", emoji: "👨‍👩‍👧", color: "bg-pink-50 border-pink-200" },
  neta: { label: "ネタ・芸風", emoji: "🎤", color: "bg-blue-50 border-blue-200" },
  schedule: { label: "観劇予定", emoji: "📅", color: "bg-orange-50 border-orange-200" },
  impression: { label: "感想", emoji: "💭", color: "bg-green-50 border-green-200" },
  other: { label: "その他", emoji: "📝", color: "bg-gray-50 border-gray-200" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

interface ComedianNotesProps {
  comedianName: string;
  school: "osaka" | "tokyo";
  classNumber: number;
}

export default function ComedianNotes({ comedianName, school, classNumber }: ComedianNotesProps) {
  const { getNotesForComedian, addNote, updateNote, deleteNote, loaded } = useNotes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);

  if (!loaded) return null;

  const notes = getNotesForComedian(comedianName);
  const editTarget = editingNote ? notes.find((n) => n.id === editingNote) : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700">
          マイメモ {notes.length > 0 && <span className="text-gray-400">({notes.length})</span>}
        </h3>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setEditingNote(null);
            setIsModalOpen(true);
          }}
          className="text-xs px-3 py-1.5 bg-yoshimoto-red text-white rounded-full hover:bg-yoshimoto-red-dark active:bg-yoshimoto-red-dark"
        >
          + メモ追加
        </motion.button>
      </div>

      <AnimatePresence>
        {notes.map((note) => {
          const info = categoryInfo[note.category];
          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`border rounded-lg p-3 space-y-1.5 ${info.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">
                  {info.emoji} {info.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{formatDate(note.updatedAt)}</span>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => {
                      setEditingNote(note.id);
                      setIsModalOpen(true);
                    }}
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
      </AnimatePresence>

      {notes.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">
          まだメモがありません。「+ メモ追加」から記録を始めましょう。
        </p>
      )}

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        onSave={(category, content) => {
          if (editTarget) {
            updateNote(editTarget.id, content, category);
          } else {
            addNote(comedianName, school, classNumber, category, content);
          }
        }}
        comedianName={comedianName}
        editNote={editTarget}
      />
    </div>
  );
}
