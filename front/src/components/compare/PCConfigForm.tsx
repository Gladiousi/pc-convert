import { memo } from "react";
import { PCConfigFormProps } from "../../interface/compare";
import { PowerScores } from "../../interface/pc";

const PCConfigForm: React.FC<PCConfigFormProps> = ({ pc, setPc, powerScores, socket, label }) => {
    const renderSelect = (
        label: string,
        value: string,
        onChange: (value: string) => void,
        options: Record<string, any>,
        type: keyof PowerScores
    ) => {
        const filteredOptions = socket
            ? Object.keys(options).filter((option) => options[option].socket === socket || (type !== "cpu" && type !== "motherboard"))
            : Object.keys(options);

        return (
            <div className="space-y-1 relative group">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                >
                    <option value="">Выберите {label.toLowerCase()}</option>
                    {filteredOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex-1">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center">{label}</h3>
            <div className="space-y-3 sm:space-y-4">
                {powerScores && (
                    <>
                        {renderSelect("Процессор", pc.cpu, (val) => setPc({ ...pc, cpu: val }), powerScores.cpu, "cpu")}
                        {renderSelect("Материнская плата", pc.motherboard, (val) => setPc({ ...pc, motherboard: val }), powerScores.motherboard, "motherboard")}
                        {renderSelect("Видеокарта", pc.gpu, (val) => setPc({ ...pc, gpu: val }), powerScores.gpu, "gpu")}
                        {renderSelect("RAM", pc.ram, (val) => setPc({ ...pc, ram: val }), powerScores.ram, "ram")}
                        {renderSelect("Накопитель", pc.storage, (val) => setPc({ ...pc, storage: val }), powerScores.storage, "storage")}
                        {renderSelect("Блок питания", pc.psu, (val) => setPc({ ...pc, psu: val }), powerScores.psu, "psu")}
                    </>
                )}
            </div>
        </div>
    );
};

export default memo(PCConfigForm);