import { useState } from 'react';
import TextButton from '@/components/common/TextButton';
import TextInput from '@/components/common/TextInput';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';
import { routeLogin } from '@/types/consts/routes';
import { updateUserPassword } from '@/services/fsmeet-backend/update-user-password';
import { Toaster, toast } from 'sonner';

const ResetPassword = () => {
  const router = useRouter();
  const { requestToken } = router.query;

  const [password, setPassword] = useState('');

  const handleInputChangePassword = (event: any) => {
    const hashedPassword = bcrypt.hashSync(event.target.value, '$2a$10$CwTycUXWue0Thq9StjUM0u');
    setPassword(hashedPassword);
  };

  const handleInputKeypressPassword = (e: any) => {
    if (e.keyCode === 13) {
      handleSaveClicked();
    }
  };

  const handleSaveClicked = async () => {
    if (requestToken) {
      try {
        await updateUserPassword(requestToken?.toString(), password);
        router.replace(routeLogin);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <Toaster richColors />

      <div className="absolute inset-0 flex flex-col">
        <div className="p-2 h-full grid overflow-y-auto">
          <div className="h-full flex flex-col items-center justify-center">
            <div className="m-2 flex flex-col rounded-lg bg-secondary-light p-1">
              <TextInput
                id={'password'}
                type={'password'}
                label={'New password'}
                placeholder="Ball&Chill2021"
                onChange={(e) => {
                  handleInputChangePassword(e);
                }}
                onKeyDown={handleInputKeypressPassword}
              />
            </div>

            <div className="flex justify-center py-2">
              <TextButton text="Save" onClick={handleSaveClicked} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
