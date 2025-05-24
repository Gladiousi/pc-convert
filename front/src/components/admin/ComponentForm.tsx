import { Component, ComponentFormProps } from "../../interface/admin";
import { useForm } from "../../hooks/useForm";
import { useApi } from "../../hooks/useApi";
import { Select, MultiSelect } from "../common/Select";
import Card from "../common/Card";
import Alert from "../common/Alert";
import { componentOptions } from "../../utils/option";

const ComponentForm: React.FC<ComponentFormProps> = ({ token }) => {
    const initialValues: Component = {
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

    const { values, errors, submitError, success, handleChange, handleSubmit, resetForm } = useForm<Component>({
        initialValues,
        validate: (values) => {
            const errors: Partial<Record<keyof Component, string>> = {};
            if (!values.name) errors.name = "Название обязательно";
            if (!values.type) errors.type = "Тип обязателен";
            if (values.power <= 0) errors.power = "Мощность должна быть больше 0";
            return errors;
        },
    });

    const { error: apiError, request } = useApi<any>();

    const onSubmit = async (values: Component) => {
        if (!token) throw new Error("Требуется авторизация");
        await request("http://localhost:5000/admin/components", {
            method: "POST",
            token,
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
    };

    return (
        <Card>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Добавить компонент</h2>
            <Alert type="error" message={submitError || apiError} />
            <Alert type="success" message={success} />
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
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                >
                    Создать
                </button>
            </form>
        </Card>
    );
};

export default ComponentForm;