import Faq from "../components/Faq";

const About = () => {
    return (
        <div className="w-full px-4 py-8">
            <div className="space-y-6 text-center w-full min-h-[40dvh] flex flex-col justify-center items-center">
                <h1
                    data-aos="fade-down"
                    className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800"
                >
                    О нас
                </h1>
                <p
                    data-aos="fade-down"
                    data-aos-delay="200"
                    className="text-base sm:text-lg text-gray-600 max-w-3xl"
                >
                    Мы создали PC Compare, чтобы помочь вам легко находить и сравнивать лучшие компьютерные комплектующие.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 px-4">
                {[
                    { title: "Надежность", text: "Мы собираем только актуальную информацию.", effect: "hover:rotate-[4deg] hover:scale-105" },
                    { title: "Удобство", text: "Интуитивный интерфейс для быстрого сравнения.", effect: "hover:skew-x-[4deg] hover:scale-110" },
                    { title: "Точность", text: "Точные технические характеристики.", effect: "hover:-rotate-[4deg] hover:scale-95" },
                ].map((item, index) => (
                    <div
                        key={index}
                        data-aos="fade-up"
                        data-aos-delay={index * 200}
                        className={`bg-white p-6 shadow-md rounded-xl transform transition-all duration-[1s] ease-[cubic-bezier(0.22, 1, 0.36, 1)] ${item.effect} hover:shadow-2xl`}
                    >
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{item.title}</h3>
                        <p className="text-gray-600 text-sm sm:text-base">{item.text}</p>
                    </div>
                ))}
            </div>
            <div className="mt-8 px-4">
                <Faq />
            </div>
        </div>
    );
};

export default About;