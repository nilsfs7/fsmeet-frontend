import { NextPage } from 'next';
import { useCookies } from 'react-cookie';
import Button from '@/components/common/Button';
import router from 'next/router';

const Logout: NextPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    removeCookie('jwt');
    router.push('/');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex h-screen columns-2 flex-col justify-center">
          <div className="flex justify-center py-2">
            <Button text="Logout" />
          </div>
        </div>
      </form>
    </>
  );
};

export default Logout;
