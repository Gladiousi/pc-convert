import { PageContainerProps } from "../../interface/common";

const PageContainer: React.FC<PageContainerProps> = ({
    children,
    className = "",
    minHeight = "80dvh",
}) => {
    return (
        <div
            className={`w-full min-h-[${minHeight}] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-gray-50 ${className}`}
        >
            {children}
        </div>
    );
};

export default PageContainer;