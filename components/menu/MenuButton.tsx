interface IButton {
  text: string;
}

const MenuButton = ({ text }: IButton) => {
  return <button className="w-52 rounded-lg border-2 border-black bg-zinc-300 px-4 py-2 font-bold text-black hover:bg-zinc-400">{text}</button>;
};

export default MenuButton;
