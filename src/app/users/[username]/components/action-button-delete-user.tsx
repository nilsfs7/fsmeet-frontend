'use client';

import ActionButton from '@/components/common/action-button';
import { Action } from '@/domain/enums/action';
import { deleteUser } from '@/infrastructure/clients/user.client';
import { useSession } from 'next-auth/react';
import { Toaster, toast } from 'sonner';

interface IActionButtonDeleteUser {
  username: string;
}

export const ActionButtonDeleteUser = ({ username }: IActionButtonDeleteUser) => {
  const { data: session, status } = useSession();

  const handleDeleteAccountClicked = async () => {
    try {
      await deleteUser(username, session);

      toast.success('User deleted.');
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <Toaster richColors />

      <ActionButton action={Action.DELETE} onClick={handleDeleteAccountClicked} />
    </>
  );
};
