import { DataProtectionText } from '@/components/DataProtectionText';
import { Header } from '@/components/Header';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import ActionButton from '@/components/common/ActionButton';
import { routeAbout } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import Link from 'next/link';

const DataProtection = () => {
  return (
    <div className="absolute inset-0 flex flex-col">
      <Header />

      <PageTitle title="Datenschutzerklärung" />

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
