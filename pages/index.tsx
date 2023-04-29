import Button from '@/components/common/Button';
import Profile from '@/components/user/profile';
import { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  console.log(`version: ${process.env.NEXT_PUBLIC_COMMIT_SHA}`);
  const shortVer = process.env.NEXT_PUBLIC_COMMIT_SHA && process.env.NEXT_PUBLIC_COMMIT_SHA?.length > 7 ? process.env.NEXT_PUBLIC_COMMIT_SHA?.substring(0, 7) : process.env.NEXT_PUBLIC_COMMIT_SHA;

  // const { data: session, status } = useSession();

  // // user to localstorage
  // const username = session ? session.user.username : null;
  // if (username && status == 'authenticated' && login == '1') {
  //   router.push('/?login=0');
  //   router.reload();
  // }

  // if (username && status == 'authenticated' && login == '0') {
  //   localStorage.setItem('username', username);

  //   // save image
  //   const imageUrl = session ? session.user.imageUrl : null;
  //   if (imageUrl) {
  //     localStorage.setItem('imageUrl', imageUrl);
  //   }

  // }

  const setLocal = () => {
    console.log('foo');
    localStorage.setItem('foo', 'bar');
  };

  return (
    <>
      <div className="flex h-screen flex-col justify-center">
        {/* profile */}
        <div className="sm:block">
          <div className="m-6 flex justify-end">
            <Profile />
          </div>
        </div>

        {/* menu */}
        <div className="flex flex-grow flex-col justify-center">
          <div className="flex justify-center py-2">
            <Link href={'/results/'}>
              <Button text="Show Results" />
            </Link>
          </div>
          <div className="flex justify-center py-2">
            <Link href={'/jury/create'}>
              <Button text="Create Jury" />
            </Link>
          </div>
          <div className="flex justify-center py-2">
            <Link href={'/'}>
              <Button text="Join Jury" />
            </Link>
          </div>
        </div>
        <Button text="btn" onClick={setLocal} />
        <div>ver. {shortVer}</div>
      </div>
    </>
  );
};

export default Home;
