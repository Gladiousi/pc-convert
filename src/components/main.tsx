import Home from "../page/Home";
import Compare from "../page/Compare";
import View from "../page/View";
import About from "../page/About";
import { useEffect } from "react";
import { useTabStore } from "../store/useTabStore";

const Main = () => {
    const { activeTab, setActiveTab } = useTabStore();

    useEffect(() => {
        const savedTab = localStorage.getItem("activeTab");
        if (savedTab) setActiveTab(savedTab);
    }, [setActiveTab]);


    return (
        <main className="container mx-auto p-8">
            <div className="bg-white shadow-lg rounded-2xl p-6 min-h-[60vh] transition-all duration-300">
                {activeTab === "home" && <Home />}
                {activeTab === "compare" && <Compare />}
                {activeTab === "view" && <View />}
                {activeTab === "about" && <About />}
            </div>
        </main>
    );
};

export default Main;
