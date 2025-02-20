const Home = () => {
    return (
        <div>
            <div className="text-center w-full h-[60dvh] space-y-8 flex flex-wrap justify-center items-center">
                <div className="w-full space-y-8">
                    <h1
                        data-aos="fade-up"
                        className="text-5xl font-light text-gray-800 w-full"
                    >
                        Добро пожаловать в PC Compare
                    </h1>
                    <p data-aos="fade-up" data-aos-delay="200" className="text-lg text-gray-600 w-full">
                        Лучший способ сравнить характеристики компьютеров перед покупкой.
                    </p>
                </div>
                <div className="flex justify-center gap-6 mt-8">
                    <button
                        data-aos="zoom-in"
                        className="px-6 py-3 bg-blue-500 text-white text-lg rounded-full shadow-md hover:bg-blue-600 transition"
                    >
                        Начать сравнение
                    </button>
                    <button
                        data-aos="zoom-in"
                        data-aos-delay="200"
                        className="px-6 py-3 bg-gray-200 text-gray-800 text-lg rounded-full shadow-md hover:bg-gray-300 transition"
                    >
                        Узнать больше
                    </button>
                </div>
            </div>
            
        </div>
    );
};

export default Home;