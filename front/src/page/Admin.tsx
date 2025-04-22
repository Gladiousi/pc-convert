import { useEffect, useState } from "react";
import { useTabStore } from "../store/useTabStore";
import TabSelector from "../components/admin/TabSelector";
import UserManagement from "../components/admin/UserManagement";
import ComponentForm from "../components/admin/ComponentForm";
import { User } from "../interface/admin";

const Admin: React.FC = () => {
  const { token, setActiveTab } = useTabStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"users" | "components">("users");

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

  return (
    <div className="text-black w-full min-h-[80dvh] flex flex-col justify-center items-center p-4 sm:p-6 bg-gray-50">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-800 mb-6 sm:mb-8">
        Админка
      </h1>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <TabSelector activeTab={tab} setTab={setTab} />
        {tab === "users" ? (
          <UserManagement users={users} loading={loading} />
        ) : (
          <ComponentForm token={token} />
        )}
      </div>
    </div>
  );
};

export default Admin;