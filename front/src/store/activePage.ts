import { create } from "zustand";
import { PageState } from "../interface/store";

export const usePageStore = create<PageState>((set) => ({
  activePage: "home",
  setActivePage: (page) => set({ activePage: page }),
}));
