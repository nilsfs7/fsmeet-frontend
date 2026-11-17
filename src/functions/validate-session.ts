import { jwtDecode } from 'jwt-decode';

export function validateSession(session: any): boolean {
  if (session) {
    const decoded: any = jwtDecode(session.user.accessToken);

    const now = Math.floor(Date.now() / 1000);
    const exp = +decoded.exp;
    if (now < exp) {
      return true;
    }
  }

  return false;
}
