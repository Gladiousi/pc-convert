import { JSX, useEffect } from "react";
import { useTabStore } from "../store/useTabStore";
import Auth from "../components/Auth";
import Home from "../page/Home";
import Compare from "../page/Compare";
import Assemble from "../page/Assemble";
import View from "../page/View";
import About from "../page/About";
import Admin from "../page/Admin";

// const Home = lazy(() => import('../page/Home'));
// const Compare = lazy(() => import('../page/Compare'));
// const Assemble = lazy(() => import('../page/Assemble'));
// const View = lazy(() => import('../page/View'));
// const About = lazy(() => import('../page/About'));
// const Admin = lazy(() => import('../page/Admin'));

const routes: Record<string, JSX.Element> = {
    home: <Home />,
    compare: <Compare />,
    assemble: <Assemble />,
    view: <View />,
    about: <About />,
    admin: <Admin />,
    auth: <Auth />,
};

const Main = () => {
    const { activeTab, setActiveTab, token } = useTabStore();

    useEffect(() => {
        const savedTab = localStorage.getItem("activeTab");
        if (savedTab && Object.keys(routes).includes(savedTab)) {
            setActiveTab(savedTab);
        }
    }, [setActiveTab]);

    const isAuthenticated = !!token;

    const renderContent = () => {
        if ((activeTab === "compare" || activeTab === "assemble") && !isAuthenticated) {
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
                        data-aos="fade-down"
                        data-aos-delay="200"
                        onClick={() => setActiveTab("auth")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                        aria-label="Перейти к авторизации"
                    >
                        Вход
                    </button>
                </div>
            );
        }
        return routes[activeTab] || <Home />;
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