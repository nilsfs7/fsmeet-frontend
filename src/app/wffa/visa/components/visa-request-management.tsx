'use client';

import { useCallback, useEffect, useState } from 'react';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { Toaster, toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
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
import moment from 'moment';
import { getShortDateString } from '@/functions/time';

/** Same layout for Pending / Approved / Denied so columns line up vertically. */
const VISA_TABLE_CLASS = 'table-fixed w-full min-w-3xl';

/** Extra horizontal padding so long text doesn’t touch column edges. */
const VISA_HEAD_PAD = 'px-3 py-2.5 align-top h-auto! min-h-10';
const VISA_CELL_PAD = 'py-2.5 px-3';

const visaCol = {
  /** Most horizontal space */
  applicant: 'w-[40%] min-w-48 max-w-[60%]',
  /** 2-letter country codes only */
  country: 'w-[9ch] min-w-[9ch] max-w-[9ch] text-center',
  /** Max 12 characters (passport no.) */
  passport: 'w-[12ch] min-w-[12ch] max-w-[12ch]',
  /** DD.MM.YY */
  requestDate: 'w-[11ch] min-w-[11ch] max-w-[11ch] whitespace-nowrap',
  approver: 'w-[20%] min-w-28',
  actions: 'w-[18%] min-w-34',
} as const;

function formatDisplayName(firstName: string, lastName: string): string {
  const name = [firstName, lastName].filter(Boolean).join(' ').trim();
  return name || '—';
}

function formatRequestDate(requestDate: string): string {
  if (!requestDate) return '—';
  const m = moment(requestDate);
  return m.isValid() ? getShortDateString(m) : '—';
}

function ApplicantCell({ item, verificationByUsername }: { item: VisaInvitationRequest; verificationByUsername: Record<string, UserVerificationState | undefined> }) {
  const verified = verificationByUsername[item.username] === UserVerificationState.VERIFIED;
  const profileHref = `${routeUsers}/${item.username}`;
  return (
    <TableCell className={cn(VISA_CELL_PAD, 'align-top', visaCol.applicant)}>
      <div className="flex flex-col gap-0.5 min-w-0">
        <Link href={profileHref} className="font-medium text-brand-strong underline-offset-2 hover:underline">
          {formatDisplayName(item.firstName, item.lastName)}
        </Link>
        <div className="flex items-center gap-1.5">
          <Link href={profileHref} className="font-medium text-foreground underline-offset-2 hover:text-brand-strong hover:underline">
            {item.username}
          </Link>
          {verified && <img src={imgVerifiedCheckmark} alt="" className="h-4 w-4 shrink-0" width={16} height={16} />}
        </div>
      </div>
    </TableCell>
  );
}

export const VisaRequestManagement = () => {
  const t = useTranslations('/wffa/visa');
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
        toast.error(e?.message ?? t('toastLoadFailed'));
      } finally {
        if (showInitialSpinner) setLoading(false);
      }
    },
    [session, status],
  );

  const handleApproveClicked = async (req: VisaInvitationRequest) => {
    try {
      await updateVisaInvitationRequest(req.id, VisaInvitationRequestApprovalState.APPROVED, session);
      toast.success(t('toastApproved', { name: `${req.firstName} ${req.lastName}` }));
      await loadVisaRequestsAndVerification(false);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleDeniedClicked = async (req: VisaInvitationRequest) => {
    try {
      await updateVisaInvitationRequest(req.id, VisaInvitationRequestApprovalState.DENIED, session);
      toast.success(t('toastDenied', { name: `${req.firstName} ${req.lastName}` }));
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

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6 md:px-8">
        <div className="mx-auto flex w-full max-w-content flex-col gap-8 text-sm">
          <PendingTable items={pending} verificationByUsername={verificationByUsername} onApprove={handleApproveClicked} onDeny={handleDeniedClicked} />
          <ApprovedTable items={approved} verificationByUsername={verificationByUsername} />
          <DeniedTable items={denied} verificationByUsername={verificationByUsername} onApprove={handleApproveClicked} />
        </div>
      </div>
    </>
  );
};

function SectionHeading({ label, count, tone }: { label: string; count: number; tone: string }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
      {label}
      <span className={cn('inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold', tone)}>{count}</span>
    </h2>
  );
}

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
  const t = useTranslations('/wffa/visa');
  if (items.length === 0) {
    return (
      <div>
        <SectionHeading label={t('pending')} count={items.length} tone="bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" />
        <p className="rounded-2xl border border-dashed border-border bg-background/60 px-4 py-6 text-center text-sm text-muted-foreground">{t('noEntries')}</p>
      </div>
    );
  }

  return (
    <div>
      <SectionHeading label={t('pending')} count={items.length} tone="bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" />
      <div>
        <Table className={VISA_TABLE_CLASS}>
          <TableHeader>
            <TableRow className="border-border/70">
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.applicant)}>{t('applicant')}</TableHead>
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.country)} title={t('countryCode')}>
                {t('country')}
              </TableHead>
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.passport)} title={t('passportNumber')}>
                {t('passport')}
              </TableHead>
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.requestDate)} title={t('requestDate')}>
                {t('requested')}
              </TableHead>
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.approver)}></TableHead>
              <TableHead className={cn('text-right', VISA_HEAD_PAD, visaCol.actions)}>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:first-child_td]:pt-3">
            {items.map(item => (
              <TableRow key={item.id} className="border-border/70">
                <ApplicantCell item={item} verificationByUsername={verificationByUsername} />
                <TableCell className={cn(VISA_CELL_PAD, 'align-top', visaCol.country)}>{item.countryCode || '—'}</TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'align-top', visaCol.passport)} title={item.passportNumber || undefined}>
                  {item.passportNumber}
                </TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'align-top', visaCol.requestDate)} title={item.requestDate || undefined}>
                  {formatRequestDate(item.requestDate)}
                </TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'align-top', visaCol.approver)}></TableCell>
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
  const t = useTranslations('/wffa/visa');
  if (items.length === 0) {
    return (
      <div>
        <SectionHeading label={t('approved')} count={items.length} tone="bg-brand-soft text-brand-strong" />
        <p className="rounded-2xl border border-dashed border-border bg-background/60 px-4 py-6 text-center text-sm text-muted-foreground">{t('noEntries')}</p>
      </div>
    );
  }

  return (
    <div>
      <SectionHeading label={t('approved')} count={items.length} tone="bg-brand-soft text-brand-strong" />
      <div>
        <Table className={VISA_TABLE_CLASS}>
          <TableHeader>
            <TableRow className="border-border/70 p-2">
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.applicant)}>{t('applicant')}</TableHead>
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.country)} title={t('countryCode')}>
                {t('country')}
              </TableHead>
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.passport)} title={t('passportNumber')}>
                {t('passport')}
              </TableHead>
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.requestDate)} title={t('requestDate')}>
                {t('requested')}
              </TableHead>
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.approver)}>{t('approver')}</TableHead>
              <TableHead className={cn('text-right', VISA_HEAD_PAD, visaCol.actions)}>{t('document')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:first-child_td]:pt-3">
            {items.map(item => (
              <TableRow key={item.id} className="border-border/70">
                <ApplicantCell item={item} verificationByUsername={verificationByUsername} />
                <TableCell className={cn(VISA_CELL_PAD, 'align-top', visaCol.country)}>{item.countryCode || '—'}</TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'align-top', visaCol.passport)} title={item.passportNumber || undefined}>
                  {item.passportNumber}
                </TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'align-top', visaCol.requestDate)} title={item.requestDate || undefined}>
                  {formatRequestDate(item.requestDate)}
                </TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'align-top', visaCol.approver)}>
                  {item.approver ? (
                    <Link href={`${routeUsers}/${item.approver}`} className="font-medium text-brand-strong underline-offset-2 hover:underline">
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
  const t = useTranslations('/wffa/visa');
  if (items.length === 0) {
    return (
      <div>
        <SectionHeading label={t('denied')} count={items.length} tone="bg-destructive/10 text-destructive" />
        <p className="rounded-2xl border border-dashed border-border bg-background/60 px-4 py-6 text-center text-sm text-muted-foreground">{t('noEntries')}</p>
      </div>
    );
  }

  return (
    <div>
      <SectionHeading label={t('denied')} count={items.length} tone="bg-destructive/10 text-destructive" />
      <div>
        <Table className={VISA_TABLE_CLASS}>
          <TableHeader>
            <TableRow className="border-border/70">
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.applicant)}>{t('applicant')}</TableHead>
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.country)} title={t('countryCode')}>
                {t('country')}
              </TableHead>
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.passport)} title={t('passportNumber')}>
                {t('passport')}
              </TableHead>
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.requestDate)} title={t('requestDate')}>
                {t('requested')}
              </TableHead>
              <TableHead className={cn(VISA_HEAD_PAD, visaCol.approver)}>{t('approver')}</TableHead>
              <TableHead className={cn('text-right', VISA_HEAD_PAD, visaCol.actions)}>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:first-child_td]:pt-3">
            {items.map(item => (
              <TableRow key={item.id} className="border-border/70">
                <ApplicantCell item={item} verificationByUsername={verificationByUsername} />
                <TableCell className={cn(VISA_CELL_PAD, 'align-top', visaCol.country)}>{item.countryCode || '—'}</TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'align-top', visaCol.passport)} title={item.passportNumber || undefined}>
                  {item.passportNumber}
                </TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'align-top', visaCol.requestDate)} title={item.requestDate || undefined}>
                  {formatRequestDate(item.requestDate)}
                </TableCell>
                <TableCell className={cn(VISA_CELL_PAD, 'align-top', visaCol.approver)}>
                  {item.approver ? (
                    <Link href={`${routeUsers}/${item.approver}`} className="font-medium text-brand-strong underline-offset-2 hover:underline">
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
