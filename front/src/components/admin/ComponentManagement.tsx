import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { Component, ComponentManagementProps } from "../../interface/admin";
import Card from "../common/Card";
import Alert from "../common/Alert";
import { useForm } from "../../hooks/useForm";
import { Select, MultiSelect } from "../common/Select";
import { componentOptions } from "../../utils/option";

const ComponentManagement: React.FC<ComponentManagementProps> = ({ token }) => {
    const { data: components, error, isLoading, request } = useApi<Component[]>();
    const [editingComponent, setEditingComponent] = useState<Component | null>(null);

    useEffect(() => {
        if (token) {
            request("http://localhost:5000/admin/components", {
                headers: { Authorization: `Bearer ${token}` },
            });
        }
    }, [token, request]);

    const initialValues: Component = {
        id: "",
        name: "",
        type: "",
        power: 0,
        socket: "",
        connector: "",
        ramType: "",
        interface: "",
        storageInterfaces: [],
        gpuConnector: "",
    };

    const { values, errors, submitError, success, handleChange, handleSubmit, resetForm, setValues } = useForm<Component>({
        initialValues,
        validate: (values) => {
            const errors: Partial<Record<keyof Component, string>> = {};
            if (!values.name) errors.name = "Название обязательно";
            if (!values.type) errors.type = "Тип обязателен";
            if (values.power <= 0) errors.power = "Мощность должна быть больше 0";
            return errors;
        },
    });

    useEffect(() => {
        if (editingComponent) {
            setValues({
                id: editingComponent.id || "",
                name: editingComponent.name || "",
                type: editingComponent.type || "",
                power: editingComponent.power || 0,
                socket: editingComponent.socket || "",
                connector: editingComponent.connector || "",
                ramType: editingComponent.ramType || "",
                interface: editingComponent.interface || "",
                storageInterfaces: editingComponent.storageInterfaces || [],
                gpuConnector: editingComponent.gpuConnector || "",
            });
        }
    }, [editingComponent, setValues]);

    const handleDelete = async (id: string) => {
        if (!token) return;
        try {
            await request(`http://localhost:5000/admin/components/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            await request("http://localhost:5000/admin/components", {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            console.error("Ошибка при удалении:", err);
        }
    };

    const onSubmit = async (values: Component) => {
        if (!token || !values.id) throw new Error("Требуется авторизация и ID компонента");
        await request(`http://localhost:5000/admin/components/${values.id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                name: values.name,
                type: values.type,
                power: parseInt(values.power.toString()),
                socket: values.socket || null,
                connector: values.connector || null,
                ramType: values.ramType || null,
                interface: values.interface || null,
                storageInterfaces: values.storageInterfaces.length ? values.storageInterfaces : [],
                gpuConnector: values.gpuConnector || null,
            }),
        });
        resetForm();
        setEditingComponent(null);
        await request("http://localhost:5000/admin/components", {
            headers: { Authorization: `Bearer ${token}` },
        });
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-[80dvh] flex justify-center items-center">
                <p className="text-lg sm:text-xl text-gray-600">Загрузка...</p>
            </div>
        );
    }

    return (
        <Card>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Управление компонентами</h2>
            <Alert type="error" message={error || submitError} />
            <Alert type="success" message={success} />

            {editingComponent && (
                <div className="mb-6 p-4 border border-gray-300 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Редактировать компонент</h3>
                    <form onSubmit={(e) => handleSubmit(onSubmit)(e)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Название</label>
                            <input
                                type="text"
                                value={values.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                        </div>
                        <Select
                            label="Тип"
                            value={values.type}
                            onChange={(val) => handleChange("type", val)}
                            options={["CPU", "GPU", "RAM", "Storage", "Motherboard", "PSU"]}
                            placeholder="Выберите тип"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Мощность</label>
                            <input
                                type="number"
                                value={values.power}
                                onChange={(e) => handleChange("power", parseInt(e.target.value) || 0)}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                required
                            />
                            {errors.power && <p className="text-red-500 text-xs">{errors.power}</p>}
                        </div>
                        <Select
                            label="Сокет"
                            value={values.socket}
                            onChange={(val) => handleChange("socket", val)}
                            options={componentOptions.socketOptions}
                        />
                        <Select
                            label="Коннектор"
                            value={values.connector}
                            onChange={(val) => handleChange("connector", val)}
                            options={componentOptions.connectorOptions}
                        />
                        <Select
                            label="Тип RAM"
                            value={values.ramType}
                            onChange={(val) => handleChange("ramType", val)}
                            options={componentOptions.ramTypeOptions}
                        />
                        <Select
                            label="Интерфейс"
                            value={values.interface}
                            onChange={(val) => handleChange("interface", val)}
                            options={componentOptions.interfaceOptions}
                        />
                        <MultiSelect
                            label="Интерфейсы хранения"
                            value={values.storageInterfaces}
                            onChange={(val) => handleChange("storageInterfaces", val)}
                            options={componentOptions.storageInterfaceOptions}
                        />
                        <Select
                            label="Коннектор GPU"
                            value={values.gpuConnector}
                            onChange={(val) => handleChange("gpuConnector", val)}
                            options={componentOptions.gpuConnectorOptions}
                        />
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                            >
                                Сохранить
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingComponent(null)}
                                className="w-full bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {components && components.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-700 text-xs sm:text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 sm:p-3">ID</th>
                                <th className="p-2 sm:p-3">Название</th>
                                <th className="p-2 sm:p-3">Тип</th>
                                <th className="p-2 sm:p-3">Мощность</th>
                                <th className="p-2 sm:p-3">Сокет</th>
                                <th className="p-2 sm:p-3">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {components.map((component) => (
                                <tr key={component.id} className="border-b hover:bg-gray-100">
                                    <td className="p-2 sm:p-3">{component.id}</td>
                                    <td className="p-2 sm:p-3">{component.name}</td>
                                    <td className="p-2 sm:p-3">{component.type}</td>
                                    <td className="p-2 sm:p-3">{component.power}</td>
                                    <td className="p-2 sm:p-3">{component.socket || "N/A"}</td>
                                    <td className="p-2 sm:p-3">
                                        <button
                                            onClick={() => setEditingComponent(component)}
                                            className="bg-yellow-500 text-white p-1 sm:p-2 rounded-lg hover:bg-yellow-600 transition-all duration-300 mr-2"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm("Вы уверены, что хотите удалить этот компонент?")) {
                                                    handleDelete(component.id!);
                                                }
                                            }}
                                            className="bg-red-500 text-white p-1 sm:p-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600 text-sm sm:text-base">Компоненты не найдены</p>
            )}
        </Card>
    );
};

export default ComponentManagement;