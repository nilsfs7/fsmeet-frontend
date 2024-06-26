import TextButton from '@/components/common/TextButton';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import router from 'next/router';
import { imgUserDefaultImg } from '@/types/consts/images';
import Navigation from '@/components/Navigation';
import ActionButton from '@/components/common/ActionButton';
import { routeAccount, routeLogin } from '@/types/consts/routes';
import { Action } from '@/types/enums/action';
import { ButtonStyle } from '@/types/enums/button-style';
import { validateSession } from '@/types/funcs/validate-session';
import { GetServerSidePropsContext } from 'next';
import { getUser } from '@/services/fsmeet-backend/get-user';
import { deleteUserImage } from '@/services/fsmeet-backend/delete-user-image';
import { updateUserImage } from '@/services/fsmeet-backend/update-user-image';
import { Toaster, toast } from 'sonner';
import { auth } from '@/auth';

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
    try {
      const imageUrl = await updateUserImage(image, session);

      setImageUrl(imageUrl);
      localStorage.setItem('imageUrl', imageUrl);
      router.replace(routeAccount);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleDeleteImageClicked = async () => {
    try {
      await deleteUserImage(session);

      setImageUrl('');
      localStorage.removeItem('imageUrl');
      router.replace(routeAccount);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser(session?.user?.username, session);
      if (user.imageUrl) {
        setImageUrl(user.imageUrl);
      }
    }
    fetchUser();
  }, []);

  return (
    <>
      <Toaster richColors />

      <div className="h-[calc(100dvh)] flex flex-col">
        <div className="flex justify-center py-2">
          <img src={createObjectURL ? createObjectURL : imageUrl ? imageUrl : imgUserDefaultImg} className="mx-2 flex h-32 w-32 rounded-full object-cover border border-primary" />
        </div>

        <div className="flex justify-center py-2">
          <input type="file" onChange={uploadToClient} />
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
    </>
  );
};
export default AccountImage;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await auth(context);

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
