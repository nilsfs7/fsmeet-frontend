import { NextPage } from 'next';

const About: NextPage = () => {
  const shortSha = process.env.NEXT_PUBLIC_COMMIT_SHA && process.env.NEXT_PUBLIC_COMMIT_SHA?.length > 7 ? process.env.NEXT_PUBLIC_COMMIT_SHA?.substring(0, 7) : process.env.NEXT_PUBLIC_COMMIT_SHA;

  return (
    <div className="mx-2 mt-10 flex flex-col items-center text-center">
      <div>
        FSMeet is a free tool to easily organize and manage freestyle football meetings and competitions. Its development process is still ongoing, but we are happy to have reached a feasible state to
        run as a pilot for the German Championships 2023.
      </div>
      <div>Stay tuned! ⚽</div>

      {/* Version */}
      <div className="mt-10">Version SHA: {shortSha}</div>
    </div>
  );
};

export default About;
