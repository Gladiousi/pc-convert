import computers from "../data/pc";

const View = () => {

    return (
        <div className="w-full py-12 space-y-16">
            <h1 className="text-4xl font-light text-gray-800 text-center mb-28">Примеры ПК</h1>

            {computers.map((pc, index) => (
                <div
                    key={index}
                    data-aos="fade-up"
                    className={`flex flex-col md:flex-row items-center ${pc.side === "left" ? "md:flex-row" : "md:flex-row-reverse"} gap-8 h-[30dvh]`}
                >
                    <img src={pc.image} alt={pc.title} className="w-full md:w-1/2 rounded-lg shadow-lg" />
                    <div className="text-center md:text-left space-y-4 md:w-1/2">
                        <h2 className="text-2xl font-semibold text-gray-800">{pc.title}</h2>
                        <p className="text-gray-600">{pc.description}</p>
                    </div>
                </div>
            ))}

            <div data-aos="fade-up" className="w-full bg-gray-100 p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-gray-800 text-center">Сравнение ПК</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-center">
                    {computers.slice(0, 3).map((pc, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                            <img src={pc.image} alt={pc.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800">{pc.title}</h3>
                            <p className="text-gray-600">{pc.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div data-aos="fade-up" className="w-full bg-gray-200 p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-gray-800 text-center">Сравнение компактных и хай-энд ПК</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-center">
                    {computers.slice(3, 5).map((pc, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                            <img src={pc.image} alt={pc.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800">{pc.title}</h3>
                            <p className="text-gray-600">{pc.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default View;
