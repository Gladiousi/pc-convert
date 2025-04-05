import { create } from "zustand";

type TabState = {
    activeTab: string;
    token: string | null;
    role: string | null;
    setActiveTab: (tab: string) => void;
    setToken: (token: string | null) => void;
};

export const useTabStore = create<TabState>((set) => ({
    activeTab: "home",
    token: localStorage.getItem("token") || null,
    role: null,
    setActiveTab: (tab) => set({ activeTab: tab }),
    setToken: (token) => {
        if (token) {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            const expiration = decoded.exp * 1000; 
            if (Date.now() > expiration) {
                localStorage.removeItem("token");
                set({ token: null, role: null });
            } else {
                localStorage.setItem("token", token);
                set({ token, role: decoded.role || null });
            }
        } else {
            localStorage.removeItem("token");
            set({ token: null, role: null });
        }
    },
}));

const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");
    if (token) {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const expiration = decoded.exp * 1000;
        if (Date.now() > expiration) {
            localStorage.removeItem("token");
            useTabStore.getState().setToken(null);
        } else {
            useTabStore.getState().setToken(token);
        }
    }
};

checkTokenExpiration();