"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "nsc-oshi-list";

export interface OshiEntry {
  name: string;
  school: "osaka" | "tokyo";
  classNumber: number;
}

function load(): OshiEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items: OshiEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useOshi() {
  const [oshiList, setOshiList] = useState<OshiEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOshiList(load());
    setLoaded(true);
  }, []);

  const addOshi = useCallback((entry: OshiEntry) => {
    setOshiList((prev) => {
      if (prev.some((o) => o.name === entry.name)) return prev;
      const updated = [...prev, entry];
      save(updated);
      return updated;
    });
  }, []);

  const removeOshi = useCallback((name: string) => {
    setOshiList((prev) => {
      const updated = prev.filter((o) => o.name !== name);
      save(updated);
      return updated;
    });
  }, []);

  const isOshi = useCallback(
    (name: string) => oshiList.some((o) => o.name === name),
    [oshiList]
  );

  return { oshiList, loaded, addOshi, removeOshi, isOshi };
}
