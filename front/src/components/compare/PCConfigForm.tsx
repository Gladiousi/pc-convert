import { memo, useMemo } from "react";
import { PCConfigFormProps } from "../../interface/compare";
import { PowerScores, CPU, Motherboard } from "../../interface/pc";
import { Select } from "../common/Select";
import Card from "../common/Card";

const PCConfigForm: React.FC<PCConfigFormProps> = ({ pc, setPc, powerScores, socket, label }) => {
    const getFilteredOptions = (options: Record<string, any>, type: keyof PowerScores) => {
        return useMemo(() => {
            return socket
                ? Object.keys(options).filter(
                    (option) => (options[option] as CPU | Motherboard).socket === socket || (type !== "cpu" && type !== "motherboard")
                )
                : Object.keys(options);
        }, [options, socket, type]);
    };

    if (!powerScores) {
        return <div className="text-center text-gray-600">Загрузка комплектующих...</div>;
    }

    return (
        <Card className="flex-1">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center">{label}</h3>
            <div className="space-y-3 sm:space-y-4">
                <Select
                    label="Процессор"
                    value={pc.cpu}
                    onChange={(val) => setPc({ ...pc, cpu: val })}
                    options={getFilteredOptions(powerScores.cpu, "cpu")}
                />
                <Select
                    label="Материнская плата"
                    value={pc.motherboard}
                    onChange={(val) => setPc({ ...pc, motherboard: val })}
                    options={getFilteredOptions(powerScores.motherboard, "motherboard")}
                />
                <Select
                    label="Видеокарта"
                    value={pc.gpu}
                    onChange={(val) => setPc({ ...pc, gpu: val })}
                    options={getFilteredOptions(powerScores.gpu, "gpu")}
                />
                <Select
                    label="RAM"
                    value={pc.ram}
                    onChange={(val) => setPc({ ...pc, ram: val })}
                    options={getFilteredOptions(powerScores.ram, "ram")}
                />
                <Select
                    label="Накопитель"
                    value={pc.storage}
                    onChange={(val) => setPc({ ...pc, storage: val })}
                    options={getFilteredOptions(powerScores.storage, "storage")}
                />
                <Select
                    label="Блок питания"
                    value={pc.psu}
                    onChange={(val) => setPc({ ...pc, psu: val })}
                    options={getFilteredOptions(powerScores.psu, "psu")}
                />
            </div>
        </Card>
    );
};

export default memo(PCConfigForm);