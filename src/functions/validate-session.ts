import { jwtDecode } from 'jwt-decode';
import moment from 'moment';

export function validateSession(session: any): boolean {
  if (session) {
    const decoded: any = jwtDecode(session.user.accessToken);

    const now = moment().unix();
    const exp = +decoded.exp;
    if (now < exp) {
      return true;
    }
  }

  return false;
}
