interface Component {
    power: number;
    socket?: string;
    connector?: string;
    type?: string;
    interface?: string;
    ramType?: string;
    gpuConnector?: string;
    storageInterface?: string[];
}

interface CPU extends Component {
    socket: string;
}

interface GPU extends Component {
    connector: string;
}

interface RAM extends Component {
    type: string;
}

interface Storage extends Component {
    interface: string;
}

interface Motherboard extends Component {
    socket: string;
    ramType: string;
    gpuConnector: string;
    storageInterface: string[];
}

interface PSU extends Component {
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

interface ComponentData {
    powerScores: PowerScores | null;
    sockets: string[];
    errors: string[];
    isLoading: boolean;
}

interface ComponentSocket {
    socket: string;
}

export type { PowerScores, PSU, GPU, CPU, Motherboard, RAM, Storage, PCConfig, ComponentSocket, ComponentData }