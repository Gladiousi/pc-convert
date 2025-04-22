import { useEffect, useState } from "react";
import { useTabStore } from "../store/useTabStore";
import { PCConfig, checkCompatibility, calculatePower, fetchPowerScores } from "../data/pcData";

interface Component {
    id: number;
    name: string;
    type: string;
    power: number;
    socket?: string;
    connector?: string;
    ramType?: string;
    interface?: string;
    storageInterfaces?: string[];
    gpuConnector?: string;
}

interface CPU {
    power: number;
    socket: string;
}

interface GPU {
    power: number;
    connector: string;
}

interface RAM {
    power: number;
    type: string;
}

interface Storage {
    power: number;
    interface: string;
}

interface Motherboard {
    power: number;
    socket: string;
    ramType: string;
    gpuConnector: string;
    storageInterface: string[];
}

interface PSU {
    power: number;
}

interface PowerScores {
    cpu: Record<string, CPU>;
    gpu: Record<string, GPU>;
    ram: Record<string, RAM>;
    storage: Record<string, Storage>;
    motherboard: Record<string, Motherboard>;
    psu: Record<string, PSU>;
}

const Compare: React.FC = () => {
    const { token, setToken, setActiveTab, powerScores, setPowerScores } = useTabStore();
    const [pc1, setPc1] = useState<PCConfig>({ cpu: "", gpu: "", ram: "", storage: "", motherboard: "", psu: "" });
    const [pc2, setPc2] = useState<PCConfig>({ cpu: "", gpu: "", ram: "", storage: "", motherboard: "", psu: "" });
    const [result, setResult] = useState<{ pc1Power: number; pc2Power: number } | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [sockets, setSockets] = useState<string[]>([]);
    const [pc1Socket, setPc1Socket] = useState<string>("");
    const [pc2Socket, setPc2Socket] = useState<string>("");

    useEffect(() => {
        if (token) {
            fetch("http://localhost:5000/compare", {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => {
                if (!res.ok) {
                    setToken(null);
                    setActiveTab("home");
                }
            });
            loadPowerScores();
            loadSockets();
        } else {
            setActiveTab("home");
        }
    }, [token, setToken, setActiveTab]);

    const loadPowerScores = async () => {
        try {
            const scores = await fetchPowerScores(token!);
            setPowerScores(scores);
        } catch (err: any) {
            console.error("Failed to load power scores:", err);
            setErrors(["Не удалось загрузить комплектующие: " + err.message]);
        }
    };

    const loadSockets = async () => {
        try {
            const res = await fetch("http://localhost:5000/components/filter?type=CPU", {
                headers: { Authorization: `Bearer ${token!}` },
            });
            if (!res.ok) throw new Error("Failed to fetch sockets");
            const components = await res.json();
            const uniqueSockets = [...new Set(components.map((c: Component) => c.socket).filter(Boolean))] as string[];
            setSockets(uniqueSockets);
        } catch (err: any) {
            console.error("Failed to load sockets:", err);
            setErrors(["Не удалось загрузить сокеты: " + err.message]);
        }
    };

    const handleCompare = () => {
        if (!powerScores) {
            setErrors(["Данные о комплектующих не загружены"]);
            return;
        }
        setErrors([]);
        setResult(null);
        const pc1Errors = checkCompatibility(pc1, powerScores);
        const pc2Errors = checkCompatibility(pc2, powerScores);
        if (pc1Errors.length > 0 || pc2Errors.length > 0) {
            setErrors([...pc1Errors.map((e) => `ПК 1: ${e}`), ...pc2Errors.map((e) => `ПК 2: ${e}`)]);
            return;
        }
        const pc1Power = calculatePower(pc1, powerScores);
        const pc2Power = calculatePower(pc2, powerScores);
        setResult({ pc1Power, pc2Power });
    };

    const getComponentInfo = (type: keyof PowerScores, value: string): string => {
        if (!value || !powerScores) return "";
        const component = powerScores[type][value];

        switch (type) {
            case "cpu":
                return `Сокет: ${(component as CPU).socket}`;
            case "gpu":
                return `Разъём: ${(component as GPU).connector}`;
            case "ram":
                return `Тип: ${(component as RAM).type}`;
            case "storage":
                return `Интерфейс: ${(component as Storage).interface}`;
            case "motherboard":
                return `Сокет: ${(component as Motherboard).socket}, RAM: ${(component as Motherboard).ramType}, GPU: ${(component as Motherboard).gpuConnector}, Накопители: ${(component as Motherboard).storageInterface.join(", ")}`;
            case "psu":
                return `Мощность: ${value}`;
            default:
                return "";
        }
    };

    const getComponentSummary = (pc: PCConfig): string[] => {
        if (!powerScores) return [];
        const summary: string[] = [];
        if (pc.cpu) summary.push(`Процессор: ${pc.cpu} (${getComponentInfo("cpu", pc.cpu)}, Мощность: ${powerScores.cpu[pc.cpu]?.power || 0})`);
        if (pc.gpu) summary.push(`Видеокарта: ${pc.gpu} (${getComponentInfo("gpu", pc.gpu)}, Мощность: ${powerScores.gpu[pc.gpu]?.power || 0})`);
        if (pc.ram) summary.push(`RAM: ${pc.ram} (${getComponentInfo("ram", pc.ram)}, Мощность: ${powerScores.ram[pc.ram]?.power || 0})`);
        if (pc.storage) summary.push(`Накопитель: ${pc.storage} (${getComponentInfo("storage", pc.storage)}, Мощность: ${powerScores.storage[pc.storage]?.power || 0})`);
        if (pc.motherboard) summary.push(`Материнская плата: ${pc.motherboard} (${getComponentInfo("motherboard", pc.motherboard)}, Мощность: ${powerScores.motherboard[pc.motherboard]?.power || 0})`);
        if (pc.psu) summary.push(`Блок питания: ${pc.psu} (${getComponentInfo("psu", pc.psu)}, Мощность: ${powerScores.psu[pc.psu]?.power || 0})`);
        return summary;
    };

    const renderSelect = (
        label: string,
        value: string,
        onChange: (value: string) => void,
        options: Record<string, any>,
        type: keyof PowerScores,
        socket?: string
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
                {value && (
                    <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white text-xs sm:text-sm p-2 rounded-lg shadow-lg z-10">
                        {getComponentInfo(type, value)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full min-h-[80dvh] flex flex-col justify-center items-center space-y-8 p-4 sm:p-6 bg-gray-50 relative">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-800 text-center">
                Сравнение компьютеров
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl text-center">
                Соберите два компьютера, учитывая совместимость комплектующих, и сравните их мощность!
            </p>

            {errors.length > 0 && (
                <div className="sticky top-10 w-64 sm:w-80 bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg shadow-lg z-20">
                    <ul className="list-disc list-inside text-xs sm:text-sm">
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {powerScores ? (
                <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex-1">
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center">Компьютер 1</h3>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Сокет</label>
                                <select
                                    value={pc1Socket}
                                    onChange={(e) => {
                                        setPc1Socket(e.target.value);
                                        setPc1({ ...pc1, cpu: "", motherboard: "" });
                                    }}
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                                >
                                    <option value="">Выберите сокет</option>
                                    {sockets.map((socket) => (
                                        <option key={socket} value={socket}>
                                            {socket}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {renderSelect("Процессор", pc1.cpu, (val) => setPc1({ ...pc1, cpu: val }), powerScores.cpu, "cpu", pc1Socket)}
                            {renderSelect("Материнская плата", pc1.motherboard, (val) => setPc1({ ...pc1, motherboard: val }), powerScores.motherboard, "motherboard", pc1Socket)}
                            {renderSelect("Видеокарта", pc1.gpu, (val) => setPc1({ ...pc1, gpu: val }), powerScores.gpu, "gpu")}
                            {renderSelect("RAM", pc1.ram, (val) => setPc1({ ...pc1, ram: val }), powerScores.ram, "ram")}
                            {renderSelect("Накопитель", pc1.storage, (val) => setPc1({ ...pc1, storage: val }), powerScores.storage, "storage")}
                            {renderSelect("Блок питания", pc1.psu, (val) => setPc1({ ...pc1, psu: val }), powerScores.psu, "psu")}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex-1">
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center">Компьютер 2</h3>
                        <div className="space-y-3 sm:space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Сокет</label>
                                <select
                                    value={pc2Socket}
                                    onChange={(e) => {
                                        setPc2Socket(e.target.value);
                                        setPc2({ ...pc2, cpu: "", motherboard: "" });
                                    }}
                                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                                >
                                    <option value="">Выберите сокет</option>
                                    {sockets.map((socket) => (
                                        <option key={socket} value={socket}>
                                            {socket}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {renderSelect("Процессор", pc2.cpu, (val) => setPc2({ ...pc2, cpu: val }), powerScores.cpu, "cpu", pc2Socket)}
                            {renderSelect("Материнская плата", pc2.motherboard, (val) => setPc2({ ...pc2, motherboard: val }), powerScores.motherboard, "motherboard", pc2Socket)}
                            {renderSelect("Видеокарта", pc2.gpu, (val) => setPc2({ ...pc2, gpu: val }), powerScores.gpu, "gpu")}
                            {renderSelect("RAM", pc2.ram, (val) => setPc2({ ...pc2, ram: val }), powerScores.ram, "ram")}
                            {renderSelect("Накопитель", pc2.storage, (val) => setPc2({ ...pc2, storage: val }), powerScores.storage, "storage")}
                            {renderSelect("Блок питания", pc2.psu, (val) => setPc2({ ...pc2, psu: val }), powerScores.psu, "psu")}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-gray-600 text-center">Загрузка комплектующих...</div>
            )}

            <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex-1">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Сборка ПК 1</h4>
                    {getComponentSummary(pc1).length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700 text-xs sm:text-sm">
                            {getComponentSummary(pc1).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 text-xs sm:text-sm">Компоненты не выбраны</p>
                    )}
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex-1">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Сборка ПК 2</h4>
                    {getComponentSummary(pc2).length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700 text-xs sm:text-sm">
                            {getComponentSummary(pc2).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 text-xs sm:text-sm">Компоненты не выбраны</p>
                    )}
                </div>
            </div>

            <button
                onClick={handleCompare}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base sm:text-xl font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
            >
                Сравнить
            </button>

            {result && (
                <div className="w-full max-w-6xl space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                        <h4 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-2">Компьютер 1: {result.pc1Power}</h4>
                        <div className="w-full bg-gray-200 rounded-full h-6 sm:h-8 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-6 sm:h-8 text-white text-center flex items-center justify-center transition-all duration-1000 text-xs sm:text-base"
                                style={{ width: `${Math.min((result.pc1Power / 600) * 100, 100)}%` }}
                            >
                                {result.pc1Power}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                        <h4 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-2">Компьютер 2: {result.pc2Power}</h4>
                        <div className="w-full bg-gray-200 rounded-full h-6 sm:h-8 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-6 sm:h-8 text-white text-center flex items-center justify-center transition-all duration-1000 text-xs sm:text-base"
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