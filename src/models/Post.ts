// src/models/Post.ts
import mongoose, { Schema, model, models } from "mongoose";

// 定義資料結構
const PostSchema = new Schema(
  {
    title: { type: String, required: [true, "請輸入標題"] },
    content: { type: String, required: [true, "請輸入內容"] },
    author: { type: String, default: "匿名用戶" },
    authorEmail: { type: String, default: null },
    isAnonymous: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "post_db",
  } // 這會自動幫你加上 createdAt 和 updatedAt 時間戳記
);

// 如果模型已經存在就使用舊的，否則建立新的 (解決 Next.js 重複編譯問題)
export const Post = models.Post || model("Post", PostSchema);
