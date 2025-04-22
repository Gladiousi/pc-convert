import { create } from "zustand";
import { TabState } from "../interface/store";

export const useTabStore = create<TabState>((set) => ({
  activeTab: "home",
  token: localStorage.getItem("token") || null,
  role: null,
  powerScores: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setToken: (token) => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const expiration = decoded.exp * 1000;
        if (Date.now() > expiration) {
          localStorage.removeItem("token");
          set({ token: null, role: null });
        } else {
          localStorage.setItem("token", token);
          set({ token, role: decoded.role || null });
        }
      } catch (error) {
        localStorage.removeItem("token");
        set({ token: null, role: null });
      }
    } else {
      localStorage.removeItem("token");
      set({ token: null, role: null });
    }
  },
  setPowerScores: (powerScores) => set({ powerScores }),
}));

const checkTokenExpiration = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const expiration = decoded.exp * 1000;
      if (Date.now() > expiration) {
        localStorage.removeItem("token");
        useTabStore.getState().setToken(null);
      } else {
        useTabStore.getState().setToken(token);
      }
    } catch (error) {
      localStorage.removeItem("token");
      useTabStore.getState().setToken(null);
    }
  }
};

checkTokenExpiration();