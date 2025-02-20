import { motion } from "framer-motion";
import { useTabStore } from "../store/useTabStore";

const Header = () => {
    const { activeTab, setActiveTab } = useTabStore();

    return (
        <header className="bg-white shadow-md py-4">
            <nav data-aos="fade-down" className="container mx-auto flex justify-center space-x-6 relative">
                {["home", "compare", "view", "about"].map((page) => (
                    <button
                        key={page}
                        onClick={() => setActiveTab(page as any)}
                        className="relative px-4 py-2 text-lg font-light text-gray-700 transition-all ease-in-out duration-300 hover:text-blue-500"
                    >
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                        {activeTab === page && (
                            <motion.div
                                layoutId="underline"
                                className="absolute left-0 bottom-0 w-full h-1 bg-blue-500 rounded-full"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </nav>
        </header>
    );
};

export default Header;