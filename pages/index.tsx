import Button from '@/components/common/Button';
import { NextPage } from 'next';
import Link from 'next/link';

const CreateJury: NextPage = () => {
  const imgUrl =
    'https://scontent-muc2-1.xx.fbcdn.net/v/t31.18172-8/17492379_1395721013824677_2431623315541165382_o.jpg?_nc_cat=101&ccb=1-7&_nc_sid=174925&_nc_ohc=HxVgLT_npx4AX-WRSrd&_nc_ht=scontent-muc2-1.xx&oh=00_AfDNqfcc7VuvR0-bjrGcEHQA4Om_dOKr7xiHiS2Hu6-7Fg&oe=645399B7';

  return (
    <>
      <div className="flex h-screen flex-col justify-center">
        <div className="flex justify-center py-2">
          <Link href={'/results/'}>
            <Button text="Show Results" />
          </Link>
        </div>
        <div className="flex justify-center py-2">
          <Link href={'/jury/create'}>
            <Button text="Create Jury" />
          </Link>
        </div>
        <div className="flex justify-center py-2">
          <Link href={'/'}>
            <Button text="Join Jury" />
          </Link>
        </div>
      </div>

      {/* avatar */}
      <Link href={'/account'}>
        <div className="border-2border-[2px] absolute right-6 top-6 h-11 w-11 cursor-pointer rounded-full border-black bg-zinc-300  hover:bg-zinc-400">
          <img alt={'nftImage'} className="h-full w-full rounded-full object-cover" src={imgUrl} />
        </div>
      </Link>
    </>
  );
};

export default CreateJury;
