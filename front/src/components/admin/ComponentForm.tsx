import { useState } from "react";
import { Component, ComponentFormProps } from "../../interface/admin";

const socketOptions = ["LGA 1700", "LGA 1200", "AM4", "AM5", "sTRX4"];
const connectorOptions = ["PCIe x16", "PCIe x8", "PCIe x4"];
const ramTypeOptions = ["DDR4", "DDR5", "DDR3"];
const interfaceOptions = ["SATA", "NVMe", "M.2", "SATA Express"];
const gpuConnectorOptions = ["PCIe x16", "PCIe x8", "PCIe x4"];
const storageInterfaceOptions = ["SATA", "NVMe", "M.2", "SATA Express"];

const ComponentForm: React.FC<ComponentFormProps> = ({ token }) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!token) {
            setError("Требуется авторизация");
            return;
        }
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

    return (
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
                        className="w-full p-2 border border-gray-300 rounded-lg h-24"
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
    );
};

export default ComponentForm;