interface INavigationProps {
  reverse?: boolean;
  children: React.ReactNode;
}

const Navigation = ({ reverse = false, children }: INavigationProps) => {
  return (
    <div className="mt-auto">
      <div className={`m-2 flex flex-shrink-0 ${reverse ? 'justify-end' : 'justify-between'}`}>{children}</div>
    </div>
  );
};

export default Navigation;
