import { AssembleAction, AssembleState, CompareAction, CompareState } from "../interface/page";

export const initialStateAssemble: AssembleState = {
    pc: { cpu: "", gpu: "", ram: "", storage: "", motherboard: "", psu: "" },
    socket: "",
    power: null,
    localErrors: [],
    isCalculating: false,
};

export const reducerAssemble = (state: AssembleState, action: AssembleAction): AssembleState => {
    switch (action.type) {
        case "SET_PC":
            return { ...state, pc: action.payload };
        case "SET_SOCKET":
            return { ...state, socket: action.payload, pc: { ...state.pc, cpu: "", motherboard: "" } };
        case "SET_POWER":
            return { ...state, power: action.payload };
        case "SET_ERRORS":
            return { ...state, localErrors: action.payload };
        case "SET_CALCULATING":
            return { ...state, isCalculating: action.payload };
        default:
            return state;
    }
};

export const initialStateCompare: CompareState = {
    pc1: { cpu: "", gpu: "", ram: "", storage: "", motherboard: "", psu: "" },
    pc2: { cpu: "", gpu: "", ram: "", storage: "", motherboard: "", psu: "" },
    pc1Socket: "",
    pc2Socket: "",
    result: null,
    localErrors: [],
    isComparing: false,
};

export const reducerCompare = (state: CompareState, action: CompareAction): CompareState => {
    switch (action.type) {
        case "SET_PC1":
            return { ...state, pc1: action.payload };
        case "SET_PC2":
            return { ...state, pc2: action.payload };
        case "SET_PC1_SOCKET":
            return { ...state, pc1Socket: action.payload, pc1: { ...state.pc1, cpu: "", motherboard: "" } };
        case "SET_PC2_SOCKET":
            return { ...state, pc2Socket: action.payload, pc2: { ...state.pc2, cpu: "", motherboard: "" } };
        case "SET_RESULT":
            return { ...state, result: action.payload };
        case "SET_ERRORS":
            return { ...state, localErrors: action.payload };
        case "SET_COMPARING":
            return { ...state, isComparing: action.payload };
        default:
            return state;
    }
};