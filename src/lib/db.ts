// src/lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.mongodbUri!;

if (!MONGODB_URI) {
  throw new Error("請在 .env.local 中定義 MONGODB_URI");
}

// 這裡是用來在 Next.js 開發模式下防止重複連線的 Cache
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("🚀 MongoDB 已連線 (Mongoose)");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
