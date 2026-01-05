import connectDB from "@/lib/db";
import { Post } from "@/models/Post";
import { NextResponse } from "next/server";

// GET: 取得所有貼文
export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts, { status: 200 }); // 200 代表 OK
  } catch (error) {
    console.error("GET 錯誤:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 } // 500 代表 Internal Server Error (伺服器錯誤)
    );
  }
}

// POST: 新增貼文
export async function POST(req: Request) {
  try {
    await connectDB();
    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 } // 400 代表 Bad Request (用戶端錯誤)
      );
    }
    const newPost = await Post.create({ title, content });
    return NextResponse.json(newPost, { status: 201 }); // 201 代表 Created
  } catch (error) {
    console.error("POST 錯誤:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 } // 500 代表 Internal Server Error (伺服器錯誤)
    );
  }
}
