import TextButton from '@/components/common/TextButton';
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import router from 'next/router';

const defaultImg = '/profile/user.svg';

const AccountImage = ({ session }: any) => {
  const [imageUrl, setImageUrl] = useState('');
  const [image, setImage] = useState<any>(null);
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
        <img src={createObjectURL ? createObjectURL : imageUrl ? imageUrl : defaultImg} className="mx-2 flex h-32 w-32 rounded-full object-cover" />
      </div>

      <div className="flex justify-center py-2">
        <input type="file" className="" onChange={uploadToClient} />
      </div>

      <div className="flex justify-center py-2">
        <div className="mx-1">
          <TextButton text="Delete" onClick={handleDeleteImageClicked} />
        </div>
        <div className="mx-1">
          <TextButton text="Upload" onClick={handleUploadImageClicked} />
        </div>
      </div>

      <div className="flex justify-center py-2">
        <Link href="/account">
          <TextButton text="Back" />
        </Link>
      </div>
    </div>
  );
};
export default AccountImage;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
