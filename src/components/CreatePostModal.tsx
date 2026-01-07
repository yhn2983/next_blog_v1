"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
}: CreatePostModalProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleInternalSubmit = () => {
    if (!title || !content) return;
    onSubmit(title, content); // 把資料傳給父組件
    setTitle(""); // 清空內部狀態
    setContent("");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* 彈窗本體 */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-bold mb-4 dark:text-white">建立新貼文</h3>
        {session
          ? `發文身分：${session.user?.name}`
          : "⚠️ 您尚未登入，將以匿名身分發布"}
        <input
          type="text"
          placeholder="標題"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-50 dark:bg-zinc-800 dark:text-white rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          rows={4}
          placeholder="內容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-gray-50 dark:bg-zinc-800 dark:text-white rounded-xl px-4 py-3 mb-4 outline-none resize-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 dark:bg-zinc-800 dark:text-white font-bold py-3 rounded-xl hover:bg-gray-200 transition"
          >
            取消
          </button>
          <button
            onClick={handleInternalSubmit}
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
          >
            發布
          </button>
        </div>
      </div>
    </div>
  );
}
