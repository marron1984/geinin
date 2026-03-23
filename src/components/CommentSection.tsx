"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getComments,
  addComment,
  deleteComment,
  getSavedNickname,
  type Comment,
} from "@/lib/comments";

export default function CommentSection({ target }: { target: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState("");
  const [body, setBody] = useState("");
  const [mounted, setMounted] = useState(false);

  const reload = useCallback(() => {
    setComments(getComments(target));
  }, [target]);

  useEffect(() => {
    setMounted(true);
    setNickname(getSavedNickname());
    reload();
  }, [reload]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = nickname.trim() || "匿名";
    if (!body.trim()) return;
    addComment(name, body.trim(), target);
    setBody("");
    reload();
  };

  const handleDelete = (id: string) => {
    deleteComment(id);
    reload();
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
        コメント ({comments.length})
      </h3>

      {/* 投稿フォーム */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="ニックネーム（空欄なら匿名）"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-yoshimoto-red/30"
        />
        <textarea
          placeholder="コメントを入力..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-yoshimoto-red/30 resize-none"
        />
        <button
          type="submit"
          disabled={!body.trim()}
          className="bg-yoshimoto-red text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-yoshimoto-red-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          投稿する
        </button>
      </form>

      {/* コメント一覧 */}
      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">
            まだコメントはありません
          </p>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                {c.nickname}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatCommentDate(c.createdAt)}
                </span>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  title="削除"
                >
                  ✕
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words">
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatCommentDate(iso: string): string {
  const d = new Date(iso);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return `${m}/${day} ${h}:${min}`;
}
