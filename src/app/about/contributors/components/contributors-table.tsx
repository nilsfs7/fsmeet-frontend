import Link from 'next/link';
import { routeUsers } from '@/domain/constants/routes';
import { User } from '@/domain/types/user';
import { imgInstagramLogo, imgUserDefaultImg } from '@/domain/constants/images';
import { cn } from '@/lib/utils';

function formatContributorName(user: User): string {
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  if (full) {
    return full;
  }
  return user.username;
}

export type ContributorsTableRow = {
  user: User;
  contribution: string;
  /** Instagram path segment, e.g. `p/ABC` — links to the announcement post */
  instagramPath?: string;
};

type ContributorsTableProps = {
  title: string;
  description?: string;
  rows: ContributorsTableRow[];
  /** Label of the contribution line (e.g. "Contribution" / "Proposal"), announced to screen readers. */
  colContribution: string;
  lnkAnnouncement: string;
  className?: string;
};

/** Contributors section rendered as a responsive grid of person cards. */
export function ContributorsTable({ title, description, rows, colContribution, lnkAnnouncement, className }: ContributorsTableProps) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <section className={cn('w-full min-w-0', className)}>
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row, i) => (
          <li key={`${row.user.username}-${i}`} className="flex min-w-0 flex-col justify-between gap-3 rounded-2xl border border-border bg-background p-4 shadow-xs">
            <div className="flex min-w-0 items-center gap-3">
              <img src={row.user.imageUrl || imgUserDefaultImg} alt="" className="h-12 w-12 shrink-0 rounded-full bg-muted object-cover ring-1 ring-border" />
              <div className="min-w-0">
                <Link
                  href={`${routeUsers}/${encodeURIComponent(row.user.username)}`}
                  className="block truncate font-semibold text-foreground underline-offset-2 hover:text-brand-strong hover:underline focus-visible:rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {formatContributorName(row.user)}
                </Link>
                <div className="mt-0.5 text-sm text-muted-foreground">
                  <span className="sr-only">{colContribution}: </span>
                  {row.contribution}
                </div>
              </div>
            </div>
            {row.instagramPath && (
              <a
                href={`https://www.instagram.com/${row.instagramPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <img src={imgInstagramLogo} alt="" className="h-4 w-4" />
                {lnkAnnouncement}
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
