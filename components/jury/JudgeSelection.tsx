import { useState } from 'react';
import OverlayButton from '../common/OverlayButton';

interface IJudgeSelection {
  image: string;
}

const JudgeSelection = ({ image }: IJudgeSelection) => {
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
        <div className="nft-image-container group relative flex w-full justify-center overflow-hidden rounded-lg border-2  border-black text-center ">
          <img className="h-64 w-48 justify-center  object-cover shadow-2xl shadow-black duration-300 group-hover:scale-125" src={image} alt="Judge-1" />

          {hovered && (
            <>
              {/* <div className={`absolute bottom-4 left-4 flex cursor-pointer`}>
                <OverlayButton text="Add" />
              </div> */}
              <div className={`absolute bottom-4 right-4 flex cursor-pointer`}>
                <OverlayButton text="Remove" />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default JudgeSelection;
