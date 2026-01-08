"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  author?: string;
  authorId: string;
  date?: string;
  initialComments?: Comment[];
  initialLikes?: string[];
}
interface Comment {
  userId: string;
  text: string;
  createdAt: string;
}

export default function PostCard({
  id,
  title,
  content,
  author = "匿名用戶",
  authorId,
  date = "剛剛",
  initialComments = [],
  initialLikes = [],
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false); // 控制留言區展開/收合
  const [commentText, setCommentText] = useState(""); // 儲存輸入框文字
  const [comments, setComments] = useState<Comment[]>(initialComments); // 儲存留言列表
  const [isSubmitting, setIsSubmitting] = useState(false); // 防止重複點擊發布

  const [likes, setLikes] = useState<string[]>(initialLikes || []); // 存 ID 陣列
  const [isLiking, setIsLiking] = useState(false); // 防止連點

  const { data: session } = useSession();
  const isAuthor =
    !!session?.user?.id && !!authorId && session.user.id === authorId;
  console.log("我的 ID (Session):", session?.user?.id);
  console.log("貼文作者的 ID (authorId):", authorId);
  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${id}/comment`, {
        // 使用傳入的 id
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      });

      if (res.ok) {
        const updatedPost = await res.json();
        // 直接用 API 回傳更新後的完整 comments 陣列更新 UI
        setComments(updatedPost.comments);
        setCommentText(""); // 清空輸入框
      }
    } catch (error) {
      console.error("留言失敗", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleLike = async () => {
    try {
      const res = await fetch(`/api/posts/${id}/like`, { method: "POST" });
      if (res.ok) {
        const updatedPost = await res.json();
        // 假設你在 PostCard 有控制 likes 的狀態
        setLikes(updatedPost.likes);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async () => {
    if (!confirm("確定要刪除這篇貼文嗎？")) return;

    try {
      const res = await fetch(`/api/posts/${id}/delete`, { method: "DELETE" });
      if (res.ok) {
        // 刪除成功後，通常要通知父組件重新獲取列表，或者直接隱藏該卡片
        window.location.reload(); // 最簡單的方法
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <article className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border dark:border-zinc-800 transition-all hover:shadow-md hover:border-blue-500/50 group">
      <div className="flex items-center gap-3 mb-4">
        {/* 用使用者名字的第一個字當頭像 */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm">
          {author[0]}
        </div>
        <div>
          <h4 className="font-bold text-sm dark:text-white">{author}</h4>
          <p className="text-xs text-gray-500">
            {new Date(date).toLocaleString("zh-TW")}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2 dark:text-white group-hover:text-blue-500 transition-colors">
        {title}
      </h2>

      <p className="text-gray-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
        {content}
      </p>

      <div className="pt-4 border-t dark:border-zinc-800 flex gap-6 text-sm text-gray-400">
        <button
          className={`flex items-center gap-1 transition-colors ${
            // 如果目前使用者在 likes 陣列裡，就變藍色
            session?.user?.id && likes.includes(session.user.id)
              ? "text-blue-500 font-bold"
              : "hover:text-blue-500"
          }`}
          onClick={handleLike}
          disabled={isLiking}
        >
          <span>👍</span>
          {/* ✅ 顯示按讚人數，如果是 0 就顯示 "讚"，否則顯示數字 */}
          {likes.length > 0 ? likes.length : ""} 讚
        </button>
        {/* +++ 修改：點擊會切換顯示狀態，並顯示留言數量 +++ */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 hover:text-blue-500 transition-colors"
        >
          <span>💬</span> 評論 ({comments.length})
        </button>
      </div>
      {showComments && (
        <div className="mt-4 pt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          {/* 1. 留言清單渲染 */}
          <div className="space-y-3">
            {comments.map((c, index) => (
              <div key={index} className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                  👤
                </div>
                <div className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-2 flex-1">
                  <p className="text-xs font-bold text-gray-500 mb-1">
                    某位路人
                  </p>
                  <p className="text-sm dark:text-zinc-300">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 2. 留言輸入框與發布按鈕 */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="寫下你的匿名評論..."
              className="flex-1 bg-gray-50 dark:bg-zinc-800 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleSubmitComment}
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "..." : "發布"}
            </button>
          </div>
        </div>
      )}
      {isAuthor && (
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-600 text-xs mt-2"
        >
          刪除貼文
        </button>
      )}
    </article>
  );
}
