import { memo } from "react";
import { GradientButtonProps } from "../../interface/common";

const GradientButton: React.FC<GradientButtonProps> = ({
  isLoading,
  children,
  disabled,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm sm:text-base md:text-lg font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 min-w-[120px] ${isLoading || disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {isLoading ? "Загрузка..." : children}
    </button>
  );
};

export default memo(GradientButton);