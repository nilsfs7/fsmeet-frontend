'use client';

import { useCallback, useEffect, useState } from 'react';
import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { routeUsers } from '@/domain/constants/routes';
import ActionButton from '@/components/common/action-button';
import ComboBox from '@/components/common/combo-box';
import LoadingSpinner from '@/components/animation/loading-spinner';
import { Toaster, toast } from 'sonner';
import { User } from '@/domain/types/user';
import { menuUserVerificationStates } from '@/domain/constants/menus/menu-user-verification-states';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { getUsers, updateUserVerificationState } from '@/infrastructure/clients/user.client';
import { useSession } from 'next-auth/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

/** Align with /wffa/visa and /admin/licenses table layout */
const VERIFICATION_TABLE_CLASS = 'table-fixed w-full min-w-[40rem] border-separate border-spacing-x-3 border-spacing-y-0';

const VERIFICATION_HEAD_PAD = 'px-3 py-2.5 align-top !h-auto min-h-10';
const VERIFICATION_CELL_PAD = 'py-2.5 px-3';

const verificationCol = {
  user: 'w-[34%] min-w-[11rem]',
  state: 'w-[42%] min-w-[14rem]',
  actions: 'w-[18%] min-w-[6.5rem]',
} as const;

function UserCell({ user }: { user: User }) {
  const profileHref = `${routeUsers}/${user.username}`;
  return (
    <TableCell className={cn(VERIFICATION_CELL_PAD, 'text-primary align-top', verificationCol.user)}>
      <div className="flex flex-col gap-0.5 min-w-0">
        <Link href={profileHref} className="underline hover:text-primary/80">
          {user.username}
        </Link>
        <span className="text-primary/90">({user.firstName})</span>
      </div>
    </TableCell>
  );
}

function VerificationTableSection({
  title,
  items,
  draftVerificationByUsername,
  onDraftStateChange,
  onSave,
}: {
  title: string;
  items: User[];
  draftVerificationByUsername: Record<string, UserVerificationState | undefined>;
  onDraftStateChange: (username: string, verificationState: UserVerificationState) => void;
  onSave: (user: User) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="mb-6">
        <h2 className="mb-2 text-center text-base font-semibold text-primary">{title}</h2>
        <p className="text-center text-sm text-primary/70">No entries</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="mb-2 text-center text-base font-semibold text-primary">{title}</h2>
      <div className="rounded-md border border-secondary-dark bg-background">
        <Table className={VERIFICATION_TABLE_CLASS}>
          <TableHeader>
            <TableRow className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent">
              <TableHead className={cn('text-primary', VERIFICATION_HEAD_PAD, verificationCol.user)}>User</TableHead>
              <TableHead className={cn('text-primary', VERIFICATION_HEAD_PAD, verificationCol.state)}>Verification state</TableHead>
              <TableHead className={cn('text-right text-primary', VERIFICATION_HEAD_PAD, verificationCol.actions)}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr:first-child_td]:pt-3">
            {items.map(user => {
              const comboValue = draftVerificationByUsername[user.username] ?? user.verificationState ?? '';
              return (
                <TableRow key={user.username} className="border-secondary-dark hover:bg-transparent dark:hover:bg-transparent">
                  <UserCell user={user} />
                  <TableCell className={cn(VERIFICATION_CELL_PAD, 'text-primary align-top', verificationCol.state)}>
                    <ComboBox
                      menus={menuUserVerificationStates}
                      value={comboValue}
                      searchEnabled={false}
                      onChange={(value: UserVerificationState) => {
                        onDraftStateChange(user.username, value);
                      }}
                    />
                  </TableCell>
                  <TableCell className={cn(VERIFICATION_CELL_PAD, 'text-right align-top', verificationCol.actions)}>
                    <div className="flex justify-end gap-1">
                      <ActionButton action={Action.SAVE} onClick={() => onSave(user)} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export const VerificationEditor = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  /** Unsaved ComboBox edits; table membership uses `users` only until Save. */
  const [draftVerificationByUsername, setDraftVerificationByUsername] = useState<
    Record<string, UserVerificationState | undefined>
  >({});
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async (showInitialSpinner: boolean) => {
    if (showInitialSpinner) setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
      setDraftVerificationByUsername({});
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? 'Failed to load users.');
    } finally {
      if (showInitialSpinner) setLoading(false);
    }
  }, []);

  const handleDraftVerificationStateChanged = (username: string, verificationState: UserVerificationState) => {
    setDraftVerificationByUsername(prev => ({ ...prev, [username]: verificationState }));
  };

  const handleSaveUserClicked = async (user: User) => {
    const nextState = draftVerificationByUsername[user.username] ?? user.verificationState;
    try {
      if (nextState) {
        await updateUserVerificationState(session, user.username, nextState);
        toast.success(`Verification state for ${user.username} (${user.firstName}) updated.`);
        setUsers(prev =>
          prev.map(usr => (usr.username === user.username ? { ...usr, verificationState: nextState } : usr)),
        );
        setDraftVerificationByUsername(prev => {
          const next = { ...prev };
          delete next[user.username];
          return next;
        });
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
      await loadUsers(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    loadUsers(true);
  }, [status, loadUsers]);

  if (loading || status === 'loading') {
    return <LoadingSpinner />;
  }

  const pending = users.filter(u => u.verificationState === UserVerificationState.VERIFICATION_PENDING);
  const denied = users.filter(u => u.verificationState === UserVerificationState.DENIED);
  const notVerified = users.filter(u => u.verificationState === UserVerificationState.NOT_VERIFIED);
  const verified = users.filter(u => u.verificationState === UserVerificationState.VERIFIED);

  return (
    <>
      <Toaster richColors />

      <div className="mx-2 overflow-y-auto pb-4">
        <div className="rounded-lg border border-primary bg-secondary-light p-2 text-sm">
          <VerificationTableSection
            title="Verification pending"
            items={pending}
            draftVerificationByUsername={draftVerificationByUsername}
            onDraftStateChange={handleDraftVerificationStateChanged}
            onSave={handleSaveUserClicked}
          />
          <VerificationTableSection
            title="Denied"
            items={denied}
            draftVerificationByUsername={draftVerificationByUsername}
            onDraftStateChange={handleDraftVerificationStateChanged}
            onSave={handleSaveUserClicked}
          />
          <VerificationTableSection
            title="Not verified"
            items={notVerified}
            draftVerificationByUsername={draftVerificationByUsername}
            onDraftStateChange={handleDraftVerificationStateChanged}
            onSave={handleSaveUserClicked}
          />
          <VerificationTableSection
            title="Verified"
            items={verified}
            draftVerificationByUsername={draftVerificationByUsername}
            onDraftStateChange={handleDraftVerificationStateChanged}
            onSave={handleSaveUserClicked}
          />
        </div>
      </div>
    </>
  );
};
