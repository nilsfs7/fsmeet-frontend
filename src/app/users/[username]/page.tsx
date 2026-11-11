import { IconMapPin } from '@tabler/icons-react';
import Navigation from '@/components/navigation';
import ActionButton from '@/components/common/action-button';
import { imgUserDefaultImg, imgVerifiedCheckmark } from '@/domain/constants/images';
import { routeAccount, routeMap, routeUsers } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { UserType } from '@/domain/enums/user-type';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';
import { getUserTypeLabels } from '@/functions/user-type';
import { UserTypeIcon } from '@/components/user/user-type-icon';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
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
import { JobProfileState } from '@/domain/enums/job-profile-state';
import { ProfileSocials } from './components/profile-socials';
import { ProfileMatchStats } from './components/profile-match-stats';
import { ProfileAchievements } from './components/profile-achievements';
import { ProfileCompetitionHistory } from './components/profile-competition-history';
import { BookViaFreestyleActsButton } from './components/book-via-freestyleacts-button';

const constrainedContentClass = cn(appShellContentClass, 'max-w-content');

const profileChipClass = 'inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-foreground transition-colors';

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
  const [t, session, user] = await Promise.all([getTranslations('/users/username'), auth(), getUser(params.username)]);
  const showBookCta = user.jobProfileState === JobProfileState.APPROVED;

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      <JsonLd data={buildPersonJsonLd(user)} />

      <div className={cn('mt-2 flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-none', constrainedContentClass)}>
        <div className="flex w-full min-w-0 flex-col gap-6 pb-6 pt-4 md:pt-6">
          <div className="grid w-full min-w-0 grid-cols-1 gap-6 rounded-3xl border border-border bg-background p-4 shadow-xs sm:p-6 md:grid-cols-[minmax(0,18rem)_1fr] md:items-start md:gap-8">
            <div className="mx-auto w-full max-w-xs md:mx-0 md:max-w-none">
              <div className="flex aspect-4/5 overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-border">
                <img className="h-full w-full object-cover" src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} alt="user-image" />
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-5">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h1 className="flex items-center gap-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                    <span className="min-w-0 wrap-break-word">{getUserDisplayName(user)}</span>
                    {user.verificationState === UserVerificationState.VERIFIED && <img className="h-6 w-6 shrink-0" src={imgVerifiedCheckmark} alt="user verified checkmark" />}
                  </h1>
                  {user.nickName && user.firstName && <div className="text-base text-muted-foreground">{[user.firstName, user.lastName].filter(Boolean).join(' ')}</div>}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={profileChipClass}>
                    <UserTypeIcon userType={user.type} />
                    {getUserTypeLabels(user.type, t)}
                  </span>

                  {user.countryCode && user.countryCode != '--' && (
                    <span className={profileChipClass}>
                      <ReactCountryFlag countryCode={user.countryCode} svg style={{ width: '1rem', height: '0.75rem', borderRadius: '2px' }} title={user.countryCode} />
                      {getCountryNameByCode(user.countryCode)}
                    </span>
                  )}

                  {user.city && (
                    <Link className={cn(profileChipClass, 'hover:border-foreground/20 hover:bg-muted')} href={`${routeMap}?user=${user.username}&lat=${user.locLatitude}&lng=${user.locLongitude}&zoom=7`}>
                      <IconMapPin className="h-4 w-4 text-muted-foreground" stroke={1.75} aria-hidden />
                      {user.city}
                    </Link>
                  )}
                </div>
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
