import { ChangeEvent } from "react";
import { MultiSelectProps, SelectProps } from "../../interface/common";

const Select: React.FC<SelectProps> = ({
    label,
    value,
    onChange,
    options,
    placeholder,
    className = "",
    ariaLabel,
}) => {
    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base ${className}`}
                aria-label={ariaLabel || `Выберите ${label.toLowerCase()}`}
            >
                <option value="">{placeholder || `Выберите ${label.toLowerCase()}`}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

const MultiSelect: React.FC<MultiSelectProps> = ({
    label,
    value,
    onChange,
    options,
    className = "",
    ariaLabel,
}) => {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
        onChange(selected);
    };

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                multiple
                value={value}
                onChange={handleChange}
                className={`w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base h-24 ${className}`}
                aria-label={ariaLabel || `Выберите ${label.toLowerCase()}`}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export { Select, MultiSelect };
export default Select;