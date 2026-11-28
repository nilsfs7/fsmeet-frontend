import Link from 'next/link';
import { IconHeartHandshake } from '@tabler/icons-react';
import { AuthCard } from '@/components/auth/auth-card';
import { Button, ctaActionButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeedbackThankYouProps {
  href: string;
  buttonLabel: string;
  title: string;
  description: string;
}

/** Shared thank-you card for platform and event feedback. */
export function FeedbackThankYou({ href, buttonLabel, title, description }: FeedbackThankYouProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 sm:px-6 md:px-8">
      <AuthCard icon={<IconHeartHandshake stroke={1.75} aria-hidden />} title={title} description={description}>
        <Button asChild variant="action" className={cn(ctaActionButtonClassName, 'h-11 w-full min-w-0')}>
          <Link href={href}>{buttonLabel}</Link>
        </Button>
      </AuthCard>
    </div>
  );
}
