'use server';

import { signIn, signOut } from '@/auth';
import bcrypt from 'bcryptjs';

export async function doLogout() {
  await signOut({ redirectTo: '/' });
}

export async function doCredentialLogin(username: string, password: string) {
  try {
    // const hashedPassword = bcrypt.hashSync(password, '$2a$10$CwTycUXWue0Thq9StjUM0u');

    const response = await signIn('credentials', {
      usernameOrEmail: username,
      password: password,
      redirect: false,
    });

    return response;
  } catch (err) {
    throw err;
  }
}
