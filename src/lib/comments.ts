export interface Comment {
  id: string;
  nickname: string;
  body: string;
  createdAt: string;
  /** target page, e.g. "nsc/osaka/1" or "news" */
  target: string;
}

const STORAGE_KEY = "geinin_comments";
const NICKNAME_KEY = "geinin_nickname";

export function getComments(target?: string): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all: Comment[] = JSON.parse(raw);
    if (target) return all.filter((c) => c.target === target);
    return all;
  } catch {
    return [];
  }
}

export function addComment(
  nickname: string,
  body: string,
  target: string
): Comment {
  const comment: Comment = {
    id: crypto.randomUUID(),
    nickname,
    body,
    createdAt: new Date().toISOString(),
    target,
  };
  const existing = getComments();
  existing.push(comment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  localStorage.setItem(NICKNAME_KEY, nickname);
  return comment;
}

export function deleteComment(id: string): void {
  const comments = getComments().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

export function getSavedNickname(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(NICKNAME_KEY) || "";
}
