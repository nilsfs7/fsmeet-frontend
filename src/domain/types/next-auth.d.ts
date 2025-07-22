import NextAuth from 'next-auth/next';

declare module 'next-auth' {
  interface Session {
    user: {
      username: string;
      imageUrl: string;
      accessToken: string;
    };
  }
}
