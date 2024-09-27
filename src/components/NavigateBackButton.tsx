'use client';

import { useRouter } from 'next/navigation';
import ActionButton from './common/ActionButton';
import { Action } from '@/domain/enums/action';

export default function NavigateBackButton() {
  const router = useRouter();

  return <ActionButton action={Action.BACK} onClick={() => router.back()} />;
}
