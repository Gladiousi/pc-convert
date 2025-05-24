import { JSX, memo } from "react";
import { SectionHeadingProps } from "../../interface/common";

const SectionHeading: React.FC<SectionHeadingProps> = ({
    children,
    className = "",
    level = 1,
}) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return (
        <Tag
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 text-center ${className}`}
            role="heading"
            aria-level={level}
        >
            {children}
        </Tag>
    );
};

export default memo(SectionHeading);