// src/lib/auth.ts
import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      // 這裡定義 credentials 的型別結構，讓 TS 知道會有 email 和 password
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 這裡不需要寫 : any，NextAuth 會自動推導
        // 但我們要檢查 credentials 是否存在
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        // 尋找使用者
        const user = await User.findOne({ email: credentials.email });

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      // 第一次登入時，user 物件會有資料，這時把 id 存入 token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // 使用 (token.id as string) 告訴 TS 這是字串
        // 雖然 session.user 還是會有一條小紅線，但這比 any 安全且簡單得多
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
  },
};
