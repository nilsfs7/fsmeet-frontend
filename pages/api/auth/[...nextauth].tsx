import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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

      async authorize(credentials, req) {
        if (credentials?.username && credentials?.password) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ username: credentials.username, password: credentials.password }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const body = await response.json();

          // If no error and we have user data, return it
          if (response.ok && body.accessToken) {
            return body.accessToken;
          }
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/account',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(user);
      return true;
    },
  },
});
