"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotes } from "@/lib/useNotes";
import { NoteCategory } from "@/lib/types";
import NoteModal from "./NoteModal";

const categoryInfo: Record<NoteCategory, { label: string; emoji: string; color: string }> = {
  family: { label: "背景", emoji: "👨‍👩‍👧", color: "bg-pink-50 border-pink-200" },
  neta: { label: "ネタ", emoji: "🎤", color: "bg-blue-50 border-blue-200" },
  schedule: { label: "予定", emoji: "📅", color: "bg-orange-50 border-orange-200" },
  impression: { label: "感想", emoji: "💭", color: "bg-green-50 border-green-200" },
  other: { label: "他", emoji: "📝", color: "bg-gray-50 border-gray-200" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          メモ {notes.length > 0 && `(${notes.length})`}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setEditingNote(null);
            setIsModalOpen(true);
          }}
          className="text-xs px-2.5 py-1 bg-yoshimoto-red text-white rounded-full active:bg-yoshimoto-red-dark"
        >
          + 追加
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
              className={`border rounded-lg px-3 py-2 ${info.color}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">
                  {info.emoji} {info.label} ・ {formatDate(note.updatedAt)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingNote(note.id);
                      setIsModalOpen(true);
                    }}
                    className="text-xs text-gray-400 active:text-gray-600 py-0.5"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-xs text-gray-400 active:text-red-500 py-0.5"
                  >
                    削除
                  </button>
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
        <p className="text-xs text-gray-400 text-center py-2">
          まだメモなし
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
