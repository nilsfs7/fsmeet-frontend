'use server';

import { signIn, signOut } from '@/auth';
import bcrypt from 'bcryptjs';

// export async function doSocialLogin(formData: any) {
//     const action = formData.get('action');
//     await signIn(action, { redirectTo: "/" });
// }

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

// export async function doCredentialLogin(formData: any) {
//   console.log("formData", formData);

//   try {
//     const hashedPassword = bcrypt.hashSync(formData.get("password"), '$2a$10$CwTycUXWue0Thq9StjUM0u');

//     const response = await signIn("credentials", {
//       usernameOrEmail: formData.get("username"),
//       password: hashedPassword,
//       redirect: false,
//     });

//     return response;
//   } catch (err) {
//     throw err;
//   }
// }
