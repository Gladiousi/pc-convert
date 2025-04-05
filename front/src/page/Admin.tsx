import { useEffect, useState } from "react";
import { useTabStore } from "../store/useTabStore";

interface User {
    id: number;
    email: string;
    role: string;
    createdAt: string;
}

const Admin: React.FC = () => {
    const { token, setActiveTab } = useTabStore();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetch("http://localhost:5000/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    if (!res.ok) {
                        setActiveTab("home");
                        return null;
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data) {
                        setUsers(data);
                        setLoading(false);
                    }
                });
        } else {
            setActiveTab("home");
        }
    }, [token, setActiveTab]);

    if (loading) {
        return (
            <div className="w-full min-h-[80dvh] flex justify-center items-center">
                <p className="text-lg sm:text-xl text-gray-600">Загрузка...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[80dvh] flex flex-col justify-center items-center p-4 sm:p-6 bg-gray-50">
            <h1
                data-aos="fade-down"
                className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-800 mb-6 sm:mb-8"
            >
                Админка
            </h1>
            <div
                className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-4 sm:p-6"
                data-aos="fade-up"
            >
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Пользователи</h2>
                {users.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-700 text-xs sm:text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2 sm:p-3">ID</th>
                                    <th className="p-2 sm:p-3">Email</th>
                                    <th className="p-2 sm:p-3">Роль</th>
                                    <th className="p-2 sm:p-3">Дата регистрации</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-gray-100">
                                        <td className="p-2 sm:p-3">{user.id}</td>
                                        <td className="p-2 sm:p-3 break-all">{user.email}</td>
                                        <td className="p-2 sm:p-3">{user.role}</td>
                                        <td className="p-2 sm:p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600 text-sm sm:text-base">Пользователи не найдены</p>
                )}
            </div>
        </div>
    );
};

export default Admin;