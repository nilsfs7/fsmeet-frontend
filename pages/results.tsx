import PlayerResult from '@/components/PlayerResult';
import { NextPage } from 'next';

const Results: NextPage = () => {
  return (
    <div>
      <h1 className="flex justify-center pb-24 pt-32 text-7xl">Battle Result</h1>
      <div className="grid grid-cols-2">
        <div className="flex justify-center">
          <PlayerResult
            name="Nils"
            score={[13, 5, 4, 4]}
            image="https://scontent-muc2-1.xx.fbcdn.net/v/t31.18172-8/17492379_1395721013824677_2431623315541165382_o.jpg?_nc_cat=101&ccb=1-7&_nc_sid=174925&_nc_ohc=HxVgLT_npx4AX-WRSrd&_nc_ht=scontent-muc2-1.xx&oh=00_AfDNqfcc7VuvR0-bjrGcEHQA4Om_dOKr7xiHiS2Hu6-7Fg&oe=645399B7"
            imageLeft={true}
          />
        </div>

        <div className="flex justify-center">
          <PlayerResult
            name="Samu"
            score={[9, 4, 3, 2]}
            image="https://static.wixstatic.com/media/beedc1_dea19613168348f0b71c124cf29309f2~mv2.jpg/v1/fill/w_1322,h_1480,al_b,q_85,usm_0.66_1.00_0.01,enc_auto/beedc1_dea19613168348f0b71c124cf29309f2~mv2.jpg"
            imageLeft={false}
          />
        </div>
      </div>
      <h1 className="flex justify-center pt-24 text-7xl">Nils wins!</h1>
    </div>
  );
};

export default Results;
