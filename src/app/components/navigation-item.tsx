import Link from 'next/link';

interface INavigationItem {
  targetRoute: string;
  image: string;
  label: string;
}

export const NavigationItem = ({ targetRoute, image, label }: INavigationItem) => {
  return (
    <Link href={targetRoute}>
      <button
        className={`
        flex flex-col md:flex-row items-center gap-1
        rounded-lg font-medium
        transition-all duration-20000 ease-in-out
        transform hover:scale-[1.02] active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
        text-primary
        `}
      >
        <img src={image} className="mx-1 h-8 w-8 rounded-full object-cover" />
        <div>{label}</div>
      </button>
    </Link>
  );
};
