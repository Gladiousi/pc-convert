import { useEffect } from "react";
import { useTabStore } from "../store/useTabStore";
import Home from "../page/Home";
import Compare from "../page/Compare";
import Assemble from "../page/Assemble";
import View from "../page/View";
import About from "../page/About";
import Auth from "../components/Auth";
import Admin from "../page/Admin";

const Main = () => {
    const { activeTab, setActiveTab, token } = useTabStore();

    useEffect(() => {
        const savedTab = localStorage.getItem("activeTab");
        if (savedTab) setActiveTab(savedTab);
    }, [setActiveTab]);

    const isAuthenticated = !!token;
    const renderContent = () => {
        if (activeTab === "home") return <Home />;
        if (activeTab === "compare" || activeTab === "assemble") {
            if (!isAuthenticated) {
                return (
                    <div className="text-center min-h-[60dvh] flex flex-col justify-center items-center space-y-6">
                        <h2
                            data-aos="fade-down"
                            className="text-3xl font-light text-gray-800"
                        >
                            Требуется авторизация
                        </h2>
                        <p
                            data-aos="fade-down"
                            data-aos-delay="200"
                            className="text-lg text-gray-600 max-w-md"
                        >
                            Войдите или зарегистрируйтесь, чтобы {activeTab === "compare" ? "сравнить компьютеры" : "собрать ПК"}.
                        </p>
                        <button
                            onClick={() => setActiveTab("auth")}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                        >
                            Вход
                        </button>
                    </div>
                );
            }
            return activeTab === "compare" ? <Compare /> : <Assemble />;
        }
        if (activeTab === "view") return <View />;
        if (activeTab === "about") return <About />;
        if (activeTab === "admin") return <Admin />;
        if (activeTab === "auth") return <Auth />;
    };

    return (
        <main className="container mx-auto p-8">
            <div className="bg-white shadow-lg rounded-2xl p-6 min-h-[80vh] transition-all duration-300">
                {renderContent()}
            </div>
        </main>
    );
};

export default Main;