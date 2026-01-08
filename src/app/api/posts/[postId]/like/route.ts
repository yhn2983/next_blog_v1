// src/app/api/posts/[postId]/like/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Post } from "@/models/Post";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    await connectDB();
    const { postId } = await params;
    const session = await getServerSession(authOptions);
    console.log("Session User ID:", session?.user?.id);
    if (!session)
      return NextResponse.json({ error: "請先登入" }, { status: 401 });

    const userId = session?.user?.id || "anonymous";
    const post = await Post.findById(postId);
    console.log("Post Likes Array before:", post.likes);

    // 判斷是否已經按過讚
    const isLiked = post.likes?.includes(userId);
    const update = isLiked
      ? { $pull: { likes: userId } } // 已按讚 -> 移除
      : { $addToSet: { likes: userId } }; // 未按讚 -> 加入 ($addToSet 確保不重複)

    const updatedPost = await Post.findByIdAndUpdate(postId, update, {
      new: true,
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: "操作失敗" }, { status: 500 });
  }
}
