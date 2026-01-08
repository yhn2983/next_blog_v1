import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Post } from "@/models/Post";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    await connectDB();
    const { postId } = await params;
    const session = await getServerSession(authOptions);

    // 1. 檢查是否登入
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 });
    }

    // 2. 找出該貼文
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "找不到貼文" }, { status: 404 });
    }

    // 3. 權限檢查：只有作者本人可以刪除
    // 注意：確保資料庫裡的 authorId 跟 session 裡的 id 格式一致
    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "權限不足，你不是作者" },
        { status: 403 }
      );
    }

    // 4. 執行刪除
    await Post.findByIdAndDelete(postId);

    return NextResponse.json({ message: "刪除成功" });
  } catch (error) {
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
