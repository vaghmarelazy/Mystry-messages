import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        // email: { label: "Email", type: "text", placeholder: "Email" },
        identifier: {
          label: "Email/Username",
          type: "text",
          placeholder: "Email or Username",
        },
        password: { label: "Password", type: "password" },
      },
      // async authorize(credentials: {
      //   identifier: string;
      //   password: string;
      // }): Promise<User | null> {
      //   await dbConnect();
      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined
      ) {
        if (!credentials) return null;
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          }).lean();
          // const plainUser = user?.toObject()
          // const plainUser = {...user._doc}
          // plainUser?.isVerified
          if (!user) {
            throw new Error("No User found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please Verify account first");
          }
          const isPasswordCurrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCurrect) {
            return {
              id:user._id.toString(),
              username: user.username,
              email: user.email,
              verifyCode: user.verifyCode,
              verifyCodeExpiry: user.verifyCodeExpiry,
              isVerified: user.isVerified,
              isAcceptingMessage: user.isAcceptingMessage,
              messages: user.messages,
            };
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
