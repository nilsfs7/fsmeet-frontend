'use server';

import { LoginRejected, signIn } from '@/auth';
import { AccessDenied } from '@auth/core/errors';

export async function loginUserWithCredentials(username: string, password: string): Promise<{ status: number; message: string }> {
  try {
    await signIn('credentials', {
      usernameOrEmail: username,
      password: password,
      redirect: false,
    });
    return { status: 200, message: 'Ok.' };
  } catch (error: unknown) {
    if (error instanceof LoginRejected) {
      return { status: error.status, message: error.serverMessage };
    }

    if (error instanceof AccessDenied) {
      return { status: 401, message: 'Unauthorized.' };
    }

    return { status: 500, message: 'Internal server error.' };
  }
}
