import { NextPage } from 'next';

const About: NextPage = () => {
  const shortSha = process.env.NEXT_PUBLIC_COMMIT_SHA && process.env.NEXT_PUBLIC_COMMIT_SHA?.length > 7 ? process.env.NEXT_PUBLIC_COMMIT_SHA?.substring(0, 7) : process.env.NEXT_PUBLIC_COMMIT_SHA;

  return (
    <div className="mt-10 flex flex-col items-center">
      <div>Set up Events and get connected.</div>
      <div>#fsfam ⚽</div>

      {/* Version */}
      <div className="mt-10">Version SHA: {shortSha}</div>
    </div>
  );
};

export default About;
