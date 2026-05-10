import Link from 'next/link';
import SocialLink from '@/components/user/social-link';
import { routeUsers } from '@/domain/constants/routes';
import { SocialPlatform } from '@/domain/enums/social-platform';
import { User } from '@/domain/types/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  /** Instagram path segment, e.g. `p/ABC` — opens SocialLink to announcement */
  instagramPath?: string;
};

type ContributorsTableProps = {
  title: string;
  rows: ContributorsTableRow[];
  colName: string;
  colContribution: string;
  colAnnouncement: string;
  noAnnouncement: string;
  className?: string;
};

export function ContributorsTable({ title, rows, colName, colContribution, colAnnouncement, noAnnouncement, className }: ContributorsTableProps) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div className={cn('w-full min-w-0 max-w-3xl', className)}>
      <h2 className="mb-2 text-left text-lg font-semibold text-foreground">{title}</h2>
      <div className="min-h-0 min-w-0 max-w-full overflow-x-auto scrollbar-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[8rem] text-center align-middle">{colName}</TableHead>
              <TableHead className="min-w-[10rem] text-center align-middle">{colContribution}</TableHead>
              <TableHead className="min-w-[8rem] text-center align-middle">{colAnnouncement}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.user.username}>
                <TableCell className="align-middle text-center">
                  <Link
                    href={`${routeUsers}/${encodeURIComponent(row.user.username)}`}
                    className="font-medium text-primary underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {formatContributorName(row.user)}
                  </Link>
                </TableCell>
                <TableCell className="align-middle text-center text-foreground/90">{row.contribution}</TableCell>
                <TableCell className="align-middle text-center">
                  {row.instagramPath ? (
                    <div className="flex justify-center">
                      <SocialLink showPath={false} platform={SocialPlatform.INSTAGRAM} path={row.instagramPath} />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">{noAnnouncement}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
