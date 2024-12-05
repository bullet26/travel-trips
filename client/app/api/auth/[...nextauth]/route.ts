import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { fetcher } from 'api/index'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'email', required: true },
        password: { label: 'password', type: 'password', required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }
        const authData = await fetcher({
          url: `auth/login`,
          method: 'POST',
          body: credentials,
        })

        const accessToken = authData?.accessToken || null

        if (accessToken) {
          const user = await fetcher({
            url: `users/me`,
            token: accessToken,
          })

          if (user && accessToken) {
            return { ...user, accessToken, accessTokenExpires: authData.accessTokenExpires }
          }
        }

        return null
      },
    }),
    CredentialsProvider({
      id: 'google',
      name: 'Google',
      credentials: {
        accessToken: { label: 'accessToken', type: 'string', required: true },
        accessTokenExpires: { label: 'accessTokenExpires', type: 'Date', required: true },
      },

      async authorize(credentials) {
        if (!credentials?.accessToken || !credentials.accessTokenExpires) {
          return null
        }

        const accessToken = credentials?.accessToken || null

        if (accessToken) {
          const user = await fetcher({
            url: `users/me`,
            token: accessToken,
          })

          if (user && accessToken) {
            return { ...user, accessToken, accessTokenExpires: credentials.accessTokenExpires }
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user?.accessToken
        token.accessTokenExpires = user?.accessTokenExpires
      }

      if (Date.now() > token.accessTokenExpires) {
        const authData = await fetcher({
          url: `auth/refresh-token`,
          method: 'POST',
        })
        token.accessToken = authData?.accessToken
        token.expired = authData?.expired
        return token
      }

      return token
    },
    async session({ session, token, user }) {
      if (token?.accessToken && typeof token.accessToken == 'string') {
        session.accessToken = token.accessToken
      }

      console.log(user, 'role: stringrole: stringuserrolerole: string')
      session.accessTokenExpires = token.accessTokenExpires

      return session
    },
  },
  pages: {
    newUser: '/registration',
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
