import { useState, useEffect } from "react";
import { fetchPowerScores } from "../data/pcData";
import { ComponentData, ComponentSocket } from "../interface/pc";


export const useComponentData = (token: string | null, setToken: (token: string | null) => void, setActiveTab: (tab: string) => void) => {
    const [data, setData] = useState<ComponentData>({
        powerScores: null,
        sockets: [],
        errors: [],
        isLoading: true,
    });

    useEffect(() => {
        if (!token) {
            setActiveTab("home");
            return;
        }

        const loadData = async () => {
            try {
                const [scores, components] = await Promise.all([
                    fetchPowerScores(token),
                    fetch("http://localhost:5000/components/filter?type=CPU", {
                        headers: { Authorization: `Bearer ${token}` },
                    }).then((res) => {
                        if (!res.ok) throw new Error("Failed to fetch sockets");
                        return res.json();
                    }),
                ]);

                const uniqueSockets = [...new Set(components.map((c: ComponentSocket) => c.socket).filter(Boolean))] as string[];
                setData({ powerScores: scores, sockets: uniqueSockets, errors: [], isLoading: false });
            } catch (err: any) {
                setData((prev: any) => ({ ...prev, errors: ["Ошибка загрузки данных: " + err.message], isLoading: false }));
                setToken(null);
                setActiveTab("home");
            }
        };

        loadData();
    }, [token, setToken, setActiveTab]);

    return data;
};