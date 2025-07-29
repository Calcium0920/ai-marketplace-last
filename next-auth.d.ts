import NextAuth, { DefaultSession } from "next-auth"

// NextAuthのセッション型を拡張するよ
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string; // ここでidプロパティをstring型として追加する
      // DefaultSession.User の既存のプロパティ（name, email, imageなど）もちゃんと含まれるようにする
    } & DefaultSession['user']
  }
}