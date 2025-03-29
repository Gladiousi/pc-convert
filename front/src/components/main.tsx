import { useEffect } from "react";
import { useTabStore } from "../store/useTabStore";
import Home from "../page/Home";
import Compare from "../page/Compare";
import View from "../page/View";
import About from "../page/About";
import Auth from "../components/Auth";

const Main = () => {
    const { activeTab, setActiveTab, token } = useTabStore();

    useEffect(() => {
        const savedTab = localStorage.getItem("activeTab");
        if (savedTab) setActiveTab(savedTab);
    }, [setActiveTab]);

    const isAuthenticated = !!token;
    const renderContent = () => {
        if (activeTab === "home") return <Home />;
        if (activeTab === "compare") {
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
                            Войдите или зарегистрируйтесь, чтобы сравнить компьютеры.
                        </p>
                        <div data-aos="fade-up" data-aos-delay="300">
                            <Auth />
                        </div>
                    </div>
                );
            }
            return <Compare />;
        }
        if (activeTab === "view") return <View />;
        if (activeTab === "about") return <About />;
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