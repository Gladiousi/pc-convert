import { useEffect, useState } from "react";
import { useTabStore } from "../store/useTabStore";
import { checkCompatibility, calculatePower, fetchPowerScores } from "../data/pcData";
import SocketSelector from "../components/compare/SocketSelector";
import PCConfigForm from "../components/compare/PCConfigForm";
import ComparisonResult from "../components/compare/ComparisonResult";
import { PCConfig } from "../interface/pc";

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
            const uniqueSockets = [...new Set(components.map((c: any) => c.socket).filter(Boolean))] as string[];
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
                    <div className="flex-1">
                        <SocketSelector
                            socket={pc1Socket}
                            setSocket={(val) => {
                                setPc1Socket(val);
                                setPc1({ ...pc1, cpu: "", motherboard: "" });
                            }}
                            sockets={sockets}
                            label="Сокет ПК 1"
                        />
                        <PCConfigForm pc={pc1} setPc={setPc1} powerScores={powerScores} socket={pc1Socket} label="Компьютер 1" />
                    </div>
                    <div className="flex-1">
                        <SocketSelector
                            socket={pc2Socket}
                            setSocket={(val) => {
                                setPc2Socket(val);
                                setPc2({ ...pc2, cpu: "", motherboard: "" });
                            }}
                            sockets={sockets}
                            label="Сокет ПК 2"
                        />
                        <PCConfigForm pc={pc2} setPc={setPc2} powerScores={powerScores} socket={pc2Socket} label="Компьютер 2" />
                    </div>
                </div>
            ) : (
                <div className="text-gray-600 text-center">Загрузка комплектующих...</div>
            )}

            <button
                onClick={handleCompare}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base sm:text-xl font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
            >
                Сравнить
            </button>

            <ComparisonResult pc1={pc1} pc2={pc2} result={result} powerScores={powerScores} />
        </div>
    );
};

export default Compare;