import Link from 'next/link';
import type { Icon } from '@tabler/icons-react';
import { ChoiceCard } from '@/components/common/choice-card';
import { cn } from '@/lib/utils';

export type HubLink = { href: string; title: string; description?: string; Icon: Icon; tone?: string };

/** Grid of large navigation cards for overview / hub pages (admin, WFFA, feedback). */
export function HubLinks({ links, columns = 2 }: { links: HubLink[]; columns?: 2 | 3 }) {
  return (
    <div className={cn('grid w-full grid-cols-1 gap-3', columns === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2')}>
      {links.map(link => (
        <Link key={link.href} href={link.href} className="rounded-2xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand">
          <ChoiceCard asDiv title={link.title} description={link.description} Icon={link.Icon} tone={link.tone} />
        </Link>
      ))}
    </div>
  );
}
