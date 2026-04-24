import { Header } from '@/components/header';
import { ImprintText } from '@/app/imprint/components/imprint-text';
import Navigation from '@/components/navigation';
import PageTitle from '@/components/page-title';
import ActionButton from '@/components/common/action-button';
import { routeAbout } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { PageInset } from '@/components/layout/page-inset';

export default function Imprint() {
  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <Header />

      <PageTitle title="Impressum" />

      <PageInset variant="prose" className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <ImprintText />
      </PageInset>

      <Navigation>
        <Link href={routeAbout}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
