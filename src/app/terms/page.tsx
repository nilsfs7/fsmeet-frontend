import { Header } from '@/components/header';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import ActionButton from '@/components/common/action-button';
import { routeAbout } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { PageInset } from '@/components/layout/page-inset';
import { TermsOfServiceText } from '@/app/terms/components/terms-of-service-text';

export default function TermsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Header />

      <PageTitle title="Terms of Service (FSMeet)" />

      <PageInset variant="prose" className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto scrollbar-none">
        <TermsOfServiceText />
      </PageInset>

      <Navigation>
        <ActionButton href={routeAbout} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
