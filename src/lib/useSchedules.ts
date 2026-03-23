"use client";

import { useState, useEffect, useCallback } from "react";
import { TheaterSchedule } from "./types";

const STORAGE_KEY = "nsc-theater-schedules";

function load(): TheaterSchedule[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items: TheaterSchedule[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useSchedules() {
  const [schedules, setSchedules] = useState<TheaterSchedule[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSchedules(load());
    setLoaded(true);
  }, []);

  const addSchedule = useCallback(
    (data: Omit<TheaterSchedule, "id" | "done" | "createdAt">) => {
      const item: TheaterSchedule = {
        ...data,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        done: false,
        createdAt: new Date().toISOString(),
      };
      setSchedules((prev) => {
        const updated = [item, ...prev];
        save(updated);
        return updated;
      });
    },
    []
  );

  const updateSchedule = useCallback(
    (id: string, data: Partial<Omit<TheaterSchedule, "id" | "createdAt">>) => {
      setSchedules((prev) => {
        const updated = prev.map((s) => (s.id === id ? { ...s, ...data } : s));
        save(updated);
        return updated;
      });
    },
    []
  );

  const toggleDone = useCallback((id: string) => {
    setSchedules((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s));
      save(updated);
      return updated;
    });
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      save(updated);
      return updated;
    });
  }, []);

  return { schedules, loaded, addSchedule, updateSchedule, toggleDone, deleteSchedule };
}
