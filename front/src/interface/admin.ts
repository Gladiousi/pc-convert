interface Component {
    id?: string | undefined;
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
    activeTab: "users" | "components" | 'componentManagement';
    setTab: (tab: "users" | "components" | 'componentManagement') => void;
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

interface ComponentManagementProps {
    token: string | null;
}

export type { Component, ComponentFormProps, TabSelectorProps, UserManagementProps, User, ComponentManagementProps }