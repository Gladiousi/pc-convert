import { UserManagementProps } from "../../interface/admin";

const UserManagement: React.FC<UserManagementProps> = ({ users, loading }) => {
    if (loading) {
        return (
            <div className="w-full min-h-[80dvh] flex justify-center items-center">
                <p className="text-lg sm:text-xl text-gray-600">Загрузка...</p>
            </div>
        );
    }

    return (
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
    );
};

export default UserManagement;