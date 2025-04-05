import { motion } from "framer-motion";
import { useTabStore } from "../store/useTabStore";

const Header = () => {
    const { activeTab, setActiveTab, token, role, setToken } = useTabStore();

    const handleLogout = () => {
        setToken(null);
        setActiveTab("home");
    };

    const navItems = [
        { id: "home", label: "Главная" },
        { id: "compare", label: "Сравнение" },
        { id: "view", label: "Просмотр" },
        { id: "about", label: "О нас" },
    ];

    return (
        <header className="bg-white shadow-md py-4 sticky top-0 z-50">
            <nav
                data-aos="fade-down"
                className="container mx-auto flex justify-between items-center px-6"
            >
                <h1 className="text-2xl font-semibold text-gray-800">PC Compare</h1>

                <div className="flex space-x-6">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className="relative px-4 py-2 text-lg font-light text-gray-700 transition-all ease-in-out duration-300 hover:text-blue-500"
                        >
                            {item.label}
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                    {token ? (
                        <>
                            {role === "ADMIN" && (
                                <button
                                    onClick={() => setActiveTab("admin")}
                                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300"
                                >
                                    Админка
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                            >
                                Выход
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setActiveTab("auth")}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                        >
                            Вход
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;