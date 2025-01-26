import Navigation from '@/components/Navigation';
import { LoginForm } from './components/login-form';
import Link from 'next/link';
import { routeHome } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';

export default async function Page() {
  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <LoginForm />
      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
