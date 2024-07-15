'use client';

import { logoutUser } from '@/app/actions';
import TextButton from '@/components/common/TextButton';

export const TextButtonLogout = () => {
  const handleLogoutClicked = async () => {
    await logoutUser();
  };

  return <TextButton text="Logout" onClick={handleLogoutClicked} />;
};
