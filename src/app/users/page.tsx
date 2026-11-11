import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { routeHome, routeMap } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { getUsers } from '@/infrastructure/clients/user.client';
import { ColumnInfo, UsersList } from './components/users-list';
import { UserType } from '@/domain/enums/user-type';
import { User } from '@/domain/types/user';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';
import { appShellContentClass } from '@/components/layout/app-shell-content';

const constrainedContentClass = cn(appShellContentClass, 'max-w-content');

export default async function Users() {
  const [t, users] = await Promise.all([getTranslations('/users'), getUsers()]);

  const columnData: ColumnInfo[] = [];

  const userSorted = users.sort((a: User, b: User) => {
    const rowAVal = `${a.firstName} ${a.lastName}`;
    const rowBVal = `${b.firstName} ${b.lastName}`;

    if (rowAVal < rowBVal) {
      return -1;
    }
    if (rowAVal > rowBVal) {
      return 1;
    }

    return 0;
  });

  userSorted.forEach(user => {
    if (user.type !== UserType.ADMINISTRATIVE && user.type !== UserType.FAN) {
      columnData.push({
        user: {
          username: user.username,
          imageUrl: user.imageUrl || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
        },
        country: user.countryCode || '',
        gender: user.gender || '',
        userType: user.type,
        location:
          user.city && user.exposeLocation && user.locLatitude && user.locLongitude
            ? { city: user.city, mapLink: `${routeMap}?user=${user.username}&lat=${user.locLatitude}&lng=${user.locLongitude}&zoom=7` }
            : { city: '', mapLink: '' },
        socials: {
          fsm: user.username,
          insta: user.instagramHandle || '',
          tikTok: user.tikTokHandle || '',
          youTube: user.youTubeHandle || '',
          website: user.website || '',
        },
      });
    }
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={cn('flex min-h-0 flex-1 flex-col overflow-y-auto', constrainedContentClass)}>
        <div className="flex flex-col items-center gap-1 pb-4 pt-4 text-center sm:pt-6">
          <h1 className="text-heading-1">{t('pageTitle')}</h1>
          <p className="max-w-[36rem] text-balance text-sm text-muted-foreground sm:text-base">{t('pageDescription')}</p>
        </div>
        <UsersList columnData={columnData} />
      </div>

      <Navigation>
        <ActionButton href={routeHome} action={Action.BACK} />
      </Navigation>
    </div>
  );
}
