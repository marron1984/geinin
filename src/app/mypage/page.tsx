"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getComments, deleteComment, type Comment } from "@/lib/comments";
import CommentSection from "@/components/CommentSection";

export default function MyPage() {
  const [myComments, setMyComments] = useState<Comment[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMyComments(getComments());
  }, []);

  const handleDelete = (id: string) => {
    deleteComment(id);
    setMyComments(getComments());
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-yoshimoto-red">
          トップ
        </Link>
        <span>/</span>
        <span>マイページ</span>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          マイページ
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          あなたの投稿コメント管理
        </p>
      </div>

      {/* 投稿したコメント一覧 */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          投稿したコメント一覧
        </h2>
        {mounted && myComments.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">
            まだコメントはありません。
            <br />
            各ページのコメント欄から投稿してみましょう！
          </p>
        )}
        {mounted && (
          <div className="space-y-3">
            {myComments.map((c) => (
              <div
                key={c.id}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-yoshimoto-red/10 text-yoshimoto-red px-2 py-0.5 rounded">
                        {c.target}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                      {c.body}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 掲示板 */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
          自由掲示板
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          芸人に関する話題を自由に語りましょう（データはブラウザに保存されます）
        </p>
        <CommentSection target="free-board" />
      </section>
    </div>
  );
}
