import { DataProtectionText } from '@/components/DataProtectionText';
import { LogoFSMeet } from '@/components/Logo';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { routeAbout } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import { NextPage } from 'next';
import Link from 'next/link';

const DataProtection: NextPage = () => {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Banner */}
      <div className="sm:block">
        <div className="mx-2 flex h-20 items-center justify-between">
          <LogoFSMeet />
        </div>
      </div>

      <div className="mx-2 mt-2 flex flex-col items-center text-center overflow-y-auto">
        <DataProtectionText />
      </div>

      <Navigation>
        <Link href={routeAbout}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
};

export default DataProtection;
