"use client";

import { useSession, signOut } from "next-auth/react"; // 1. 引入 NextAuth
import Link from "next/link"; // 引入 Link 做導轉

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenModal: () => void;
  toggleDarkMode: () => void;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  onOpenModal,
  toggleDarkMode,
}: NavbarProps) {
  const { data: session, status } = useSession();
  return (
    <nav className="bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-blue-600 shrink-0">
          DevForum
        </Link>

        {/* 搜尋區塊 */}
        <div className="flex-1 max-w-lg mx-4 group">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)} // 關鍵：呼叫父組件傳來的函式
              className="w-full bg-gray-100 dark:bg-zinc-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-700 rounded-full py-2 pl-10 pr-4 outline-none transition-all dark:text-white"
              placeholder="搜尋貼文標題或內容..."
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 group-focus-within:text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")} // 清除搜尋
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
          >
            🌓
          </button>
          <button
            onClick={onOpenModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-700 transition"
          >
            發帖
          </button>
          {status === "authenticated" ? (
            <>
              <div className="flex items-center gap-3 ml-2 border-l pl-4 dark:border-zinc-700">
                <span className="text-sm font-medium dark:text-white">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })} // 2. 使用 signOut 函式登出
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  登出
                </button>
              </div>
            </>
          ) : status === "unauthenticated" ? (
            <>
              {/* 未登入：顯示登入與註冊按鈕 */}
              <Link
                href="/login"
                className="text-sm font-medium dark:text-white hover:text-blue-600 transition"
              >
                登入
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-700 transition"
              >
                註冊
              </Link>
            </>
          ) : (
            /* 讀取中狀態：可以放個簡單的 loading 或空白 */
            <div className="w-20 h-8 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-full"></div>
          )}
        </div>
      </div>
    </nav>
  );
}
