import { create } from "zustand";

type Page = "home" | "compare" | "view" | "about";

interface PageState {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

export const usePageStore = create<PageState>((set) => ({
  activePage: "home",
  setActivePage: (page) => set({ activePage: page }),
}));
