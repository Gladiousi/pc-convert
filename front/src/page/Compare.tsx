import { useEffect, useState } from "react";
import { useTabStore } from "../store/useTabStore";
import { powerScores, PCConfig, checkCompatibility, calculatePower } from "../data/pcData";

const Compare: React.FC = () => {
    const { token, setActiveTab } = useTabStore();
    const [pc1, setPc1] = useState<PCConfig>({ cpu: "", gpu: "", ram: "", storage: "", motherboard: "", psu: "" });
    const [pc2, setPc2] = useState<PCConfig>({ cpu: "", gpu: "", ram: "", storage: "", motherboard: "", psu: "" });
    const [result, setResult] = useState<{ pc1Power: number; pc2Power: number } | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        if (token) {
            fetch("http://localhost:5000/compare", {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => {
                if (!res.ok) {
                    setActiveTab("home");
                }
            });
        }
    }, [token, setActiveTab]);

    const handleCompare = () => {
        setErrors([]);
        setResult(null);

        const pc1Errors = checkCompatibility(pc1);
        const pc2Errors = checkCompatibility(pc2);

        if (pc1Errors.length > 0 || pc2Errors.length > 0) {
            setErrors([...pc1Errors.map(e => `ПК 1: ${e}`), ...pc2Errors.map(e => `ПК 2: ${e}`)]);
            return;
        }

        const pc1Power = calculatePower(pc1);
        const pc2Power = calculatePower(pc2);
        setResult({ pc1Power, pc2Power });
    };

    const getComponentInfo = (type: keyof typeof powerScores, value: string): string => {
        if (!value) return "";
        const component = powerScores[type][value as keyof typeof powerScores[typeof type]];

        switch (type) {
            case "cpu":
                return `Сокет: ${(component as typeof powerScores.cpu[string]).socket}`;
            case "gpu":
                return `Разъём: ${(component as typeof powerScores.gpu[string]).connector}`;
            case "ram":
                return `Тип: ${(component as typeof powerScores.ram[string]).type}`;
            case "storage":
                return `Интерфейс: ${(component as typeof powerScores.storage[string]).interface}`;
            case "motherboard":
                const mb = component as typeof powerScores.motherboard[string];
                return `Сокет: ${mb.socket}, RAM: ${mb.ramType}, GPU: ${mb.gpuConnector}, Накопители: ${mb.storageInterface.join(", ")}`;
            case "psu":
                return `Мощность: ${value}`;
            default:
                return "";
        }
    };

    const getComponentSummary = (pc: PCConfig): string[] => {
        const summary: string[] = [];
        if (pc.cpu) summary.push(`Процессор: ${pc.cpu} (${getComponentInfo("cpu", pc.cpu)}, Мощность: ${powerScores.cpu[pc.cpu].power})`);
        if (pc.gpu) summary.push(`Видеокарта: ${pc.gpu} (${getComponentInfo("gpu", pc.gpu)}, Мощность: ${powerScores.gpu[pc.gpu].power})`);
        if (pc.ram) summary.push(`RAM: ${pc.ram} (${getComponentInfo("ram", pc.ram)}, Мощность: ${powerScores.ram[pc.ram].power})`);
        if (pc.storage) summary.push(`Накопитель: ${pc.storage} (${getComponentInfo("storage", pc.storage)}, Мощность: ${powerScores.storage[pc.storage].power})`);
        if (pc.motherboard) summary.push(`Материнская плата: ${pc.motherboard} (${getComponentInfo("motherboard", pc.motherboard)}, Мощность: ${powerScores.motherboard[pc.motherboard].power})`);
        if (pc.psu) summary.push(`Блок питания: ${pc.psu} (${getComponentInfo("psu", pc.psu)}, Мощность: ${powerScores.psu[pc.psu].power})`);
        return summary;
    };

    const renderSelect = (
        label: string,
        value: string,
        onChange: (value: string) => void,
        options: Record<string, any>,
        type: keyof typeof powerScores,
        aosDelay?: string
    ) => (
        <div className="space-y-1 relative group">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                data-aos="fade-up"
                data-aos-delay={aosDelay}
            >
                <option value="">Выберите {label.toLowerCase()}</option>
                {Object.keys(options).map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {value && (
                <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white text-sm p-2 rounded-lg shadow-lg z-10">
                    {getComponentInfo(type, value)}
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full min-h-[80dvh] flex flex-col justify-center items-center space-y-10 p-6 relative">
            <h1 data-aos="fade-down" className="text-5xl font-light text-gray-800">
                Сравнение компьютеров
            </h1>
            <p data-aos="fade-down" data-aos-delay="200" className="text-xl text-gray-600 max-w-3xl text-center">
                Соберите два компьютера, учитывая совместимость комплектующих, и сравните их мощность!
            </p>

            {errors.length > 0 && (
                <div className="sticky top-4 right-4 w-80 bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg shadow-lg z-20" data-aos="fade-left">
                    <ul className="list-disc list-inside text-sm">
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-center gap-8 w-full max-w-6xl">
                {/* PC 1 Card */}
                <div
                    className="flex-1 bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300"
                    data-aos="fade-up"
                >
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Компьютер 1</h3>
                    <div className="space-y-4">
                        {renderSelect("Процессор", pc1.cpu, (val) => setPc1({ ...pc1, cpu: val }), powerScores.cpu, "cpu")}
                        {renderSelect("Видеокарта", pc1.gpu, (val) => setPc1({ ...pc1, gpu: val }), powerScores.gpu, "gpu", "100")}
                        {renderSelect("RAM", pc1.ram, (val) => setPc1({ ...pc1, ram: val }), powerScores.ram, "ram", "200")}
                        {renderSelect("Накопитель", pc1.storage, (val) => setPc1({ ...pc1, storage: val }), powerScores.storage, "storage", "300")}
                        {renderSelect("Материнская плата", pc1.motherboard, (val) => setPc1({ ...pc1, motherboard: val }), powerScores.motherboard, "motherboard", "400")}
                        {renderSelect("Блок питания", pc1.psu, (val) => setPc1({ ...pc1, psu: val }), powerScores.psu, "psu", "500")}
                    </div>
                </div>

                {/* PC 2 Card */}
                <div
                    className="flex-1 bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Компьютер 2</h3>
                    <div className="space-y-4">
                        {renderSelect("Процессор", pc2.cpu, (val) => setPc2({ ...pc2, cpu: val }), powerScores.cpu, "cpu")}
                        {renderSelect("Видеокарта", pc2.gpu, (val) => setPc2({ ...pc2, gpu: val }), powerScores.gpu, "gpu", "100")}
                        {renderSelect("RAM", pc2.ram, (val) => setPc2({ ...pc2, ram: val }), powerScores.ram, "ram", "200")}
                        {renderSelect("Накопитель", pc2.storage, (val) => setPc2({ ...pc2, storage: val }), powerScores.storage, "storage", "300")}
                        {renderSelect("Материнская плата", pc2.motherboard, (val) => setPc2({ ...pc2, motherboard: val }), powerScores.motherboard, "motherboard", "400")}
                        {renderSelect("Блок питания", pc2.psu, (val) => setPc2({ ...pc2, psu: val }), powerScores.psu, "psu", "500")}
                    </div>
                </div>
            </div>

            {/* Краткое описание выбранных компонентов */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8" data-aos="fade-up" data-aos-delay="300">
                <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">Сборка ПК 1</h4>
                    {getComponentSummary(pc1).length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700 text-sm">
                            {getComponentSummary(pc1).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 text-sm">Компоненты не выбраны</p>
                    )}
                </div>
                <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">Сборка ПК 2</h4>
                    {getComponentSummary(pc2).length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700 text-sm">
                            {getComponentSummary(pc2).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 text-sm">Компоненты не выбраны</p>
                    )}
                </div>
            </div>

            <button
                onClick={handleCompare}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                data-aos="zoom-in"
                data-aos-delay="400"
            >
                Сравнить
            </button>

            {result && (
                <div className="w-full max-w-4xl space-y-8" data-aos="fade-up" data-aos-delay="500">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h4 className="text-2xl font-semibold text-gray-800 mb-2">Компьютер 1: {result.pc1Power}</h4>
                        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-8 text-white text-center flex items-center justify-center transition-all duration-1000"
                                style={{ width: `${Math.min((result.pc1Power / 600) * 100, 100)}%` }}
                            >
                                {result.pc1Power}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h4 className="text-2xl font-semibold text-gray-800 mb-2">Компьютер 2: {result.pc2Power}</h4>
                        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-8 text-white text-center flex items-center justify-center transition-all duration-1000"
                                style={{ width: `${Math.min((result.pc2Power / 600) * 100, 100)}%` }}
                            >
                                {result.pc2Power}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Compare;