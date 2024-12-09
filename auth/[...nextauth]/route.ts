import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { fetcher } from 'api/index';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'email', required: true },
                password: { label: 'password', required: true },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }
                const authData = await fetcher({
                    url: `auth/login`,
                    method: 'POST',
                    body: credentials,
                });

                const accessToken = authData?.accessToken || null;

                if (accessToken) {
                    const user = await fetcher({
                        url: `users/me`,
                        token: accessToken,
                    });

                    if (user && accessToken) {
                        return { ...user, accessToken, accessTokenExpires: authData.accessTokenExpires };
                    }
                }

                return null;
            },
        }),
        ,
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user?.accessToken;
                token.accessTokenExpires = user?.accessTokenExpires;
                token.role = user?.role;
            }

            if (!!token.accessTokenExpires && Date.now() >= (token.accessTokenExpires as number)) {
                const authData = await fetcher({
                    url: `auth/refresh-token`,
                    method: 'POST',
                });
                token.accessToken = authData?.accessToken;
                token.accessTokenExpires = authData?.accessTokenExpires;
                return token;
            }

            return token;
        },
        async session({ session, token }) {
            if (token?.accessToken && typeof token.accessToken == 'string') {
                session.accessToken = token.accessToken;
            }

            if (token?.accessTokenExpires && typeof token.accessTokenExpires == 'number') {
                session.accessTokenExpires = token.accessTokenExpires;
            }

            if (token?.role && typeof token.role == 'string') {
                session.role = token.role;
            }

            return session;
        },
    },
    pages: {
        newUser: '/registration',
        signIn: '/login',
        error: '/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
