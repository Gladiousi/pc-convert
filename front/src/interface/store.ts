type Page = "home" | "compare" | "view" | "about";

interface PageState {
    activePage: Page;
    setActivePage: (page: Page) => void;
}

interface PowerScores {
  cpu: Record<string, { power: number; socket: string }>;
  gpu: Record<string, { power: number; connector: string }>;
  ram: Record<string, { power: number; type: string }>;
  storage: Record<string, { power: number; interface: string }>;
  motherboard: Record<string, { power: number; socket: string; ramType: string; gpuConnector: string; storageInterface: string[] }>;
  psu: Record<string, { power: number }>;
}

type TabState = {
  activeTab: string;
  token: string | null;
  role: string | null;
  powerScores: PowerScores | null;
  setActiveTab: (tab: string) => void;
  setToken: (token: string | null) => void;
  setPowerScores: (scores: PowerScores | null) => void;
};

export type { PageState, TabState }