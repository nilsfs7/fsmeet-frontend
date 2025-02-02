interface ILabel {
  text: string;
  capitalize?: boolean;
}

const Label = ({ text, capitalize = false }: ILabel) => {
  return <div className={`font-extrabold p-2 rounded-lg bg-secondary ${capitalize ? 'capitalize' : ''}`}>{(text.charAt(0).toUpperCase() + text.slice(1)).replaceAll('_', ' ')}</div>;
};

export default Label;
