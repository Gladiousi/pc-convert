import { useState } from "react";
import faqs from "../data/faq";

const Faq = () => {

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div>
            <div className="w-full space-y-6 mt-8">
                <h2 data-aos="fade-down" className="text-2xl font-semibold text-gray-800 mt-32">Часто задаваемые вопросы (FAQ)</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div data-aos="fade-down" key={index} className="bg-white p-4 shadow-md rounded-lg transition-all ease-in-out duration-300 hover:shadow-xl">
                            <button
                                className="w-full text-left text-lg font-semibold text-gray-800 duration-300"
                                onClick={() => toggleFAQ(index)}
                            >
                                {faq.question}
                            </button>
                            {openIndex === index && (
                                <p className="mt-2 text-gray-600">{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Faq;