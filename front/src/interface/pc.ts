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

type PCConfig = {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    motherboard: string;
    psu: string;
};

export type { PowerScores, PCConfig }