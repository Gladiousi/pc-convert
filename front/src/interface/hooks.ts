interface FormState<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    submitError: string | null;
    success: string;
}

interface UseFormOptions<T> {
    initialValues: T;
    validate?: (values: T) => Partial<Record<keyof T, string>>;
}

interface ComponentOptions {
    socketOptions: string[];
    connectorOptions: string[];
    ramTypeOptions: string[];
    interfaceOptions: string[];
    gpuConnectorOptions: string[];
    storageInterfaceOptions: string[];
}

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    isLoading: boolean;
}

export type { FormState, UseFormOptions, ComponentOptions, ApiResponse };