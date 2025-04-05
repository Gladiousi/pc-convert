import { useTabStore } from "../store/useTabStore";

const Home = () => {
    const { setActiveTab } = useTabStore();

    return (
        <div className="w-full min-h-[60dvh] flex flex-col justify-center items-center px-4 py-8">
            <div className="text-center space-y-6 w-full max-w-3xl">
                <h1
                    data-aos="fade-down"
                    className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-800"
                >
                    Добро пожаловать в PC Compare
                </h1>
                <p
                    data-aos="fade-down"
                    data-aos-delay="200"
                    className="text-base sm:text-lg text-gray-600"
                >
                    Лучший способ сравнить характеристики компьютеров перед покупкой.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 w-full max-w-md">
                <button
                    data-aos="zoom-in"
                    className="px-6 py-3 bg-blue-500 text-white text-base sm:text-lg rounded-full shadow-md hover:bg-blue-600 transition-all duration-300"
                    onClick={() => setActiveTab("compare")}
                >
                    Начать сравнение
                </button>
                <button
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    className="px-6 py-3 bg-gray-200 text-gray-800 text-base sm:text-lg rounded-full shadow-md hover:bg-gray-300 transition-all duration-300"
                    onClick={() => setActiveTab("about")}
                >
                    Узнать больше
                </button>
            </div>
        </div>
    );
};

export default Home;