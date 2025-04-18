interface ISectionHeader {
  label: string;
}

const SectionHeader = ({ label }: ISectionHeader) => {
  return <div className="mx-2 text-lg underline">{label}</div>;
};

export default SectionHeader;
