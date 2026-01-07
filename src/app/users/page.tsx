import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { routeHome, routeMap } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import Link from 'next/link';
import { Header } from '@/components/header';
import PageTitle from '@/components/page-title';
import { getUsers } from '@/infrastructure/clients/user.client';
import { ColumnInfo, UsersList } from './components/users-list';
import { UserType } from '@/domain/enums/user-type';
import { User } from '@/domain/types/user';
import { getTranslations } from 'next-intl/server';

export default async function Users() {
  const t = await getTranslations('/users');

  const users = await getUsers();

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
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header />

      <PageTitle title={t('pageTitle')} />

      <UsersList columnData={columnData} />

      <Navigation>
        <Link href={routeHome}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
