// src/app/api/register/route.ts
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. 基礎檢查
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "所有欄位皆為必填" },
        { status: 400 }
      );
    }

    await connectDB();

    // 2. 檢查 Email 是否已被註冊
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: "此 Email 已被註冊" },
        { status: 400 }
      );
    }

    // 3. 加密密碼 (雜湊 Hashing)
    // 這裡的 10 是 saltRounds，數值越高越安全但運算越久，10 是業界標準
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 存入資料庫
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "註冊成功", user: { id: newUser._id, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("註冊錯誤:", error);
    return NextResponse.json({ message: "伺服器發生錯誤" }, { status: 500 });
  }
}
