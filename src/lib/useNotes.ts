"use client";

import { useState, useEffect, useCallback } from "react";
import { ComedianNote, NoteCategory } from "./types";

const STORAGE_KEY = "nsc-comedian-notes";

function loadNotes(): ComedianNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: ComedianNote[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useNotes() {
  const [notes, setNotes] = useState<ComedianNote[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setNotes(loadNotes());
    setLoaded(true);
  }, []);

  const addNote = useCallback(
    (
      comedianName: string,
      school: "osaka" | "tokyo",
      classNumber: number,
      category: NoteCategory,
      content: string
    ) => {
      const now = new Date().toISOString();
      const note: ComedianNote = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        comedianName,
        school,
        classNumber,
        category,
        content,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => {
        const updated = [note, ...prev];
        saveNotes(updated);
        return updated;
      });
      return note;
    },
    []
  );

  const updateNote = useCallback((id: string, content: string, category?: NoteCategory) => {
    setNotes((prev) => {
      const updated = prev.map((n) =>
        n.id === id
          ? { ...n, content, updatedAt: new Date().toISOString(), ...(category ? { category } : {}) }
          : n
      );
      saveNotes(updated);
      return updated;
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveNotes(updated);
      return updated;
    });
  }, []);

  const getNotesForComedian = useCallback(
    (comedianName: string) => notes.filter((n) => n.comedianName === comedianName),
    [notes]
  );

  const getNotesForClass = useCallback(
    (school: "osaka" | "tokyo", classNumber: number) =>
      notes.filter((n) => n.school === school && n.classNumber === classNumber),
    [notes]
  );

  return { notes, loaded, addNote, updateNote, deleteNote, getNotesForComedian, getNotesForClass };
}
