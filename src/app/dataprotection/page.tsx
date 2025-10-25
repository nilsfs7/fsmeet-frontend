import { Header } from '@/components/header';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import ActionButton from '@/components/common/action-button';
import { routeAbout } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { DataProtectionText } from './components/data-protection-text';

export default function DataProtection() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
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
}
