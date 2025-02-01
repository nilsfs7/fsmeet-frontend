import { ReactNode } from 'react';

interface ISection {
  title: string;
  children?: ReactNode;
}

export const Section = ({ title, children }: ISection) => {
  return (
    <div className="w-fit flex flex-col p-2">
      <div className="text-lg">{title}</div>
      <div>{children}</div>
    </div>
  );
};
