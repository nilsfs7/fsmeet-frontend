import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { imgUserDefaultImg, imgVerifiedCheckmark, imgWorld } from '@/domain/constants/images';
import { routeAccount, routeMap, routeUsers } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { UserType } from '@/domain/enums/user-type';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';
import { getUserTypeImages, getUserTypeLabels } from '@/functions/user-type';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { Header } from '@/components/header';
import { auth } from '@/auth';
import { getUser } from '@/infrastructure/clients/user.client';
import { AdministrativeUser } from '@/domain/enums/administrative-user';
import NavigateBackButton from '@/components/navigate-back-button';
import { ActionButtonDeleteUser } from './components/action-button-delete-user';
import { getTranslations } from 'next-intl/server';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { cn } from '@/lib/utils';
import { appShellContentClass } from '@/components/layout/app-shell-content';
import type { Metadata } from 'next';
import type { User } from '@/domain/types/user';
import { toAbsoluteUrl, truncateMetaDescription } from '@/lib/site-url';
import { JsonLd } from '@/components/seo/json-ld';
import { buildPersonJsonLd } from '@/lib/json-ld';
import { JobProfileListingState } from '@/domain/enums/job-profile-listing-state';
import { ProfileSocials } from './components/profile-socials';
import { ProfileMatchStats } from './components/profile-match-stats';
import { ProfileAchievements } from './components/profile-achievements';
import { ProfileCompetitionHistory } from './components/profile-competition-history';
import { BookViaFreestyleActsButton } from './components/book-via-freestyleacts-button';

const constrainedContentClass = cn(appShellContentClass, 'max-w-content');

function getUserDisplayName(user: User): string {
  if (user.nickName?.trim()) return user.nickName.trim();
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return fullName || user.username;
}

export async function generateMetadata(props: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await props.params;

  try {
    const user = await getUser(username);
    const displayName = getUserDisplayName(user);
    const typeLabel = getUserTypeLabels(user.type, null);
    const country =
      user.countryCode && user.countryCode !== '--' ? getCountryNameByCode(user.countryCode) || user.countryCode : '';
    const description = truncateMetaDescription(
      [typeLabel && `${typeLabel} on FSMeet`, country].filter(Boolean).join(' · ') || `${displayName} on FSMeet`,
    );
    const image = toAbsoluteUrl(user.imageUrl);
    const canonicalPath = `${routeUsers}/${encodeURIComponent(user.username)}`;

    return {
      title: displayName,
      description,
      alternates: { canonical: canonicalPath },
      openGraph: {
        type: 'profile',
        title: displayName,
        description,
        url: canonicalPath,
        ...(image ? { images: [{ url: image }] } : {}),
      },
      twitter: {
        card: image ? 'summary_large_image' : 'summary',
        title: displayName,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return { title: 'Profile' };
  }
}

export default async function PublicUserProfile(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const t = await getTranslations('/users/username');
  const session = await auth();

  const user = await getUser(params.username);
  const showBookCta = user.jobProfileListingState === JobProfileListingState.APPROVED;

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <JsonLd data={buildPersonJsonLd(user)} />

      <Header />

      <div className={cn('mt-2 flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-none', constrainedContentClass)}>
        <div className="flex w-full min-w-0 flex-col gap-6 pb-6 pt-4 md:pt-6">
          <div className="grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-[minmax(0,20rem)_1fr] md:items-start">
            <div className="mx-auto w-full max-w-sm md:mx-0 md:max-w-none">
              <div className="flex aspect-4/5">
                <img
                  className="h-full w-full rounded-lg border border-primary object-cover shadow-xl shadow-primary"
                  src={user.imageUrl ? user.imageUrl : imgUserDefaultImg}
                  alt="user-image"
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-1 text-lg">
                  {user.verificationState === UserVerificationState.VERIFIED && (
                    <div className="flex h-6 w-6 items-center">
                      <img src={imgVerifiedCheckmark} alt="user verified checkmark" />
                    </div>
                  )}

                  <div className="w-fit">
                    {user.nickName && <div>{user.nickName}</div>}
                    {user.firstName && user.lastName && <div>{`${user.firstName} ${user.lastName}`}</div>}
                    {user.firstName && !user.lastName && <div>{`${user.firstName}`}</div>}
                  </div>
                </div>

                <div className="flex items-start gap-1">
                  <div className="w-6">
                    <img src={getUserTypeImages(user.type, user.gender).path} className="object-cover" alt="" />
                  </div>
                  <div className="w-fit">{getUserTypeLabels(user.type, t)}</div>
                </div>

                {user.countryCode && user.countryCode != '--' && (
                  <div className="flex items-center gap-1">
                    <div className="flex w-6">
                      <ReactCountryFlag
                        countryCode={user.countryCode}
                        svg
                        style={{
                          width: '100%',
                        }}
                        title={user.countryCode}
                      />
                    </div>
                    <div>{getCountryNameByCode(user.countryCode)}</div>
                  </div>
                )}

                {user.city && (
                  <div className="flex items-start gap-1">
                    <div className="w-6">
                      <Link href={`${routeMap}?user=${user.username}&lat=${user.locLatitude}&lng=${user.locLongitude}&zoom=7`}>
                        <img src={imgWorld} className="rounded-full object-cover" alt="" />
                      </Link>
                    </div>
                    <div className="w-fit">
                      <Link className="hover:underline" href={`${routeMap}?user=${user.username}&lat=${user.locLatitude}&lng=${user.locLongitude}&zoom=7`}>
                        {user.city}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <ProfileSocials user={user} />

              {showBookCta && <BookViaFreestyleActsButton username={user.username} />}

              <ProfileAchievements username={params.username} />
            </div>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-6">
            {user.type === UserType.FREESTYLER && <ProfileMatchStats username={params.username} />}

            {user.type === UserType.FREESTYLER && <ProfileCompetitionHistory username={params.username} />}
          </div>
        </div>
      </div>

      <Navigation>
        <NavigateBackButton />

        <div className="flex justify-end gap-1">
          {session?.user?.username === AdministrativeUser.ADMIN && <ActionButtonDeleteUser username={user.username} />}

          {session?.user?.username === user.username && <ActionButton href={routeAccount} action={Action.EDIT} />}
        </div>
      </Navigation>
    </div>
  );
}
