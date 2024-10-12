import { routeLogin } from '@/domain/constants/routes';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { Action } from '@/domain/enums/action';
import ActionButton from '@/components/common/ActionButton';
import { RegistrationForm } from './components/registration-form';

export default function Registration() {
  return (
    <div className={'absolute inset-0 flex flex-col'}>
      <RegistrationForm />

      <Navigation>
        <Link href={routeLogin}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
