import { FormEvent, useState } from "react";
import { useTabStore } from "../store/useTabStore";

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setToken, setActiveTab } = useTabStore();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        const url = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/register";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong!");
            }

            if (isLogin) {
                setToken(data.token);
                localStorage.setItem("token", data.token);
                setActiveTab("compare");
            } else {
                setError("Регистрация успешна! Теперь войдите.");
                setIsLogin(true);
            }

            setEmail("");
            setPassword("");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="w-full min-h-[60dvh] flex justify-center items-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h1 data-aos="fade-down" className="text-3xl font-light text-gray-800 mb-6 text-center">
                    {isLogin ? "Вход" : "Регистрация"}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div data-aos="fade-up">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="Введите ваш email"
                            required
                        />
                    </div>
                    <div data-aos="fade-up" data-aos-delay="100">
                        <label className="block text-sm font-medium text-gray-700">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="Введите ваш пароль"
                            required
                        />
                    </div>
                    {error && (
                        <p data-aos="fade-up" className="text-red-600 text-sm text-center">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                        data-aos="zoom-in"
                        data-aos-delay="200"
                    >
                        {isLogin ? "Войти" : "Зарегистрироваться"}
                    </button>
                </form>
                <p
                    className="mt-4 text-center text-gray-600 cursor-pointer hover:text-blue-500 transition"
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError("");
                        setEmail("");
                        setPassword("");
                    }}
                    data-aos="fade-up"
                    data-aos-delay="300"
                >
                    {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
                </p>
            </div>
        </div>
    );
};

export default Auth;