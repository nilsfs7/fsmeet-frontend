import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SocialLink from '@/components/user/SocialLink';
import { getTotalMatchPerformance } from '@/services/fsmeet-backend/get-total-match-performance';
import { getUser } from '@/services/fsmeet-backend/get-user';
import { imgUserDefaultImg, imgVerifiedCheckmark } from '@/types/consts/images';
import { routeAccount, routeUsers } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import { Platform } from '@/types/enums/platform';
import { TotalMatchPerfromance } from '@/types/total-match-performance';
import { User } from '@/types/user';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const PublicUserProfile = (props: any) => {
  const session = props.session;
  const user: User = props.user;
  const matchStats: TotalMatchPerfromance = props.matchStats;

  const router = useRouter();

  let displayName = user.firstName ? `${user.firstName}` : `${user.username}`;
  if (user.lastName) {
    displayName = `${displayName}`;
  }

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div className="overflow-hidden overflow-y-auto h-full">
        <div className="flex flex-col items-center justify-center">
          <div className="m-2 text-3xl">{user.username}</div>

          <div>
            <div className="flex h-96 w-64">
              <img className="h-full w-full rounded-lg border border-primary object-cover shadow-xl shadow-primary" src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} alt="user-image" />
            </div>

            <div className="mx-2 mt-6 ">
              <div className="h-8 flex items-center text-lg">
                {user.firstName && user.lastName && <div>{`${user.firstName} ${user.lastName}`}</div>}
                {user.firstName && !user.lastName && <div>{`${user.firstName}`}</div>}
                {user.isVerifiedAccount && <img className="h-8 p-1 hover:p-0" src={imgVerifiedCheckmark} alt="user verified checkmark" />}
              </div>

              <Accordion type="single" collapsible>
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
