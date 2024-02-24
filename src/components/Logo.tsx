import { routeHome } from '@/types/consts/routes';
import Link from 'next/link';
import localFont from 'next/font/local';

const fontImpact = localFont({ src: '../../fonts/impact.ttf' });

export const LogoFSMeet = () => {
  return (
    <Link href={routeHome}>
      <div className={`${fontImpact.className} text-3xl text-primary`}>FSMeet</div>
    </Link>
  );
};

export const LogoFSM = () => {
  return <div className={`${fontImpact.className} text-2xl text-primary`}>FSM</div>;
};
