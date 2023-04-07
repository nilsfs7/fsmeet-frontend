import PlayerResult from '@/components/PlayerResult';
import { GetServerSideProps, NextPage } from 'next';

const Results: NextPage = (props: any) => {
  const results = props.data;

  return (
    <div>
      <h1 className="flex justify-center pb-24 pt-32 text-7xl">Battle Result</h1>
      <div className="grid grid-cols-2">
        <div className="flex justify-center">
          <PlayerResult name={results[0].name} score={results[0].score} image={results[0].image} imageLeft={true} />
        </div>

        <div className="flex justify-center">
          <PlayerResult name={results[1].name} score={results[1].score} image={results[1].image} imageLeft={false} />
        </div>
      </div>
      <h1 className="flex justify-center pt-24 text-7xl">Nils wins!</h1>
    </div>
  );
};

export default Results;

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch('http://localhost:3000/v1/results/current');
  const data = await response.json();

  return {
    props: {
      data: data,
    },
  };
};
