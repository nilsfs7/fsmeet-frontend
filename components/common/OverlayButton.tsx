interface IButton {
  text: string;
}

const OverlayButton = ({ text }: IButton) => {
  return <button className="w-16 rounded-lg border border-black bg-zinc-300 text-sm font-bold text-black hover:bg-zinc-400">{text}</button>;
};

export default OverlayButton;
