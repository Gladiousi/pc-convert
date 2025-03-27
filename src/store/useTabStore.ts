import { create } from "zustand";

interface TabState {
    activeTab: string;
    token: string | null;
    setActiveTab: (tab: string) => void;
    setToken: (token: string | null) => void;
}

export const useTabStore = create<TabState>((set) => ({
    activeTab: localStorage.getItem("activeTab") || "home",
    token: localStorage.getItem("token") || null,
    setActiveTab: (tab) => {
        localStorage.setItem("activeTab", tab);
        set({ activeTab: tab });
    },
    setToken: (token) => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
        set({ token });
    },
}));