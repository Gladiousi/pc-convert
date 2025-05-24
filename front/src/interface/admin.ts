interface Component {
    name: string;
    type: string;
    power: number;
    socket: string;
    connector: string;
    ramType: string;
    interface: string;
    storageInterfaces: string[];
    gpuConnector: string;
}

interface ComponentFormProps {
    token: string | null;
}

interface TabSelectorProps {
    activeTab: "users" | "components";
    setTab: (tab: "users" | "components") => void;
}

interface User {
    id: number;
    email: string;
    role: string;
    createdAt: string;
}

interface UserManagementProps {
    users: User[];
    loading: boolean;
}

export type { Component, ComponentFormProps, TabSelectorProps, UserManagementProps, User }