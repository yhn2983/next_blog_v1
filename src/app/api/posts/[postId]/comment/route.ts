import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // 確保路徑正確
import connectDB from "@/lib/db";
import { Post } from "@/models/Post"; // 確認是具名還是預設匯出

export async function POST(
  req: Request,
  { params }: { params: { postId: string } | Promise<{ postId: string }> }
) {
  try {
    await connectDB();

    // 兼容 Next.js 15 的 params 處理
    const resolvedParams = params instanceof Promise ? await params : params;
    const postId = resolvedParams.postId;

    const session = await getServerSession(authOptions);
    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "留言內容不能為空" }, { status: 400 });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            userId: session?.user?.id || "anonymous",
            text: text,
            createdAt: new Date(),
          },
        },
      },
      { new: true } // 回傳更新後的文件
    );

    if (!updatedPost) {
      return NextResponse.json({ error: "找不到貼文" }, { status: 404 });
    }

    return NextResponse.json(updatedPost, { status: 201 });
  } catch (error) {
    console.error("留言 API 錯誤:", error);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
