import Link from 'next/link';
import type { Icon } from '@tabler/icons-react';
import { ChoiceCard } from '@/components/common/choice-card';

export type HubLink = { href: string; title: string; description?: string; Icon: Icon; tone?: string };

/** Grid of large navigation cards for overview / hub pages (admin, WFFA, feedback). */
export function HubLinks({ links }: { links: HubLink[] }) {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
      {links.map(link => (
        <Link key={link.href} href={link.href} className="rounded-2xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand">
          <ChoiceCard asDiv title={link.title} description={link.description} Icon={link.Icon} tone={link.tone} />
        </Link>
      ))}
    </div>
  );
}
