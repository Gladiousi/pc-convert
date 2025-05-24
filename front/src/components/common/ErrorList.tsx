import { memo } from "react";
import { ErrorListProps } from "../../interface/common";

const ErrorList: React.FC<ErrorListProps> = ({ errors, className = "" }) => {
  if (errors.length === 0) return null;

  return (
    <div
      className={`w-full max-w-md bg-red-100 border border-red-400 text-red-700 p-3 sm:p-4 rounded-lg shadow-lg z-20 ${className}`}
    >
      <ul className="list-disc list-inside text-xs sm:text-sm">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default memo(ErrorList);