"use client";

import Image from "next/image";

import { useState, useEffect } from "react";
import CreatePostModal from "@/components/CreatePostModal";
import PostCard from "@/components/PostCard";
import Navbar from "@/components/Navbar";

interface IPostComment {
  userId: string;
  text: string;
  createdAt: string;
}
// 定義貼文型別
interface Post {
  _id: string;
  title: string;
  content: string;
  author?: string;
  authorId: string; // 新增：刪除功能必備
  createdAt?: string;
  likes: string[]; // 確保這裡存在
  comments: IPostComment[]; // 使用改名後的型別
}

export default function Home() {
  // --- 1. 狀態管理 ---
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  // 1. 初次載入時抓取資料庫資料
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  // 2. 更新 handleAddPost 讓他打 API
  const handleAddPost = async (title: string, content: string) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const newPost = await res.json();
    setPosts([newPost, ...posts]); // 同步更新 UI
    setIsModalOpen(false);
  };

  // --- 2. 搜尋邏輯 (自動過濾) ---
  const filteredPosts = posts.filter((post) => {
    const title = post.title?.toLowerCase() || "";
    const content = post.content?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return title.includes(query) || content.includes(query);
  });

  // --- 3. 功能函數 ---

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* 導航欄 */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery} // 直接把 setState 傳下去
        onOpenModal={() => setIsModalOpen(true)}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="max-w-2xl mx-auto py-8 px-4">
        {/* 搜尋狀態提示 */}
        {searchQuery && (
          <div className="mb-6 text-sm text-gray-500 dark:text-gray-400 italic">
            正在顯示「
            <span className="text-blue-600 font-bold">{searchQuery}</span>
            」的搜尋結果...
          </div>
        )}

        {/* 貼文流：使用 map 渲染 */}
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <PostCard
                key={post._id || `temp-${index}`}
                id={post._id}
                title={post.title}
                content={post.content}
                author={post.author} // 這裡可以根據資料代入
                authorId={post.authorId}
                date={post.createdAt || ""}
                initialLikes={post.likes} // 這裡把資料庫的 likes 陣列傳進去
                initialComments={post.comments}
              />
            ))
          ) : (
            /* 無結果提示 */
            <div className="text-center py-20 text-gray-500">
              找不到相關貼文 🔍
            </div>
          )}
        </div>
      </main>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddPost}
      />
    </div>
  );
}
