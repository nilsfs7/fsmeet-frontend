import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';
import {
  routeAccount,
  routeAdminOverview,
  routeEventsCreate,
  routeEventSubs,
  routeFeedback,
  routeHome,
  routeLogin,
  routeVoiceCreatePoll,
  routeVoiceManage,
  routeWffaOverview,
} from './domain/constants/routes';
import { TechnicalUser } from './domain/enums/technical-user';

const credentialsConfig = CredentialsProvider({
  name: 'Credentials',
  credentials: {
    usernameOrEmail: { label: 'Username', type: 'text', placeholder: 'max' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials): Promise<any> {
    if (credentials?.usernameOrEmail && credentials?.password) {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/login`;
      const body = JSON.stringify({ usernameOrEmail: credentials.usernameOrEmail, password: credentials.password });

      const response = await fetch(url, {
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
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // deny access to routes that require a session
      // TODO: add more protected routes
      if (
        pathname.startsWith(routeAccount) ||
        pathname.startsWith(routeFeedback) ||
        pathname.startsWith(routeEventSubs) ||
        pathname.startsWith(routeEventsCreate) ||
        pathname.startsWith(routeVoiceManage) ||
        pathname.startsWith(routeVoiceCreatePoll) ||
        pathname.startsWith(routeWffaOverview)
      ) {
        return !!auth;
      }

      // deny access to /admin routes
      if (pathname.startsWith(routeAdminOverview) && auth?.user?.username !== TechnicalUser.ADMIN) {
        return Response.redirect(new URL(routeHome, nextUrl));
      }

      return true;
    },

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
      const decoded: any = jwtDecode(token.accessToken);
      session.user = { username: decoded.username, imageUrl: decoded.imageUrl, accessToken: token.accessToken } as any;
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
