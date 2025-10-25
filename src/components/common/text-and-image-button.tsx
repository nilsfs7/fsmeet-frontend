import Image from 'next/image';

interface IButton {
  text: string;
  image: string;
  onClick?: () => void;
}

const TextAndImageButton = ({ text, image, onClick }: IButton) => {
  return (
    <button className="w-44 rounded-lg border border-secondary-dark bg-secondary-light p-2 font-bold text-primary hover:border-primary" onClick={onClick}>
      <div className="m-1">
        <Image src={image} width={0} height={0} sizes="100vw" className={`h-12 w-full`} alt={'image'} />
      </div>
      <div className="m-1">{text}</div>
    </button>
  );
};

export default TextAndImageButton;
