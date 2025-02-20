import { create } from "zustand";

interface TabState {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const useTabStore = create<TabState>((set) => ({
    activeTab: localStorage.getItem("activeTab") || "home",
    setActiveTab: (tab) => {
        localStorage.setItem("activeTab", tab);
        set({ activeTab: tab });
    },
}));
