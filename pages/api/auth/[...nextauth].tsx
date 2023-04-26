import NextAuth, { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt_decode from 'jwt-decode';
import { AdapterUser } from 'next-auth/adapters';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials, req): Promise<User | null> {
        if (credentials?.username && credentials?.password) {
          console.log('process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/login');
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ username: credentials.username, password: credentials.password }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const body = await response.json();
          const decoded: any = jwt_decode(body.accessToken);

          if (response.ok && body.accessToken) {
            const user: User = { id: decoded.username };
            return user;
          }
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/account',
  },
  callbacks: {
    async signIn({ user }: { user: User | AdapterUser }) {
      if (user) return true;

      return false;
    },

    jwt: async ({ token, user }) => {
      if (user) {
        token.name = user.id;
      }

      return token;
    },

    session({ session, token, user }) {
      if (session.user) {
        session.user.name = token.name;
      }

      return session;
    },
  },
});
