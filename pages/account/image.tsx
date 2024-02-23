import TextButton from '@/components/common/TextButton';
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import router from 'next/router';
import { imgUserNoImg } from '@/types/consts/images';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { routeAccount, routeLogin } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import { ButtonStyle } from '@/types/enums/button-style';
import { validateSession } from '@/types/funcs/validate-session';
import { GetServerSidePropsContext } from 'next';

const AccountImage = ({ session }: any) => {
  const [imageUrl, setImageUrl] = useState('');
  const [image, setImage] = useState<any>();
  const [createObjectURL, setCreateObjectURL] = useState('');

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const handleUploadImageClicked = async () => {
    const reqBody = new FormData();
    reqBody.append('file', image);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/image`, {
      method: 'PATCH',
      body: reqBody,
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    if (response.status === 200) {
      const resBody = await response.json();
      setImageUrl(resBody.imageUrl);
      localStorage.setItem('imageUrl', resBody.imageUrl);
      router.replace('/account');
    } else {
      console.error('failed to upload image');
    }
  };

  const handleDeleteImageClicked = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/image`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    if (response.status === 200) {
      setImageUrl('');
      localStorage.removeItem('imageUrl');
      router.replace('/account');
    } else {
      console.error('failed to delete image');
    }
  };

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users/${session?.user?.username}`);
      const user = await res.json();
      setImageUrl(user.imageUrl);
    }
    fetchUser();
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col justify-center">
      <div className="flex justify-center py-2">
        <img src={createObjectURL ? createObjectURL : imageUrl ? imageUrl : imgUserNoImg} className="mx-2 flex h-32 w-32 rounded-full object-cover" />
      </div>

      <div className="flex justify-center py-2">
        <input type="file" className="" onChange={uploadToClient} />
      </div>

      <div className="flex justify-center py-2">
        {imageUrl && imageUrl.length > 0 && (
          <div className="mx-1">
            <TextButton text="Delete" onClick={handleDeleteImageClicked} style={ButtonStyle.CRITICAL} />
          </div>
        )}

        {createObjectURL && createObjectURL.length > 0 && (
          <div className="mx-1">
            <TextButton text="Upload" onClick={handleUploadImageClicked} />
          </div>
        )}
      </div>

      <Navigation>
        <Link href={routeAccount}>
          <ActionButton action={Action.BACK} />
        </Link>
      </Navigation>
    </div>
  );
};
export default AccountImage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context);

  if (!validateSession(session)) {
    return {
      redirect: {
        permanent: false,
        destination: routeLogin,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
