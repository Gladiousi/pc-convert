import { ComparisonResultProps } from "../../interface/compare";
import { PCConfig, PowerScores } from "../../interface/pc";

const ConfigResult: React.FC<ComparisonResultProps> = ({ pc1, pc2, result, powerScores }) => {
  const getComponentInfo = (type: keyof PowerScores, value: string): string => {
    if (!value || !powerScores) return "";
    const component = powerScores[type][value];

    switch (type) {
      case "cpu":
        return `Сокет: ${(component as any).socket}`;
      case "gpu":
        return `Разъём: ${(component as any).connector}`;
      case "ram":
        return `Тип: ${(component as any).type}`;
      case "storage":
        return `Интерфейс: ${(component as any).interface}`;
      case "motherboard":
        return `Сокет: ${(component as any).socket}, RAM: ${(component as any).ramType}, GPU: ${(component as any).gpuConnector}, Накопители: ${(component as any).storageInterface.join(", ")}`;
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

  return (
    <div className="w-full max-w-6xl space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Ваша сборка</h4>
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
      {pc2 && (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
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
      )}
      {result && (
        <div className="w-full max-w-6xl space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <h4 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-2">
              {pc2 ? "Компьютер 1" : "Ваша сборка"}: {result.pc1Power}
            </h4>
            <div className="w-full bg-gray-200 rounded-full h-6 sm:h-8 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-6 sm:h-8 text-white text-center flex items-center justify-center transition-all duration-1000 text-xs sm:text-base"
                style={{ width: `${Math.min((result.pc1Power / 600) * 100, 100)}%` }}
              >
                {result.pc1Power}
              </div>
            </div>
          </div>
          {pc2 && result.pc2Power > 0 && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default ConfigResult;