import computers from "../data/pc";

const View = () => {
    return (
        <div className="w-full py-8 sm:py-12 space-y-12 px-4">
            <h1
                data-aos="fade-down"
                className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 text-center mb-12 sm:mb-28"
            >
                Примеры ПК
            </h1>

            {computers.map((pc, index) => (
                <div
                    key={index}
                    data-aos={index % 2 === 0 ? "fade-up-right" : "fade-up-left"}
                    className="flex flex-col items-center gap-6 min-h-[30dvh]"
                >
                    <img
                        src={pc.image}
                        alt={pc.title}
                        className="w-full max-w-md rounded-lg shadow-lg"
                    />
                    <div className="text-center space-y-4">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{pc.title}</h2>
                        <p className="text-gray-600 text-sm sm:text-base">{pc.description}</p>
                    </div>
                </div>
            ))}

            <div data-aos="fade-up" className="w-full bg-gray-100 p-6 sm:p-8 rounded-lg shadow-md">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center">Сравнение ПК</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 text-center">
                    {computers.slice(0, 3).map((pc, index) => (
                        <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                            <img
                                src={pc.image}
                                alt={pc.title}
                                className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{pc.title}</h3>
                            <p className="text-gray-600 text-sm sm:text-base">{pc.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div data-aos="fade-up" className="w-full bg-gray-200 p-6 sm:p-8 rounded-lg shadow-md">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center">Сравнение компактных и хай-энд ПК</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 text-center">
                    {computers.slice(3, 5).map((pc, index) => (
                        <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                            <img
                                src={pc.image}
                                alt={pc.title}
                                className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{pc.title}</h3>
                            <p className="text-gray-600 text-sm sm:text-base">{pc.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default View;