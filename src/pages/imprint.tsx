import { Header } from '@/components/Header';
import { ImprintText } from '@/components/ImprintText';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import ActionButton from '@/components/common/ActionButton';
import { routeAbout } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import Link from 'next/link';

const Imprint = () => {
  return (
    <div className="absolute inset-0 flex flex-col">
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
};

export default Imprint;
