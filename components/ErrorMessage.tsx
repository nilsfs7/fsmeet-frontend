interface IErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: IErrorMessageProps) => {
  return message ? (
    <div className="flex justify-center border border-black py-2">
      <label className="text-dark-red">{`${message}`}</label>
    </div>
  ) : null;
};

export default ErrorMessage;
