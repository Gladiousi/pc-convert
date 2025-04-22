import { memo } from "react";
import { TabSelectorProps } from "../../interface/admin";

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, setTab }) => {
    return (
        <div className="flex space-x-4 mb-4">
            <button
                onClick={() => setTab("users")}
                className={`px-4 py-2 rounded-lg ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            >
                Пользователи
            </button>
            <button
                onClick={() => setTab("components")}
                className={`px-4 py-2 rounded-lg ${activeTab === "components" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            >
                Компоненты
            </button>
        </div>
    );
};

export default memo(TabSelector);