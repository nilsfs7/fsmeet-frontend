import { Header } from '@/components/Header';
import Navigation from '@/components/Navigation';
import PageTitle from '@/components/PageTitle';
import ActionButton from '@/components/common/ActionButton';
import SocialLink from '@/components/user/SocialLink';
import UserCard from '@/components/user/UserCard';
import { routeAbout } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { Platform } from '@/domain/enums/platform';
import { getUser } from '@/infrastructure/clients/user.client';
import { User } from '@/types/user';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function About() {
  const t = await getTranslations('/about/contributors');

  let userCbb: User | undefined;
  let userGaby: User | undefined;
  let userJule: User | undefined;
  let userNikolaj: User | undefined;
  let userNils: User | undefined;

  try {
    userCbb = await getUser('cbb');
  } catch (e) {}

  try {
    userGaby = await getUser('gabymassif');
  } catch (e) {}

  try {
    userJule = await getUser('jule');
  } catch (e) {}

  try {
    userNikolaj = await getUser('nikolaj.jb');
  } catch (e) {}

  try {
    userNils = await getUser('nils');
  } catch (e) {}

  return (
    <div className="h-[calc(100dvh)] flex flex-col">
      <Header />

      <PageTitle title={t('pageTitle')} />

      <div className="mx-2 mt-2 flex flex-col items-center text-center overflow-y-auto">
        <div className="mt-2 text-lg">{t('sectionMainContributors')}</div>

        {userNils && (
          <div className="flex flex-col gap-1 items-center">
            {/* @ts-ignore */}
            {t('textHeadOfDevelopment')} <UserCard user={userNils} />
          </div>
        )}

        {userNikolaj && (
          <div className="mt-4 flex flex-col gap-1 items-center">
            {/* @ts-ignore */}
            {t('textSpanishTranslation')} <UserCard user={userNikolaj} />
            <SocialLink platform={Platform.INSTAGRAM} path="p/DDEp2gZsB7e" pathNameOverride={t('lnkAnnouncement')} />
          </div>
        )}

        {userGaby && (
          <div className="mt-4 flex flex-col gap-1 items-center">
            {/* @ts-ignore */}
            {t('textFrenchTranslation')} <UserCard user={userGaby} />
            <SocialLink platform={Platform.INSTAGRAM} path="p/todo" pathNameOverride={t('lnkAnnouncement')} />
          </div>
        )}

        <div className="mt-6 text-lg">{t('sectionCommunityProposals')}</div>

        {userCbb && (
          <div className="flex flex-col gap-1 items-center">
            {/* @ts-ignore */}
            {t('textPersonalSchedule')} <UserCard user={userCBB} />
            <SocialLink platform={Platform.INSTAGRAM} path="p/C4P5MiQr9Uj" pathNameOverride={t('lnkAnnouncement')} />
          </div>
        )}

        {userJule && (
          <div className="mt-4 flex flex-col gap-1 items-center">
            {/* @ts-ignore */}
            {t('textSearchByGender')} <UserCard user={userJule} />
            <SocialLink platform={Platform.INSTAGRAM} path="p/C5scnaRrIo9" pathNameOverride={t('lnkAnnouncement')} />
          </div>
        )}
      </div>

      <Navigation>
        <Link href={routeAbout}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
}
