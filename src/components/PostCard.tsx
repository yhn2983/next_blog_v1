"use client";

interface PostCardProps {
  title: string;
  content: string;
  author?: string; // 可選屬性
  date?: string; // 可選屬性
}

export default function PostCard({
  title,
  content,
  author = "匿名用戶",
  date = "剛剛",
}: PostCardProps) {
  return (
    <article className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border dark:border-zinc-800 transition-all hover:shadow-md hover:border-blue-500/50 group">
      <div className="flex items-center gap-3 mb-4">
        {/* 用使用者名字的第一個字當頭像 */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm">
          {author[0]}
        </div>
        <div>
          <h4 className="font-bold text-sm dark:text-white">{author}</h4>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2 dark:text-white group-hover:text-blue-500 transition-colors">
        {title}
      </h2>

      <p className="text-gray-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
        {content}
      </p>

      <div className="mt-4 pt-4 border-t dark:border-zinc-800 flex gap-6 text-sm text-gray-400">
        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
          <span>👍</span> 讚
        </button>
        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
          <span>💬</span> 評論
        </button>
      </div>
    </article>
  );
}
