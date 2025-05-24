import { PCConfig } from "./pc";

interface AssembleState {
    pc: PCConfig;
    socket: string;
    power: number | null;
    localErrors: string[];
    isCalculating: boolean;
}

type AssembleAction =
    | { type: "SET_PC"; payload: PCConfig }
    | { type: "SET_SOCKET"; payload: string }
    | { type: "SET_POWER"; payload: number | null }
    | { type: "SET_ERRORS"; payload: string[] }
    | { type: "SET_CALCULATING"; payload: boolean };

interface CompareState {
    pc1: PCConfig;
    pc2: PCConfig;
    pc1Socket: string;
    pc2Socket: string;
    result: { pc1Power: number; pc2Power: number } | null;
    localErrors: string[];
    isComparing: boolean;
}

type CompareAction =
    | { type: "SET_PC1"; payload: PCConfig }
    | { type: "SET_PC2"; payload: PCConfig }
    | { type: "SET_PC1_SOCKET"; payload: string }
    | { type: "SET_PC2_SOCKET"; payload: string }
    | { type: "SET_RESULT"; payload: { pc1Power: number; pc2Power: number } | null }
    | { type: "SET_ERRORS"; payload: string[] }
    | { type: "SET_COMPARING"; payload: boolean };

export type { AssembleAction, AssembleState, CompareAction, CompareState }