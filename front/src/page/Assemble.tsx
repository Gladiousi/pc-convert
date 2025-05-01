import { useEffect, useState } from "react";
import { useTabStore } from "../store/useTabStore";
import { checkCompatibility, calculatePower, fetchPowerScores } from "../data/pcData";
import SocketSelector from "../components/compare/SocketSelector";
import PCConfigForm from "../components/compare/PCConfigForm";
import ConfigResult from "../components/compare/ConfigResult";
import { PCConfig } from "../interface/pc";

const Assemble: React.FC = () => {
  const { token, setToken, setActiveTab, powerScores, setPowerScores } = useTabStore();
  const [pc, setPc] = useState<PCConfig>({ cpu: "", gpu: "", ram: "", storage: "", motherboard: "", psu: "" });
  const [errors, setErrors] = useState<string[]>([]);
  const [sockets, setSockets] = useState<string[]>([]);
  const [socket, setSocket] = useState<string>("");
  const [power, setPower] = useState<number | null>(null);

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

  const handleAssemble = () => {
    if (!powerScores) {
      setErrors(["Данные о комплектующих не загружены"]);
      return;
    }
    setErrors([]);
    setPower(null);
    const pcErrors = checkCompatibility(pc, powerScores);
    if (pcErrors.length > 0) {
      setErrors(pcErrors);
      return;
    }
    const pcPower = calculatePower(pc, powerScores);
    setPower(pcPower);
  };

  return (
    <div className="w-full min-h-[80dvh] flex flex-col justify-center items-center space-y-8 p-4 sm:p-6 bg-gray-50 relative">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-800 text-center">
        Сборка ПК
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl text-center">
        Соберите свой компьютер, учитывая совместимость комплектующих, и узнайте его мощность!
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
        <div className="w-full max-w-3xl">
          <SocketSelector
            socket={socket}
            setSocket={(val) => {
              setSocket(val);
              setPc({ ...pc, cpu: "", motherboard: "" });
            }}
            sockets={sockets}
            label="Сокет"
          />
          <PCConfigForm pc={pc} setPc={setPc} powerScores={powerScores} socket={socket} label="Ваш ПК" />
        </div>
      ) : (
        <div className="text-gray-600 text-center">Загрузка комплектующих...</div>
      )}

      <button
        onClick={handleAssemble}
        className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base sm:text-xl font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
      >
        Рассчитать мощность
      </button>

      <ConfigResult pc1={pc} pc2={null} result={power ? { pc1Power: power, pc2Power: 0 } : null} powerScores={powerScores} />
    </div>
  );
};

export default Assemble;