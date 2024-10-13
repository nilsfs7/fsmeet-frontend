import { Header } from '@/components/Header';
import { ImprintText } from '@/app/imprint/components/imprint-text';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import ActionButton from '@/components/common/ActionButton';
import { routeAbout } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import Link from 'next/link';

export default function Imprint() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header />

      <PageTitle title="Impressum" />

      <div className="mx-2 mt-2 flex flex-col items-center text-center overflow-y-auto">
        <ImprintText />
      </div>

      <Navigation>
        <Link href={routeAbout}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
