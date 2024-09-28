'use server';

import { signIn, signOut } from '@/auth';
import { routeHome } from '@/domain/constants/routes';
import { AccessDenied } from '@auth/core/errors';
import bcrypt from 'bcryptjs';

export async function logoutUser() {
  await signOut({ redirectTo: routeHome, redirect: true }); // redirect won't work for some reason
}

export async function loginUserWithCredentials(username: string, password: string): Promise<{ status: number; message: string }> {
  const hashedPassword = bcrypt.hashSync(password, '$2a$10$CwTycUXWue0Thq9StjUM0u');

  try {
    await signIn('credentials', {
      usernameOrEmail: username,
      password: hashedPassword,
      redirect: false,
    });
    return { status: 200, message: 'Ok.' };
  } catch (error: any) {
    if (error instanceof AccessDenied) {
      return { status: 401, message: 'Unauthorized.' };
    }

    return { status: 500, message: 'Internal server error.' };
  }
}
