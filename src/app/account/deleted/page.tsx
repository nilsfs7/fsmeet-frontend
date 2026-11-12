'use client';

import Link from 'next/link';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { AuthCard } from '@/components/auth/auth-card';
import { cn } from '@/lib/utils';
import { IconHeartHandshake } from '@tabler/icons-react';
import { routeHome } from '@/domain/constants/routes';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function AccountDeleted() {
  const t = useTranslations('/account/deleted');

  useEffect(() => {
    // Sign out from NextAuth
    signOut({ redirect: false });

    // Clear localStorage after successful logout
    localStorage.removeItem('username');
    localStorage.removeItem('imageUrl');
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 sm:px-6 md:px-8">
      <AuthCard icon={<IconHeartHandshake stroke={1.75} aria-hidden />} title={t('textGoodbye')} description={t('textConfirmation')}>
        <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}>
          <Link href={routeHome}>{t('btnBackHome')}</Link>
        </Button>
      </AuthCard>
    </div>
  );
}
