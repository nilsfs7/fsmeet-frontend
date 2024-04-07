import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SocialLink from '@/components/user/SocialLink';
import { getTotalMatchPerformance } from '@/services/fsmeet-backend/get-total-match-performance';
import { getUser } from '@/services/fsmeet-backend/get-user';
import { imgUserDefaultImg, imgVerifiedCheckmark, imgWorld } from '@/types/consts/images';
import { routeAccount, routeMap, routeUsers } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import { Platform } from '@/types/enums/platform';
import { UserType } from '@/types/enums/user-type';
import { TotalMatchPerformance } from '@/types/total-match-performance';
import { User } from '@/types/user';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ReactCountryFlag from 'react-country-flag';
import { countries } from 'countries-list';

const PublicUserProfile = (props: any) => {
  const session = props.session;
  const user: User = props.user;
  const matchStats: TotalMatchPerformance = props.matchStats;

  const router = useRouter();

  let displayName = user.firstName ? `${user.firstName}` : `${user.username}`;
  if (user.lastName) {
    displayName = `${displayName}`;
  }

  function getCountryNameByCode(code: string): string {
    // @ts-ignore: next-line
    const country = countries[code.toUpperCase()];
    return country ? country.name : null;
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div className="overflow-hidden overflow-y-auto h-full">
        <div className="flex flex-col items-center justify-center">
          <div className="m-2 text-3xl">{user.username}</div>

          <div className="w-64">
            <div className="flex h-96">
              <img className="h-full w-full rounded-lg border border-primary object-cover shadow-xl shadow-primary" src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} alt="user-image" />
            </div>

            <div className="mx-2 mt-6">
              <div className="flex items-start gap-1 text-lg">
                {user.isVerifiedAccount && (
                  <div className="h-6 w-6 hover:p-0.5 flex items-center">
                    <img className="" src={imgVerifiedCheckmark} alt="user verified checkmark" />
                  </div>
                )}

                <div className="w-fit">
                  {user.firstName && user.lastName && <div>{`${user.firstName} ${user.lastName}`}</div>}
                  {user.firstName && !user.lastName && <div>{`${user.firstName}`}</div>}
                </div>
              </div>

              {user.country && user.country != '--' && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex w-6 hover:p-0.5">
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
                  <div className="w-6 hover:p-0.5">
                    <Link href={`${routeMap}?user=${user.username}&lat=${user.locLatitude}&lng=${user.locLongitude}`}>
                      <img src={imgWorld} className="rounded-full object-cover" />
                    </Link>
                  </div>

                  <div className="w-fit">
                    <Link className="hover:underline" href={`${routeMap}?user=${user.username}&lat=${user.locLatitude}&lng=${user.locLongitude}`}>
                      {user.city}
                    </Link>
                  </div>
                </div>
              )}

              <Accordion className="mt-1" type="single" collapsible>
                {(user.instagramHandle || user.tikTokHandle || user.youTubeHandle || user.website) && (
                  <AccordionItem value="item-socials">
                    <AccordionTrigger>{`Socials`}</AccordionTrigger>
                    <AccordionContent>
                      <div className="">
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

                {user.type === UserType.FREESTYLER && (
                  <AccordionItem value="item-matches">
                    <AccordionTrigger>{`Battle Statistics`}</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2">
                        <div>{`Matches`}</div>
                        <div>{matchStats.matches}</div>

                        {matchStats.matches > 0 && (
                          <>
                            <div>{`Wins`}</div>
                            <div>{`${matchStats.wins} `}</div>

                            <div>{`Win ratio`}</div>
                            <div>{`${(matchStats.ratio * 100).toFixed(2)}%`}</div>
                          </>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <Navigation>
        {/* <Link href={routeHome}> */}
        <ActionButton action={Action.BACK} onClick={() => router.back()} />
        {/* </Link> */}

        {session?.user?.username === user.username && (
          <Link href={routeAccount}>
            <ActionButton action={Action.EDIT} />
          </Link>
        )}
      </Navigation>
    </div>
  );
};

export default PublicUserProfile;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  const username = context.params?.username;

  if (username) {
    try {
      const user = await getUser(username.toString());

      const matchStats = await getTotalMatchPerformance(username.toString());

      return {
        props: {
          user: user,
          matchStats: matchStats,
          session: session,
        },
      };
    } catch (error: any) {
      console.error(error);
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: routeUsers,
    },
  };
};
