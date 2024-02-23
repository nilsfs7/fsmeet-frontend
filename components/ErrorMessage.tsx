interface IErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: IErrorMessageProps) => {
  return message ? (
    <div className="flex justify-center py-2">
      <label className="text-critical">{`${message}`}</label>
    </div>
  ) : null;
};

export default ErrorMessage;
