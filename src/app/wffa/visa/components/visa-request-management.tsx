'use client';

import { useCallback, useEffect, useState } from 'react';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { Toaster, toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { getVisaInvitationRequests, updateVisaInvitationRequest } from '@/infrastructure/clients/event.client';
import { VisaInvitationRequest } from '@/domain/types/visa-invitation-request';
import { VisaInvitationRequestApprovalState } from '@/domain/enums/visa-request-approval-state';
import Link from 'next/link';
import { routeUsers } from '../../../../domain/constants/routes';
import { getUser } from '@/infrastructure/clients/user.client';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { imgVerifiedCheckmark } from '../../../../domain/constants/images';
import { cn } from '@/lib/utils';

/** Same layout for Pending / Approved / Denied so columns line up vertically. */
const VISA_TABLE_CLASS = 'table-fixed w-full min-w-[48rem] border-separate border-spacing-x-3 border-spacing-y-0';

/** Extra horizontal padding so long text doesn’t touch column edges. */
const VISA_HEAD_PAD = 'px-3 py-2.5 align-top !h-auto min-h-10';
const VISA_CELL_PAD = 'py-2.5 px-3';

const visaCol = {
  /** Most horizontal space */
  applicant: 'w-[40%] min-w-[12rem] max-w-[60%]',
  /** 2-letter country codes only */
  country: 'w-[9ch] min-w-[9ch] max-w-[9ch] text-center',
  /** Max 12 characters (passport no.) */
  passport: 'w-[12ch] min-w-[12ch] max-w-[12ch]',
  approver: 'w-[22%] min-w-[7rem]',
  actions: 'w-[18%] min-w-[8.5rem]',
} as const;

function formatDisplayName(firstName: string, lastName: string): string {
  const name = [firstName, lastName].filter(Boolean).join(' ').trim();
  return name || '—';
}

function ApplicantCell({ item, verificationByUsername }: { item: VisaInvitationRequest; verificationByUsername: Record<string, UserVerificationState | undefined> }) {
  const verified = verificationByUsername[item.username] === UserVerificationState.VERIFIED;
  const profileHref = `${routeUsers}/${item.username}`;
  return (
    <TableCell className={cn(VISA_CELL_PAD, 'text-primary align-top', visaCol.applicant)}>
      <div className="flex flex-col gap-0.5 min-w-0">
        <Link href={profileHref} className="underline hover:text-primary/80">
          {formatDisplayName(item.firstName, item.lastName)}
        </Link>
        <div className="flex items-center gap-1.5">
          <Link href={profileHref} className="text-primary/90 underline hover:text-primary/80">
            {item.username}
          </Link>
          {verified && <img src={imgVerifiedCheckmark} alt="" className="h-6 w-6 shrink-0" width={16} height={16} />}
        </div>
      </div>
    </TableCell>
  );
}

export const VisaRequestManagement = () => {
  const { data: session, status } = useSession();

  const [visaInvitationRequestsMap, setVisaInvitationRequests] = useState<VisaInvitationRequest[]>([]);
  const [verificationByUsername, setVerificationByUsername] = useState<Record<string, UserVerificationState | undefined>>({});
  const [loading, setLoading] = useState(true);

  const loadVisaRequestsAndVerification = useCallback(
    async (showInitialSpinner: boolean) => {
      if (status !== 'authenticated' || !session) {
        if (showInitialSpinner) setLoading(false);
        return;
      }
      if (showInitialSpinner) setLoading(true);
      try {
        const requests = await getVisaInvitationRequests('todo', session);
        setVisaInvitationRequests(requests);

        const usernames = [...new Set(requests.map(r => r.username))];
        const results = await Promise.allSettled(usernames.map(username => getUser(username, session)));
        const next: Record<string, UserVerificationState | undefined> = {};
        usernames.forEach((username, i) => {
          const r = results[i];
          if (r.status === 'fulfilled') {
            next[username] = r.value.verificationState;
          }
        });
        setVerificationByUsername(next);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message ?? 'Failed to load visa requests.');
      } finally {
        if (showInitialSpinner) setLoading(false);
      }
    },
    [session, status],
  );

  const handleApproveClicked = async (req: VisaInvitationRequest) => {
    try {
      await updateVisaInvitationRequest(req.id, VisaInvitationRequestApprovalState.APPROVED, session);
      toast.success(`Visa request approved for ${req.firstName} ${req.lastName}.`);
      await loadVisaRequestsAndVerification(false);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleDeniedClicked = async (req: VisaInvitationRequest) => {
    try {
      await updateVisaInvitationRequest(req.id, VisaInvitationRequestApprovalState.DENIED, session);
      toast.success(`Visa request denied for ${req.firstName} ${req.lastName}.`);
      await loadVisaRequestsAndVerification(false);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated') {
      setLoading(false);
      return;
    }
    loadVisaRequestsAndVerification(true);
  }, [status, loadVisaRequestsAndVerification]);

  const pending = visaInvitationRequestsMap.filter(r => r.approvalState === VisaInvitationRequestApprovalState.PENDING);
  const approved = visaInvitationRequestsMap.filter(r => r.approvalState === VisaInvitationRequestApprovalState.APPROVED);
  const denied = visaInvitationRequestsMap.filter(r => r.approvalState === VisaInvitationRequestApprovalState.DENIED);

  if (loading || status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster richColors />

      <div className="mx-2 overflow-y-auto pb-4">
        <div className="rounded-lg border border-primary bg-secondary-light p-2 text-sm">
          <PendingTable items={pending} verificationByUsername={verificationByUsername} onApprove={handleApproveClicked} onDeny={handleDeniedClicked} />
          <ApprovedTable items={approved} verificationByUsername={verificationByUsername} />
          <DeniedTable items={denied} verificationByUsername={verificationByUsername} onApprove={handleApproveClicked} />
        </div>
      </div>
    </>
  );
};

function PendingTable({
  items,
  verificationByUsername,
  onApprove,
  onDeny,
}: {
  items: VisaInvitationRequest[];
  verificationByUsername: Record<string, UserVerificationState | undefined>;
  onApprove: (req: VisaInvitationRequest) => void;
  onDeny: (req: VisaInvitationRequest) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="mb-6">
        <h2 className="mb-2 text-center text-base font-semibold text-primary">Pending</h2>
        <p className="text-center text-sm text-primary/70">No entries</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="mb-2 text-center text-base font-semibold text-primary">Pending</h2>
      <div className="rounded-md border border-secondary-dark bg-background">
        <Table className={VISA_TABLE_CLASS}>
          <TableHeader>
            <TableRow className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent">
              <TableHead className={cn('text-primary', VISA_HEAD_PAD, visaCol.applicant)}>Applicant</TableHead>
              <TableHead className={cn('text-primary', VISA_HEAD_PAD, visaCol.country)} title="Country code">
                Country
              </TableHead>
              <TableHead className={cn('text-primary', VISA_HEAD_PAD, visaCol.passport)} title="Passport number">
                Passport
              </TableHead>
              <TableHead className={cn('text-primary', VISA_HEAD_PAD, visaCol.approver)}></TableHead>
              <TableHead className={cn('text-right text-primary', VISA_HEAD_PAD, visaCol.actions)}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:first-child_td]:pt-3">
            {items.map(item => (
              <TableRow key={item.id} className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent">
                <ApplicantCell item={item} verificationByUsername={verificationByUsername} />
                <TableCell className={cn(VISA_CELL_PAD, 'text-primary align-top', visaCol.country)}>{item.countryCode || '—'}</TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'text-primary align-top', visaCol.passport)} title={item.passportNumber || undefined}>
                  {item.passportNumber}
                </TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'text-primary align-top', visaCol.approver)}></TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'text-right align-top', visaCol.actions)}>
                  <div className="flex justify-end gap-1">
                    <ActionButton action={Action.ACCEPT} onClick={() => onApprove(item)} />
                    <ActionButton action={Action.DENY} onClick={() => onDeny(item)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ApprovedTable({ items, verificationByUsername }: { items: VisaInvitationRequest[]; verificationByUsername: Record<string, UserVerificationState | undefined> }) {
  if (items.length === 0) {
    return (
      <div className="mb-6">
        <h2 className="mb-2 text-center text-base font-semibold text-primary">Approved</h2>
        <p className="text-center text-sm text-primary/70">No entries</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="mb-2 text-center text-base font-semibold text-primary">Approved</h2>
      <div className="rounded-md border border-secondary-dark bg-background">
        <Table className={VISA_TABLE_CLASS}>
          <TableHeader>
            <TableRow className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent p-2">
              <TableHead className={cn('text-primary', VISA_HEAD_PAD, visaCol.applicant)}>Applicant</TableHead>
              <TableHead className={cn('text-primary', VISA_HEAD_PAD, visaCol.country)} title="Country code">
                Country
              </TableHead>
              <TableHead className={cn('text-primary', VISA_HEAD_PAD, visaCol.passport)} title="Passport number">
                Passport
              </TableHead>
              <TableHead className={cn('text-primary', VISA_HEAD_PAD, visaCol.approver)}>Approver</TableHead>
              <TableHead className={cn('text-right text-primary', VISA_HEAD_PAD, visaCol.actions)}>Document</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:first-child_td]:pt-3">
            {items.map(item => (
              <TableRow key={item.id} className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent">
                <ApplicantCell item={item} verificationByUsername={verificationByUsername} />
                <TableCell className={cn(VISA_CELL_PAD, 'text-primary align-top', visaCol.country)}>{item.countryCode || '—'}</TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'text-primary align-top', visaCol.passport)} title={item.passportNumber || undefined}>
                  {item.passportNumber}
                </TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'text-primary align-top', visaCol.approver)}>
                  {item.approver ? (
                    <Link href={`${routeUsers}/${item.approver}`} className="underline hover:text-primary/80">
                      {item.approver}
                    </Link>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'text-right align-top', visaCol.actions)}>
                  {item.documentUrl ? (
                    <a href={item.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
                      <ActionButton action={Action.GOTOEXTERNAL} />
                    </a>
                  ) : (
                    '—'
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

function DeniedTable({
  items,
  verificationByUsername,
  onApprove,
}: {
  items: VisaInvitationRequest[];
  verificationByUsername: Record<string, UserVerificationState | undefined>;
  onApprove: (req: VisaInvitationRequest) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="mb-6">
        <h2 className="mb-2 text-center text-base font-semibold text-primary">Denied</h2>
        <p className="text-center text-sm text-primary/70">No entries</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="mb-2 text-center text-base font-semibold text-primary">Denied</h2>
      <div className="rounded-md border border-secondary-dark bg-background">
        <Table className={VISA_TABLE_CLASS}>
          <TableHeader>
            <TableRow className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent">
              <TableHead className={cn('text-primary', VISA_HEAD_PAD, visaCol.applicant)}>Applicant</TableHead>
              <TableHead className={cn('text-primary', VISA_HEAD_PAD, visaCol.country)} title="Country code">
                Country
              </TableHead>
              <TableHead className={cn('text-primary', VISA_HEAD_PAD, visaCol.passport)} title="Passport number">
                Passport
              </TableHead>
              <TableHead className={cn('text-primary', VISA_HEAD_PAD, visaCol.approver)}>Approver</TableHead>
              <TableHead className={cn('text-right text-primary', VISA_HEAD_PAD, visaCol.actions)}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:first-child_td]:pt-3">
            {items.map(item => (
              <TableRow key={item.id} className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent">
                <ApplicantCell item={item} verificationByUsername={verificationByUsername} />
                <TableCell className={cn(VISA_CELL_PAD, 'text-primary align-top', visaCol.country)}>{item.countryCode || '—'}</TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'text-primary align-top', visaCol.passport)} title={item.passportNumber || undefined}>
                  {item.passportNumber}
                </TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'text-primary align-top', visaCol.approver)}>
                  {item.approver ? (
                    <Link href={`${routeUsers}/${item.approver}`} className="underline hover:text-primary/80">
                      {item.approver}
                    </Link>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'text-right align-top', visaCol.actions)}>
                  <div className="flex justify-end gap-1">
                    <ActionButton action={Action.ACCEPT} onClick={() => onApprove(item)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
