import MenuButton from '@/components/menu/MenuButton';
import { NextPage } from 'next';
import { useCookies } from 'react-cookie';

const CreateJury: NextPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    console.log(cookies.jwt);
    const response = await fetch('http://localhost:3000/v1/juries', {
      method: 'POST',
      body: JSON.stringify({
        judges: ['max', 'lisa'],
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.jwt}`,
      },
    });
    const body = await response.json();
    console.log(body);
  };

  return (
    <div className="flex h-screen flex-col justify-center">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center py-2"></div>

        <div className="flex justify-center py-2">
          <MenuButton text="create"></MenuButton>
        </div>
      </form>
    </div>
  );
};

export default CreateJury;
