import { NextPage } from 'next';

const About: NextPage = () => {
  const shortSha = process.env.NEXT_PUBLIC_COMMIT_SHA && process.env.NEXT_PUBLIC_COMMIT_SHA?.length > 7 ? process.env.NEXT_PUBLIC_COMMIT_SHA?.substring(0, 7) : process.env.NEXT_PUBLIC_COMMIT_SHA;

  return (
    <div className="flex flex-col items-center">
      <div>about text</div>

      {/* Version */}
      <div className="m-1">Version SHA: {shortSha}</div>
    </div>
  );
};

export default About;
