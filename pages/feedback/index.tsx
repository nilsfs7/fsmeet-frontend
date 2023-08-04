import { NextPage } from 'next';
import TextAndImageButton from '@/components/common/TextAndImageButton';
import Link from 'next/link';

const bugImg = '/feedback/bug.svg';
const featureImg = '/feedback/feature.svg';
const feedbackImg = '/feedback/general-feedback.svg';

const Feedback: NextPage = () => {
  return (
    <div className={'absolute inset-0 flex flex-col items-center justify-center'}>
      <div className="py-2">
        <Link href="feedback/bugs">
          <TextAndImageButton text="Report Bug" image={bugImg} />
        </Link>
      </div>
      <div className="py-2">
        <Link href="feedback/features">
          <TextAndImageButton text="Request Feature" image={featureImg} />
        </Link>
      </div>
      <div className="py-2">
        <Link href="feedback/general">
          <TextAndImageButton text="General Feedback" image={feedbackImg} />
        </Link>
      </div>
    </div>
  );
};

export default Feedback;
