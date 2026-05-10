import { Header } from '@/components/header';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import ActionButton from '@/components/common/action-button';
import { routeAbout } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { DataProtectionText } from './components/data-protection-text';
import { PageInset } from '@/components/layout/page-inset';

export default function DataProtection() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header />

      <PageTitle title="Datenschutzerklärung" />

      <PageInset variant="prose" className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto scrollbar-none">
        <DataProtectionText />
      </PageInset>

      <Navigation>
        <ActionButton href={routeAbout} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
