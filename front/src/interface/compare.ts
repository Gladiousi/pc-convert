import { PCConfig, PowerScores } from "./pc";

interface ComparisonResultProps {
    pc1: PCConfig;
    pc2: PCConfig;
    result: { pc1Power: number; pc2Power: number } | null;
    powerScores: PowerScores | null;
}

interface PCConfigFormProps {
    pc: PCConfig;
    setPc: (pc: PCConfig) => void;
    powerScores: PowerScores | null;
    socket: string;
    label: string;
}

interface SocketSelectorProps {
    socket: string;
    setSocket: (socket: string) => void;
    sockets: string[];
    label: string;
}

export type { ComparisonResultProps, PCConfigFormProps, SocketSelectorProps }