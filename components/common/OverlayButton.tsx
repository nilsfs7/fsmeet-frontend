interface IButton {
  text: string;
}

const OverlayButton = ({ text }: IButton) => {
  return <button className="w-16 rounded-lg border border-black bg-primary-light text-sm font-bold text-black hover:bg-primary">{text}</button>;
};

export default OverlayButton;
