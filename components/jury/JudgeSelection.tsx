import { useState } from 'react';
import OverlayButton from '../common/OverlayButton';
import Image from 'next/image';

interface IJudgeSelection {
  image: string | null;
  isHeadJudge?: boolean;
}

const isValidUrl = (url: string) => {
  if (url.startsWith('/') || url.startsWith('http')) {
    return true;
  }
  return false;
};

const JudgeSelection = ({ image, isHeadJudge = false }: IJudgeSelection) => {
  const [hovered, setHovered] = useState(false);

  if (!image) {
    image = '';
  }

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
          <Image
            src={isValidUrl(image) ? image : '/jury/judge-no-img.png'}
            width={0}
            height={0}
            sizes="100vw"
            className={`${isValidUrl(image) ? 'object-cover' : 'object-contain'} h-64 w-48 justify-center shadow-2xl shadow-black duration-300 group-hover:scale-125`}
            alt={'judge'}
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
