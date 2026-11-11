'use client';

import { statusChipClassName } from '@/components/label';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

/**
 * Status chip shown when an event is not in a public / listed state.
 */
export function NotListedLabel({ className }: { className?: string }) {
  const t = useTranslations('global/components/event-card');

  return <span className={cn(statusChipClassName, 'uppercase', className)}>{t('lblNotListed')}</span>;
}
