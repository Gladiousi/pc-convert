import { useEffect, useState } from "react";
import { useTabStore } from "../store/useTabStore";

interface User {
    id: number;
    email: string;
    role: string;
    createdAt: string;
}

interface Component {
    name: string;
    type: string;
    power: number;
    socket?: string;
    connector?: string;
    ramType?: string;
    interface?: string;
    storageInterfaces: string[];
    gpuConnector?: string;
}

const socketOptions = ["LGA 1700", "LGA 1200", "AM4", "AM5", "sTRX4"];
const connectorOptions = ["PCIe x16", "PCIe x8", "PCIe x4"];
const ramTypeOptions = ["DDR4", "DDR5", "DDR3"];
const interfaceOptions = ["SATA", "NVMe", "M.2", "SATA Express"];
const gpuConnectorOptions = ["PCIe x16", "PCIe x8", "PCIe x4"];
const storageInterfaceOptions = ["SATA", "NVMe", "M.2", "SATA Express"];

const Admin: React.FC = () => {
    const { token, setActiveTab } = useTabStore();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"users" | "components">("users");
    const [form, setForm] = useState<Component>({
        name: "",
        type: "",
        power: 0,
        socket: "",
        connector: "",
        ramType: "",
        interface: "",
        storageInterfaces: [],
        gpuConnector: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (token && tab === "users") {
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
        } else if (!token) {
            setActiveTab("home");
        }
    }, [token, setActiveTab, tab]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const res = await fetch("http://localhost:5000/admin/components", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: form.name,
                    type: form.type,
                    power: parseInt(form.power.toString()),
                    socket: form.socket || null,
                    connector: form.connector || null,
                    ramType: form.ramType || null,
                    interface: form.interface || null,
                    storageInterfaces: form.storageInterfaces.length ? form.storageInterfaces : [],
                    gpuConnector: form.gpuConnector || null,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create component");
            setSuccess("Компонент успешно создан");
            setForm({
                name: "",
                type: "",
                power: 0,
                socket: "",
                connector: "",
                ramType: "",
                interface: "",
                storageInterfaces: [],
                gpuConnector: "",
            });
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading && tab === "users") {
        return (
            <div className="w-full min-h-[80dvh] flex justify-center items-center">
                <p className="text-lg sm:text-xl text-gray-600">Загрузка...</p>
            </div>
        );
    }

    return (
        <div className="w-full text-black min-h-[80dvh] flex flex-col justify-center items-center p-4 sm:p-6 bg-gray-50">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-800 mb-6 sm:mb-8">
                Админка
            </h1>
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={() => setTab("users")}
                        className={`px-4 py-2 rounded-lg ${tab === "users" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                        Пользователи
                    </button>
                    <button
                        onClick={() => setTab("components")}
                        className={`px-4 py-2 rounded-lg ${tab === "components" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                        Компоненты
                    </button>
                </div>
                {tab === "users" ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Добавить компонент</h2>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Название</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Тип</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="">Выберите тип</option>
                                    {["CPU", "GPU", "RAM", "Storage", "Motherboard", "PSU"].map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Мощность</label>
                                <input
                                    type="number"
                                    value={form.power}
                                    onChange={(e) => setForm({ ...form, power: parseInt(e.target.value) || 0 })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Сокет</label>
                                <select
                                    value={form.socket}
                                    onChange={(e) => setForm({ ...form, socket: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Выберите сокет</option>
                                    {socketOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Коннектор</label>
                                <select
                                    value={form.connector}
                                    onChange={(e) => setForm({ ...form, connector: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Выберите коннектор</option>
                                    {connectorOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Тип RAM</label>
                                <select
                                    value={form.ramType}
                                    onChange={(e) => setForm({ ...form, ramType: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Выберите тип RAM</option>
                                    {ramTypeOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Интерфейс</label>
                                <select
                                    value={form.interface}
                                    onChange={(e) => setForm({ ...form, interface: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Выберите интерфейс</option>
                                    {interfaceOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Интерфейсы хранения</label>
                                <select
                                    multiple
                                    value={form.storageInterfaces}
                                    onChange={(e) => setForm({ ...form, storageInterfaces: Array.from(e.target.selectedOptions, (option) => option.value) })}
                                    className="w-full p-2 border border-gray-300 rounded-lg h-26"
                                >
                                    {storageInterfaceOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Коннектор GPU</label>
                                <select
                                    value={form.gpuConnector}
                                    onChange={(e) => setForm({ ...form, gpuConnector: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Выберите коннектор GPU</option>
                                    {gpuConnectorOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                            >
                                Создать
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Admin;