import { usePageStore } from "../store/activePage";
import Home from "../page/Home";
import Compare from "../page/Compare";
import View from "../page/View";
import About from "../page/About";

const Main = () => {
    const { activePage } = usePageStore();

    return (
        <main className="container mx-auto p-8">
            <div className="bg-white shadow-lg rounded-2xl p-6 min-h-[60vh] transition-all duration-300">
                {activePage === "home" && <Home />}
                {activePage === "compare" && <Compare />}
                {activePage === "view" && <View />}
                {activePage === "about" && <About />}
            </div>
        </main>
    );
};

export default Main;
