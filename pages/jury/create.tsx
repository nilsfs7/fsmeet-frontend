import MenuButton from '@/components/common/MenuButton';
import JudgeSelection from '@/components/jury/JudgeSelection';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';
import Dropdown from '@/components/common/Dropdown';

const CreateJury: NextPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const [judge1, setJudge1] = useState({ name: '', isHeadJudge: false });
  const [judge2, setJudge2] = useState({ name: '', isHeadJudge: true });
  const [judge3, setJudge3] = useState({ name: '', isHeadJudge: false });

  useEffect(() => {
    const decoded: any = jwt_decode(cookies.jwt);
    console.log(decoded);
    setJudge2({ name: decoded.username, isHeadJudge: true });
  }, [judge2.name]);

  const onStartSession = async () => {
    const response = await fetch('http://localhost:3000/v1/juries', {
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
        Authorization: `Bearer ${cookies.jwt}`,
      },
    });
    const body = await response.json();
    console.log(body);
  };

  // TODO: remove

  const image1 = null;
  //   'https://scontent-frt3-2.xx.fbcdn.net/v/t39.30808-6/322393006_831212341299554_3330508460597125504_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=OY62GTZ-rNUAX9MvG6H&_nc_ht=scontent-frt3-2.xx&oh=00_AfBOw1csl1Lbt7C5Q2HrYhIY-lr3o5qJeG4KLZN8Kbt3jQ&oe=64396303';

  const image2 =
    'https://scontent-muc2-1.xx.fbcdn.net/v/t31.18172-8/17492379_1395721013824677_2431623315541165382_o.jpg?_nc_cat=101&ccb=1-7&_nc_sid=174925&_nc_ohc=HxVgLT_npx4AX-WRSrd&_nc_ht=scontent-muc2-1.xx&oh=00_AfDNqfcc7VuvR0-bjrGcEHQA4Om_dOKr7xiHiS2Hu6-7Fg&oe=645399B7';

  const image3 =
    'https://static.wixstatic.com/media/beedc1_dea19613168348f0b71c124cf29309f2~mv2.jpg/v1/fill/w_1322,h_1480,al_b,q_85,usm_0.66_1.00_0.01,enc_auto/beedc1_dea19613168348f0b71c124cf29309f2~mv2.jpg';

  return (
    <div className="flex h-screen flex-col justify-center">
      <div className="flex flex-col items-center justify-center sm:flex-row">
        <JudgeSelection image={image1} isHeadJudge={judge1.isHeadJudge} />
        <JudgeSelection image={image2} isHeadJudge={judge2.isHeadJudge} />
        <JudgeSelection image={image3} isHeadJudge={judge3.isHeadJudge} />
      </div>

      <div className="flex flex-col items-center justify-center sm:flex-row">
        <div className="m-2">
          <Dropdown menus={[]} defaultMenu={{ text: '', value: '' }} onChange={() => {}} />
        </div>
        <div className="m-2">
          <Dropdown menus={[{ text: judge2.name, value: judge2.name }]} onChange={() => {}} />
        </div>
        <div className="m-2">
          <Dropdown menus={[]} defaultMenu={{ text: '', value: '' }} onChange={() => {}} />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex justify-center py-2">
          <MenuButton text="Start Session" onClick={onStartSession} />
        </div>
      </div>
    </div>
  );
};

export default CreateJury;
