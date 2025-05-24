import { memo } from "react";
import { TabSelectorProps } from "../../interface/common";

const TabSelector = <T extends string>({ tabs, activeTab, setTab }: TabSelectorProps<T>) => {
  return (
    <div className="flex space-x-4 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setTab(tab.value)}
          className={`px-4 py-2 rounded-lg ${activeTab === tab.value ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default memo(TabSelector);