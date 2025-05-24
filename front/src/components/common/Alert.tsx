import { AlertProps } from "../../interface/common";

const Alert: React.FC<AlertProps> = ({ type, message, className = "" }) => {
  if (!message) return null;

  return (
    <div
      className={`p-3 rounded-lg text-sm mb-4 ${type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"} ${className}`}
    >
      {message}
    </div>
  );
};

export default Alert;