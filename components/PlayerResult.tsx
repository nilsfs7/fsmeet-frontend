interface IDropdownProps {
  name: string;
  score: number[];
  image: string;
  imageLeft: boolean;
}

const PlayerResult = ({ name, score, image, imageLeft }: IDropdownProps) => {
  return (
    <>
      <div className="grid grid-cols-2 text-5xl">
        {imageLeft ? (
          <>
            <div className="pl-8">
              <div className="justify-center flex pb-4">{name}</div>
              <div className=" ">
                <img className="h-96 object-cover rounded-lg shadow-black shadow-2xl" src={image} alt="player-image" />
              </div>
            </div>

            <div className="grid grid-rows-6 grid-flow-col justify-center text-right ">
              <div />
              <div>{score[1]}</div>
              <div>{score[2]}</div>
              <div>{score[3]}</div>
              <div />
              <div className="text-7xl">{score[0]}</div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-rows-6 grid-flow-col justify-center text-left">
              <div />
              <div>{score[1]}</div>
              <div>{score[2]}</div>
              <div>{score[3]}</div>
              <div />
              <div className="text-7xl">{score[0]}</div>
            </div>
            <div className="pr-8">
              <div className="justify-center flex pb-4">{name}</div>
              <img className="h-96 object-cover rounded-lg  shadow-black shadow-2xl" src={image} alt="player-image" />
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default PlayerResult;
