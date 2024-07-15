import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt_decode from 'jwt-decode';
import { routeLogin } from './types/consts/routes';

const credentialsConfig = CredentialsProvider({
  name: 'Credentials',

  credentials: {
    usernameOrEmail: { label: 'Username', type: 'text', placeholder: 'max' },
    password: { label: 'Password', type: 'password' },
  },

  async authorize(credentials): Promise<any> {
    if (credentials?.usernameOrEmail && credentials?.password) {
      const body = JSON.stringify({ usernameOrEmail: credentials.usernameOrEmail, password: credentials.password });
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/login`, {
        method: 'POST',
        body: body,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseBody = await response.json();
      if (responseBody) {
        return responseBody;
      }
    }

    return null;
  },
});

const config = {
  providers: [credentialsConfig],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: routeLogin,
  },

  callbacks: {
    async signIn(auth: any) {
      if (auth?.user?.accessToken) return true;

      return false;
    },

    jwt: async ({ token, user, trigger, session }) => {
      // if (trigger === 'update') {
      //   return { ...token, ...session.user };
      // }

      return { ...token, ...user };
    },

    session({ session, token }: { session: any; token: any }) {
      const decoded: any = jwt_decode(token.accessToken);
      session.user = { username: decoded.username, imageUrl: decoded.imageUrl, accessToken: token.accessToken } as any;
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
