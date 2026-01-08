import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Post } from "@/models/Post";
import { NextResponse } from "next/server";

// GET: 取得所有貼文
export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("GET 錯誤:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST: 新增貼文
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // 🔍 這裡可以在終端機看到 Session 是否真的有 id
    //console.log("當前登入者資訊:", session?.user);

    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "標題與內容為必填" }, { status: 400 });
    }

    // 🚀 建立貼文
    const newPost = await Post.create({
      title,
      content,
      // 如果有 session 則用 session 資料，否則用預設值
      author: session?.user?.name || "匿名用戶",
      // 🔑 重點：如果 session 沒抓到 ID，就給它字串 "anonymous" 避免 Mongoose 報錯
      authorId: session?.user?.id || "anonymous",
      authorEmail: session?.user?.email || null,
      isAnonymous: !session,
      likes: [], // 預設空陣列避免前端錯誤
      comments: [], // 預設空陣列避免前端錯誤
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("GET 錯誤:", error);

    // 🔴 即使錯誤也回傳空陣列，防止前端 .filter() 崩潰
    // 可以在 Header 帶入錯誤訊息供除錯
    return NextResponse.json([], {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
