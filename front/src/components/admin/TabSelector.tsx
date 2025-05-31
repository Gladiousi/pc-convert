import { memo } from "react";
import { TabSelectorProps } from "../../interface/admin";

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, setTab }) => {
    return (
        <div className="flex space-x-2 mb-6">
            <button
                onClick={() => setTab("users")}
                className={`p-2 rounded-lg ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            >
                Пользователи
            </button>
            <button
                onClick={() => setTab("components")}
                className={`p-2 rounded-lg ${activeTab === "components" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            >
                Добавить компонент
            </button>
            <button
                onClick={() => setTab("componentManagement")}
                className={`p-2 rounded-lg ${activeTab === "componentManagement" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            >
                Управление компонентами
            </button>
        </div>
    );
};

export default memo(TabSelector);