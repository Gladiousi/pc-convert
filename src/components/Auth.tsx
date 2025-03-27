import React, { useState } from "react";
import { useTabStore } from "../store/useTabStore";

const Auth: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const { setToken, setActiveTab } = useTabStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/register";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok && data.token) {
                setToken(data.token);
                setActiveTab("compare");
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    };

    return (
        <div className="text-center w-full min-h-[60dvh] flex flex-col justify-center items-center space-y-8">
            <div className="w-full max-w-md space-y-6">
                <h2
                    data-aos="fade-down"
                    className="text-4xl font-light text-gray-800"
                >
                    {isLogin ? "Вход" : "Регистрация"}
                </h2>
                <p
                    data-aos="fade-down"
                    data-aos-delay="200"
                    className="text-lg text-gray-600"
                >
                    {isLogin
                        ? "Войдите, чтобы начать сравнение"
                        : "Создайте аккаунт для доступа"}
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full p-4 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                        data-aos="fade-up"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Пароль"
                        className="w-full p-4 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                        data-aos="fade-up"
                        data-aos-delay="100"
                    />
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-blue-500 text-white text-lg rounded-full shadow-md hover:bg-blue-600 transition"
                        data-aos="zoom-in"
                        data-aos-delay="200"
                    >
                        {isLogin ? "Войти" : "Зарегистрироваться"}
                    </button>
                </form>
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-500 hover:underline text-lg"
                    data-aos="fade-up"
                    data-aos-delay="300"
                >
                    {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
                </button>
            </div>
        </div>
    );
};

export default Auth;