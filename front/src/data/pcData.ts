import { PCConfig, PowerScores } from "../interface/pc";


export const fetchPowerScores = async (token: string): Promise<PowerScores> => {
    const res = await fetch("http://localhost:5000/components", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch components");
    const components = await res.json();

    const powerScores: PowerScores = {
        cpu: {},
        gpu: {},
        ram: {},
        storage: {},
        motherboard: {},
        psu: {},
    };

    components.forEach((component: any) => {
        switch (component.type) {
            case "CPU":
                powerScores.cpu[component.name] = { power: component.power, socket: component.socket };
                break;
            case "GPU":
                powerScores.gpu[component.name] = { power: component.power, connector: component.connector };
                break;
            case "RAM":
                powerScores.ram[component.name] = { power: component.power, type: component.ramType };
                break;
            case "Storage":
                powerScores.storage[component.name] = { power: component.power, interface: component.interface };
                break;
            case "Motherboard":
                powerScores.motherboard[component.name] = {
                    power: component.power,
                    socket: component.socket,
                    ramType: component.ramType,
                    gpuConnector: component.gpuConnector,
                    storageInterface: component.storageInterfaces,
                };
                break;
            case "PSU":
                powerScores.psu[component.name] = { power: component.power };
                break;
        }
    });

    return powerScores;
};

export const checkCompatibility = (pc: PCConfig, powerScores: PowerScores): string[] => {
    const errors: string[] = [];

    const requiredFields = ["cpu", "gpu", "ram", "storage", "motherboard", "psu"];
    requiredFields.forEach((field) => {
        if (!pc[field as keyof PCConfig]) {
            errors.push(
                `Не выбран ${field === "cpu" ? "процессор" : field === "gpu" ? "видеокарта" : field === "ram" ? "оперативная память" : field === "storage" ? "накопитель" : field === "motherboard" ? "материнская плата" : "блок питания"}`
            );
        }
    });

    if (errors.length > 0) return errors;

    const cpuSocket = powerScores.cpu[pc.cpu]?.socket;
    const mbSocket = powerScores.motherboard[pc.motherboard]?.socket;
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
        errors.push(`Несовместимость сокетов: ${pc.cpu} (сокет ${cpuSocket}) и ${pc.motherboard} (сокет ${mbSocket})`);
    }

    const ramType = powerScores.ram[pc.ram]?.type;
    const mbRamType = powerScores.motherboard[pc.motherboard]?.ramType;
    if (ramType && mbRamType && ramType !== mbRamType) {
        errors.push(`Несовместимость типов RAM: ${pc.ram} (${ramType}) и ${pc.motherboard} (${mbRamType})`);
    }

    const gpuConnector = powerScores.gpu[pc.gpu]?.connector;
    const mbGpuConnector = powerScores.motherboard[pc.motherboard]?.gpuConnector;
    if (gpuConnector && mbGpuConnector && gpuConnector !== mbGpuConnector) {
        errors.push(`Несовместимость разъёмов GPU: ${pc.gpu} (${gpuConnector}) и ${pc.motherboard} (${mbGpuConnector})`);
    }

    const storageInterface = powerScores.storage[pc.storage]?.interface;
    const mbStorageInterfaces = powerScores.motherboard[pc.motherboard]?.storageInterface;
    if (storageInterface && mbStorageInterfaces && !mbStorageInterfaces.includes(storageInterface)) {
        errors.push(`Несовместимость интерфейса накопителя: ${pc.storage} (${storageInterface}) и ${pc.motherboard} (${mbStorageInterfaces.join(", ")})`);
    }

    return errors;
};

export const calculatePower = (pc: PCConfig, powerScores: PowerScores): number => {
    const cpuScore = powerScores.cpu[pc.cpu]?.power || 0;
    const gpuScore = powerScores.gpu[pc.gpu]?.power || 0;
    const ramScore = powerScores.ram[pc.ram]?.power || 0;
    const storageScore = powerScores.storage[pc.storage]?.power || 0;
    const motherboardScore = powerScores.motherboard[pc.motherboard]?.power || 0;
    const psuScore = powerScores.psu[pc.psu]?.power || 0;
    return cpuScore + gpuScore + ramScore + storageScore + motherboardScore + psuScore;
};