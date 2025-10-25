import Navigation from '@/components/navigation';
import { LoginForm } from './components/login-form';
import Link from 'next/link';
import { routeHome } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';

export default async function Login() {
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
