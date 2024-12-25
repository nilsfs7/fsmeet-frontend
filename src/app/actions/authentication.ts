'use server';

import { signIn, signOut } from '@/auth';
import { routeHome } from '@/domain/constants/routes';
import { AccessDenied } from '@auth/core/errors';

export async function logoutUser() {
  // TODO: pass redirect params in function signature
  await signOut({ redirectTo: routeHome, redirect: true }); // TODO: redirect won't work for some reason
}

export async function loginUserWithCredentials(username: string, password: string): Promise<{ status: number; message: string }> {
  try {
    await signIn('credentials', {
      usernameOrEmail: username,
      password: password,
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
