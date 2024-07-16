import Navigation from '@/components/Navigation';
import { LoginForm } from './components/login-form';
import Link from 'next/link';
import { routeHome } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import ActionButton from '@/components/common/ActionButton';

export default async function Page({ searchParams }: any) {
  const redirectUrl = searchParams.redir;

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <LoginForm redirectUrl={redirectUrl} />;
      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
