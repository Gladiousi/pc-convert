import { useState, useCallback } from "react";
import { ApiResponse } from "../interface/hooks";

export const useApi = <T>() => {
  const [response, setResponse] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const request = useCallback(
    async (url: string, options: RequestInit & { token?: string }) => {
      setResponse((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const headers = {
          "Content-Type": "application/json",
          ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
          ...options.headers,
        };
        const res = await fetch(url, { ...options, headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Request failed");
        setResponse({ data, error: null, isLoading: false });
        return data;
      } catch (err: any) {
        setResponse({ data: null, error: err.message, isLoading: false });
        throw err;
      }
    },
    []
  );

  return { ...response, request };
};