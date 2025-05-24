import { useEffect } from "react";
import { useApi } from "./useApi";
import { ComponentOptions } from "../interface/hooks";

export const useComponentOptions = (token: string | null) => {
    const { data, error, isLoading, request } = useApi<ComponentOptions>();

    useEffect(() => {
        if (token) {
            request("http://localhost:5000/components/options", { token });
        }
    }, [token, request]);

    return { options: data, error, isLoading };
};