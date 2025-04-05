import { useState } from "react";
import { useTabStore } from "../store/useTabStore";

const Auth: React.FC = () => {
    const { setToken, setActiveTab } = useTabStore();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const url = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/register";
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Ошибка");
            }

            if (isLogin) {
                setToken(data.token);
                setActiveTab("compare");
            } else {
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="w-full min-h-[80dvh] flex flex-col justify-center items-center p-4 sm:p-6 bg-gray-50">
            <h1
                data-aos="fade-down"
                className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-800 mb-6 sm:mb-8"
            >
                {isLogin ? "Вход" : "Регистрация"}
            </h1>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-4 sm:space-y-6 transform hover:scale-105 transition-transform duration-300"
            >
                <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700">Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                        required
                    />
                </div>
                {error && (
                    <p className="text-red-500 text-xs sm:text-sm text-center">{error}</p>
                )}
                <button
                    type="submit"
                    className="w-full px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base sm:text-xl font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                >
                    {isLogin ? "Войти" : "Зарегистрироваться"}
                </button>
                <p
                    className="text-center text-gray-600 cursor-pointer hover:text-blue-500 transition text-xs sm:text-sm"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
                </p>
            </form>
        </div>
    );
};

export default Auth;