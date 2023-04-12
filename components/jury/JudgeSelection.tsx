import { useState } from 'react';
import OverlayButton from '../common/OverlayButton';

interface IJudgeSelection {
  image: string | null;
  isHeadJudge?: boolean;
}

const JudgeSelection = ({ image, isHeadJudge = false }: IJudgeSelection) => {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        className="m-2"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
        }}
        onMouseOver={() => setHovered(true)}
      >
        <div className="nft-image-container group relative flex w-full justify-center overflow-hidden rounded-lg border-2 border-black text-center">
          <img
            className={`${image ? 'object-cover' : 'object-none'} h-64 w-48 justify-center shadow-2xl shadow-black duration-300 group-hover:scale-125`}
            src={image ? image : '/actions/add-judge.png'}
            alt="Judge-1"
          />

          {image && hovered && (
            <>
              {/* <div className={`absolute bottom-4 left-4 flex cursor-pointer`}>
                <OverlayButton text="Add" />
              </div> */}
              {!isHeadJudge && (
                <div className={`absolute bottom-4 right-4 flex cursor-pointer`}>
                  <OverlayButton text="Remove" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default JudgeSelection;
