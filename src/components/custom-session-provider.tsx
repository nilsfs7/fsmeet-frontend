// TODO: file is currently not used. this was a workaround to avoid page reloading after login but it was not working. muss be integrated in layout.tsx

'use client';

import { Session } from 'next-auth';
import { SessionProvider as NextSessionProvider, getSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useState } from 'react';

// Retrieve user session for the app's session context
export default function CustomSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const pathName = usePathname();

  const fetchSession = useCallback(async () => {
    try {
      const sessionData = await getSession();
      setSession(sessionData);
    } catch (error) {
      setSession(null);

      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    fetchSession().finally();
  }, [fetchSession, pathName]);

  return <NextSessionProvider session={session}>{children}</NextSessionProvider>;
}
