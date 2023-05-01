import Button from '@/components/common/Button';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';

const defaultImg = '/profile/default-pfp.png';

const Account = ({ session }: any) => {
  const [imageUrl, setImageUrl] = useState('');
  const [image, setImage] = useState<any>(null);
  const [createObjectURL, setCreateObjectURL] = useState('');

  const handleBackToHomeClicked = () => {
    router.replace('/');
  };

  const handleLogoutClicked = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem('username');
    localStorage.removeItem('imageUrl');
    router.push('/');
  };

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
      method: 'PUT',
      body: reqBody,
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    if (response.status === 200) {
      const resBody = await response.json();
      setImageUrl(resBody.imageUrl);
      localStorage.setItem('imageUrl', resBody.imageUrl);
      console.log(imageUrl);
      // TODO: feedback
    } else {
      console.error('failed to upload image');
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
    <>
      <div className="flex h-screen columns-2 flex-col justify-center">
        <div>
          <div className="flex justify-center py-2">
            <img src={createObjectURL ? createObjectURL : imageUrl ? imageUrl : defaultImg} className="mx-2 flex h-10 w-10 rounded-full object-cover" />
          </div>

          <div className="flex justify-center py-2">
            {/* <label className="pr-4">Image:</label> */}
            <input type="file" className="" onChange={uploadToClient} />
          </div>
          <div className="flex justify-center py-2">
            <Button text="Upload image" onClick={handleUploadImageClicked} />
          </div>
        </div>

        <div className="flex justify-center pt-20">
          <Button text="Back to home" onClick={handleBackToHomeClicked} />
        </div>

        <div className="flex justify-center py-2">
          <Button text="Logout" onClick={handleLogoutClicked} />
        </div>
      </div>
    </>
  );
};
export default Account;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  return {
    props: {
      session,
    },
  };
}
