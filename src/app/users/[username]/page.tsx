import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SocialLink from '@/components/user/SocialLink';
import { imgUserDefaultImg, imgVerifiedCheckmark, imgWorld } from '@/domain/constants/images';
import { routeAccount, routeMap } from '@/domain/constants/routes';
import { Action } from '@/domain/enums/action';
import { Platform } from '@/domain/enums/platform';
import { UserType } from '@/domain/enums/user-type';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';
import { getUserTypeImages, getUserTypeLabels } from '@/functions/user-type';
import { UserVerificationState } from '@/domain/enums/user-verification-state';
import { Header } from '@/components/Header';
import { auth } from '@/auth';
import { getUser } from '@/infrastructure/clients/user.client';
import { TechnicalUser } from '@/domain/enums/technical-user';
import NavigateBackButton from '@/components/NavigateBackButton';
import { ActionButtonDeleteUser } from './components/action-button-delete-user';
import { getTranslations } from 'next-intl/server';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { getAchievements } from '@/infrastructure/clients/achievements';
import { AchievementLevel } from '@/domain/enums/achievement-level';
import { AccordionContentBattleHistory } from './components/accordion-content-battle-history';
import { AccordionContentMatchStats } from './components/accordion-content-match-stats';

const getAchievementStyle = (level: AchievementLevel): string => {
  switch (level) {
    case AchievementLevel.BRONZE:
      return 'border border-bronze shadow-bronze shadow-inner';

    case AchievementLevel.SILVER:
      return 'border border-silver shadow-silver shadow-inner';

    case AchievementLevel.GOLD:
      return 'border border-gold shadow-gold shadow-inner';

    default:
      return '';
  }
};

export default async function PublicUserProfile({ params }: { params: { username: string } }) {
  const t = await getTranslations('/users/username');
  const session = await auth();

  const [user, achievements] = await Promise.all([getUser(params.username), getAchievements(params.username)]);

  return (
    <>
      <div className="h-[calc(100dvh)] flex flex-col">
        <Header />

        <div className="h-full overflow-y-auto">
          <div className="flex flex-col items-center justify-center ">
            <div className="w-64">
              <div className="mt-6 flex aspect-[4/5]">
                <img className="h-full w-full object-cover rounded-lg border border-primary shadow-xl shadow-primary" src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} alt="user-image" />
              </div>

              <div className="mx-2 mt-6">
                <div className="flex items-start gap-1 text-lg">
                  {user.verificationState === UserVerificationState.VERIFIED && (
                    <div className="h-6 w-6 flex items-center">
                      <img src={imgVerifiedCheckmark} alt="user verified checkmark" />
                    </div>
                  )}

                  <div className="w-fit">
                    {user.nickName && <div>{user.nickName}</div>}
                    {user.firstName && user.lastName && <div>{`${user.firstName} ${user.lastName}`}</div>}
                    {user.firstName && !user.lastName && <div>{`${user.firstName}`}</div>}
                  </div>
                </div>

                <div className="flex items-start gap-1 mt-1">
                  <div className="w-6">
                    <img src={getUserTypeImages(user.type, user.gender).path} className="object-cover" />
                  </div>

                  <div className="w-fit">{getUserTypeLabels(user.type, t)}</div>
                </div>

                {user.country && user.country != '--' && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex w-6">
                      <ReactCountryFlag
                        countryCode={user.country}
                        svg
                        style={{
                          width: '100%',
                        }}
                        title={user.country}
                      />
                    </div>

                    <div>{getCountryNameByCode(user.country)}</div>
                  </div>
                )}

                {user.city && (
                  <div className="flex items-start gap-1 mt-1">
                    <div className="w-6">
                      <Link href={`${routeMap}?user=${user.username}&lat=${user.locLatitude}&lng=${user.locLongitude}&zoom=7`}>
                        <img src={imgWorld} className="rounded-full object-cover" />
                      </Link>
                    </div>

                    <div className="w-fit">
                      <Link className="hover:underline" href={`${routeMap}?user=${user.username}&lat=${user.locLatitude}&lng=${user.locLongitude}&zoom=7`}>
                        {user.city}
                      </Link>
                    </div>
                  </div>
                )}

                <Accordion className="mt-1" type="single" collapsible>
                  {(user.instagramHandle || user.tikTokHandle || user.youTubeHandle || user.website) && (
                    <AccordionItem value="item-socials">
                      <AccordionTrigger>{t('accordionItemSocials')}</AccordionTrigger>
                      <AccordionContent>
                        <div>
                          {user.instagramHandle && (
                            <div className="mt-1 w-fit">
                              <SocialLink platform={Platform.INSTAGRAM} path={user.instagramHandle} />
                            </div>
                          )}

                          {user.tikTokHandle && (
                            <div className="mt-1 w-fit">
                              <SocialLink platform={Platform.TIKTOK} path={user.tikTokHandle} />
                            </div>
                          )}

                          {user.youTubeHandle && (
                            <div className="mt-1 w-fit">
                              <SocialLink platform={Platform.YOUTUBE} path={user.youTubeHandle} />
                            </div>
                          )}

                          {user.website && (
                            <div className="mt-1 w-fit">
                              <SocialLink platform={Platform.WEBSITE} path={user.website} />
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {achievements.length > 0 && (
                    <AccordionItem value="item-achievements">
                      <AccordionTrigger>{t('accordionItemAchievements')}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-3 justify-center gap-2">
                          {achievements.map((achievement, i) => {
                            return (
                              <div key={`achievement-${i}`} className="flex flex-col items-center w-16 justify-self-centers">
                                <img src={achievement.imageUrl} className={`h-12 w-12 rounded-full object-cover ${getAchievementStyle(achievement.level)}`} alt={achievement.name} />

                                <div className="text-xs text-center">{achievement.name}</div>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {user.type === UserType.FREESTYLER && (
                    <AccordionItem value="item-matches">
                      <AccordionTrigger>{t('accordionItemBattleStatistics')}</AccordionTrigger>
                      <AccordionContentMatchStats username={params.username} />
                    </AccordionItem>
                  )}

                  {user.type === UserType.FREESTYLER && (
                    <AccordionItem value="item-history">
                      <AccordionTrigger>{t('accordionItemCompetitionHistory')}</AccordionTrigger>
                      <AccordionContentBattleHistory username={params.username} />
                    </AccordionItem>
                  )}
                </Accordion>
              </div>
            </div>
          </div>
        </div>

        <Navigation>
          <NavigateBackButton />

          <div className="flex justify-end gap-1">
            {session?.user?.username === TechnicalUser.ADMIN && <ActionButtonDeleteUser username={user.username} />}

            {session?.user?.username === user.username && (
              <Link href={routeAccount}>
                <ActionButton action={Action.EDIT} />
              </Link>
            )}
          </div>
        </Navigation>
      </div>
    </>
  );
}
