import MenuButton from '@/components/common/MenuButton';
import JudgeSelection from '@/components/jury/JudgeSelection';
import { NextPage } from 'next';
import { useCookies } from 'react-cookie';

const CreateJury: NextPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3000/v1/juries', {
      method: 'POST',
      body: JSON.stringify({
        judges: ['kevin', 'nils', 'samu'],
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
  const image1 =
    'https://scontent-muc2-1.xx.fbcdn.net/v/t31.18172-8/17492379_1395721013824677_2431623315541165382_o.jpg?_nc_cat=101&ccb=1-7&_nc_sid=174925&_nc_ohc=HxVgLT_npx4AX-WRSrd&_nc_ht=scontent-muc2-1.xx&oh=00_AfDNqfcc7VuvR0-bjrGcEHQA4Om_dOKr7xiHiS2Hu6-7Fg&oe=645399B7';

  const image2 =
    'https://scontent-frt3-2.xx.fbcdn.net/v/t39.30808-6/322393006_831212341299554_3330508460597125504_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=OY62GTZ-rNUAX9MvG6H&_nc_ht=scontent-frt3-2.xx&oh=00_AfBOw1csl1Lbt7C5Q2HrYhIY-lr3o5qJeG4KLZN8Kbt3jQ&oe=64396303';

  const image3 =
    'https://static.wixstatic.com/media/beedc1_dea19613168348f0b71c124cf29309f2~mv2.jpg/v1/fill/w_1322,h_1480,al_b,q_85,usm_0.66_1.00_0.01,enc_auto/beedc1_dea19613168348f0b71c124cf29309f2~mv2.jpg';

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex h-screen flex-col justify-center">
        <div className="flex flex-col items-center justify-center sm:flex-row">
          <JudgeSelection image={image1} />
          <JudgeSelection image={image2} />
          <JudgeSelection image={image3} />
        </div>

        <div className="flex justify-center">
          <div className="flex justify-center py-2">
            <MenuButton text="Start Session"></MenuButton>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateJury;
