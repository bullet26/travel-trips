import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string
    accessTokenExpires: Date
    user: { role: string } & DefaultSession['user']
  }

  interface User {
    role: string
    accessToken: string
    accessTokenExpires: Date
  }
}
