import { Header } from '@/components/header';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import ActionButton from '@/components/common/action-button';
import { routeAbout } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { DataProtectionText } from './components/data-protection-text';

export default function DataProtection() {
  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <Header />

      <PageTitle title="Datenschutzerklärung" />

      <div className="mx-2 mt-2 flex flex-1 flex-col items-center overflow-y-auto px-2 pb-4">
        <DataProtectionText />
      </div>

      <Navigation>
        <ActionButton href={routeAbout} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
