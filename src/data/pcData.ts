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

export const powerScores: PowerScores = {
    cpu: {
        "Intel i3-12100": { power: 50, socket: "LGA 1700" },
        "Intel i5-12400": { power: 80, socket: "LGA 1700" },
        "Intel i7-12700": { power: 120, socket: "LGA 1700" },
        "Intel i9-12900K": { power: 160, socket: "LGA 1700" },
        "AMD Ryzen 3 5300G": { power: 45, socket: "AM4" },
        "AMD Ryzen 5 5600X": { power: 90, socket: "AM4" },
        "AMD Ryzen 7 5800X": { power: 130, socket: "AM4" },
        "AMD Ryzen 9 5900X": { power: 170, socket: "AM4" },
    },
    gpu: {
        "NVIDIA GTX 1650": { power: 40, connector: "PCIe x16" },
        "NVIDIA GTX 1660 Ti": { power: 60, connector: "PCIe x16" },
        "NVIDIA RTX 3060": { power: 100, connector: "PCIe x16" },
        "NVIDIA RTX 3070": { power: 130, connector: "PCIe x16" },
        "NVIDIA RTX 3080": { power: 150, connector: "PCIe x16" },
        "NVIDIA RTX 4090": { power: 200, connector: "PCIe x16" },
        "AMD RX 6500 XT": { power: 50, connector: "PCIe x16" },
        "AMD RX 6600 XT": { power: 90, connector: "PCIe x16" },
        "AMD RX 6700 XT": { power: 120, connector: "PCIe x16" },
        "AMD RX 6800 XT": { power: 140, connector: "PCIe x16" },
    },
    ram: {
        "4GB": { power: 10, type: "DDR4" },
        "8GB": { power: 20, type: "DDR4" },
        "16GB": { power: 40, type: "DDR4" },
        "32GB": { power: 60, type: "DDR4" },
        "64GB": { power: 80, type: "DDR4" },
    },
    storage: {
        "128GB SSD": { power: 10, interface: "SATA" },
        "256GB SSD": { power: 20, interface: "SATA" },
        "512GB SSD": { power: 30, interface: "NVMe" },
        "1TB SSD": { power: 50, interface: "NVMe" },
        "2TB SSD": { power: 70, interface: "NVMe" },
        "4TB SSD": { power: 90, interface: "NVMe" },
        "1TB HDD": { power: 15, interface: "SATA" },
        "2TB HDD": { power: 25, interface: "SATA" },
    },
    motherboard: {
        "B450": { power: 20, socket: "AM4", ramType: "DDR4", gpuConnector: "PCIe x16", storageInterface: ["SATA", "NVMe"] },
        "B550": { power: 30, socket: "AM4", ramType: "DDR4", gpuConnector: "PCIe x16", storageInterface: ["SATA", "NVMe"] },
        "X570": { power: 40, socket: "AM4", ramType: "DDR4", gpuConnector: "PCIe x16", storageInterface: ["SATA", "NVMe"] },
        "Z690": { power: 35, socket: "LGA 1700", ramType: "DDR4", gpuConnector: "PCIe x16", storageInterface: ["SATA", "NVMe"] },
        "Z790": { power: 45, socket: "LGA 1700", ramType: "DDR4", gpuConnector: "PCIe x16", storageInterface: ["SATA", "NVMe"] },
    },
    psu: {
        "400W": { power: 10 },
        "500W": { power: 20 },
        "650W": { power: 30 },
        "750W": { power: 40 },
        "850W": { power: 50 },
        "1000W": { power: 60 },
    },
};

export type PCConfig = {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    motherboard: string;
    psu: string;
};

export const checkCompatibility = (pc: PCConfig): string[] => {
    const errors: string[] = [];

    const requiredFields = ["cpu", "gpu", "ram", "storage", "motherboard", "psu"];
    requiredFields.forEach((field) => {
        if (!pc[field as keyof PCConfig]) {
            errors.push(`Не выбран ${field === "cpu" ? "процессор" : field === "gpu" ? "видеокарта" : field === "ram" ? "оперативная память" : field === "storage" ? "накопитель" : field === "motherboard" ? "материнская плата" : "блок питания"}`);
        }
    });

    if (errors.length > 0) return errors;

    const cpuSocket = powerScores.cpu[pc.cpu as keyof typeof powerScores.cpu]?.socket;
    const mbSocket = powerScores.motherboard[pc.motherboard as keyof typeof powerScores.motherboard]?.socket;
    if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
        errors.push(`Несовместимость сокетов: ${pc.cpu} (сокет ${cpuSocket}) и ${pc.motherboard} (сокет ${mbSocket})`);
    }

    const ramType = powerScores.ram[pc.ram as keyof typeof powerScores.ram]?.type;
    const mbRamType = powerScores.motherboard[pc.motherboard as keyof typeof powerScores.motherboard]?.ramType;
    if (ramType && mbRamType && ramType !== mbRamType) {
        errors.push(`Несовместимость типов RAM: ${pc.ram} (${ramType}) и ${pc.motherboard} (${mbRamType})`);
    }

    const gpuConnector = powerScores.gpu[pc.gpu as keyof typeof powerScores.gpu]?.connector;
    const mbGpuConnector = powerScores.motherboard[pc.motherboard as keyof typeof powerScores.motherboard]?.gpuConnector;
    if (gpuConnector && mbGpuConnector && gpuConnector !== mbGpuConnector) {
        errors.push(`Несовместимость разъёмов GPU: ${pc.gpu} (${gpuConnector}) и ${pc.motherboard} (${mbGpuConnector})`);
    }

    const storageInterface = powerScores.storage[pc.storage as keyof typeof powerScores.storage]?.interface;
    const mbStorageInterfaces = powerScores.motherboard[pc.motherboard as keyof typeof powerScores.motherboard]?.storageInterface;
    if (storageInterface && mbStorageInterfaces && !mbStorageInterfaces.includes(storageInterface)) {
        errors.push(`Несовместимость интерфейса накопителя: ${pc.storage} (${storageInterface}) и ${pc.motherboard} (${mbStorageInterfaces.join(", ")})`);
    }

    return errors;
};

export const calculatePower = (pc: PCConfig): number => {
    const cpuScore = powerScores.cpu[pc.cpu as keyof typeof powerScores.cpu]?.power || 0;
    const gpuScore = powerScores.gpu[pc.gpu as keyof typeof powerScores.gpu]?.power || 0;
    const ramScore = powerScores.ram[pc.ram as keyof typeof powerScores.ram]?.power || 0;
    const storageScore = powerScores.storage[pc.storage as keyof typeof powerScores.storage]?.power || 0;
    const motherboardScore = powerScores.motherboard[pc.motherboard as keyof typeof powerScores.motherboard]?.power || 0;
    const psuScore = powerScores.psu[pc.psu as keyof typeof powerScores.psu]?.power || 0;
    return cpuScore + gpuScore + ramScore + storageScore + motherboardScore + psuScore;
};