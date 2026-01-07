"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; // 引入 NextAuth 的登入函數
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 使用 NextAuth 的 signIn 函數
    // "credentials" 對應到我們在 route.ts 設定的名稱
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false, // 阻止自動跳轉，讓我們能手動處理錯誤訊息
    });

    if (result?.error) {
      // 如果有錯誤（例如密碼錯、沒註冊），顯示給使用者看
      setError(result.error);
    } else {
      // 登入成功！導向首頁或後台
      router.push("/");
      router.refresh(); // 強制重新整理狀態
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="p-8 border rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6">會員登入</h1>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="密碼"
          className="w-full p-2 mb-6 border rounded"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          登入
        </button>
      </form>
    </div>
  );
}
