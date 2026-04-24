import Navigation from '@/components/navigation';
import { LoginForm } from './components/login-form';
import { routeHome } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/action-button';

export default async function Login() {
  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <LoginForm />
      <Navigation>
        <ActionButton href={routeHome} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
