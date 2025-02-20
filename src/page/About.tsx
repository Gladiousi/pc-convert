import Faq from "../components/faq";

const About = () => {

    return (
        <div>
            <div className="space-y-8 text-center w-full h-[40dvh] flex flex-wrap items-center">
                <div className="w-full space-y-8">
                    <h1 data-aos="fade-down" className="text-4xl w-full font-light text-gray-800">
                        О нас
                    </h1>
                    <p data-aos="fade-down" data-aos-delay="200" className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Мы создали PC Compare, чтобы помочь вам легко находить и сравнивать лучшие компьютерные комплектующие.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                    { title: "Надежность", text: "Мы собираем только актуальную информацию.", effect: "hover:rotate-[4deg] hover:scale-105" },
                    { title: "Удобство", text: "Интуитивный интерфейс для быстрого сравнения.", effect: "hover:skew-x-[4deg] hover:scale-110" },
                    { title: "Точность", text: "Точные технические характеристики.", effect: "hover:-rotate-[4deg] hover:scale-95" }
                ].map((item, index) => (
                    <div
                        key={index}
                        data-aos="fade-up"
                        data-aos-delay={index * 200}
                        className={`bg-white p-6 shadow-md rounded-xl transform transition-all duration-[1s] ease-[cubic-bezier(0.22, 1, 0.36, 1)] ${item.effect} hover:shadow-2xl`}
                    >
                        <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                        <p className="text-gray-600">{item.text}</p>
                    </div>
                ))}
            </div>
            <Faq />
        </div>
    );
};

export default About;