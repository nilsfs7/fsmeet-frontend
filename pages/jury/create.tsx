import Button from '@/components/common/Button';
import JudgeSelection from '@/components/jury/JudgeSelection';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import Dropdown, { MenuItem } from '@/components/common/Dropdown';
import { getSession } from 'next-auth/react';
import router from 'next/router';

const CreateJury: NextPage = (props: any) => {
  const users = props.data;
  const session = props.session;

  if (!session) {
    router.push('/login');
  }

  const [judge1, setJudge1] = useState({ name: '', isHeadJudge: false, imageUrl: null });
  const [judge2, setJudge2] = useState({ name: '', isHeadJudge: true, imageUrl: null });
  const [judge3, setJudge3] = useState({ name: '', isHeadJudge: false, imageUrl: null });
  const [judgesList, setJudgesList] = useState([{ text: '', value: '' }]);

  function getUserByName(name: string) {
    return users.filter((u: any) => {
      return u.username == name;
    })[0];
  }

  const onChangeJudge1 = (name: string) => {
    setJudge1({ name: name, isHeadJudge: judge1.isHeadJudge, imageUrl: getUserByName(name).imageUrl });
  };

  const onChangeJudge3 = (name: string) => {
    setJudge3({ name: name, isHeadJudge: judge3.isHeadJudge, imageUrl: getUserByName(name).imageUrl });
  };

  const onStartSession = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/juries`, {
      method: 'POST',
      body: JSON.stringify({
        judges: [
          {
            name: judge1.name,
            isHeadJudge: judge1.isHeadJudge,
          },
          {
            name: judge2.name,
            isHeadJudge: judge2.isHeadJudge,
          },
          {
            name: judge3.name,
            isHeadJudge: judge3.isHeadJudge,
          },
        ],
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    const body = await response.json();
  };

  useEffect(() => {
    if (session?.user?.username) {
      setJudge2({ name: session.user.username, isHeadJudge: judge2.isHeadJudge, imageUrl: getUserByName(session.user.username).imageUrl });

      const menusJudges: MenuItem[] = [];
      users.map((user: any) => {
        if (user.username != judge2.name) {
          menusJudges.push({ text: user.username, value: user.username });
        }
      });
      setJudgesList(menusJudges);
    }
  }, [judge2.name]);

  return (
    <div className="flex h-screen flex-col justify-center">
      <div className="flex flex-col items-center justify-center sm:flex-row">
        <JudgeSelection image={judge1.imageUrl} isHeadJudge={judge1.isHeadJudge} />
        <JudgeSelection image={judge2.imageUrl} isHeadJudge={judge2.isHeadJudge} />
        <JudgeSelection image={judge3.imageUrl} isHeadJudge={judge3.isHeadJudge} />
      </div>

      <div className="flex flex-col items-center justify-center sm:flex-row">
        <div className="m-2">
          <Dropdown menus={judgesList} defaultMenu={{ text: '', value: '' }} onChange={onChangeJudge1} />
        </div>
        <div className="m-2">
          <Dropdown menus={[{ text: judge2.name, value: judge2.name }]} disabled={true} onChange={() => {}} />
        </div>
        <div className="m-2">
          <Dropdown menus={judgesList} defaultMenu={{ text: '', value: '' }} onChange={onChangeJudge3} />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex justify-center py-2">
          <Button text="Start Session" onClick={onStartSession} />
        </div>
      </div>
    </div>
  );
};

export default CreateJury;

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/users`);
  const data = await response.json();

  return {
    props: {
      data: data,
      session: session,
    },
  };
};
