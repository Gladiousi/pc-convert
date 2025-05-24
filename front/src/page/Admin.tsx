import { useEffect, useState, memo, useMemo } from "react";
import { useTabStore } from "../store/useTabStore";
import { useApi } from "../hooks/useApi";
import TabSelector from "../components/admin/TabSelector";
import UserManagement from "../components/admin/UserManagement";
import ComponentForm from "../components/admin/ComponentForm";
import PageContainer from "../components/common/PageContainer";
import SectionHeading from "../components/common/SectionHeading";
import { User } from "../interface/admin";
import { debounce } from "lodash";

const Admin: React.FC = () => {
  const { token, setActiveTab } = useTabStore();
  const [tab, setTab] = useState<"users" | "components">("users");
  const { data: users, error, isLoading, request } = useApi<User[]>();

  const fetchUsers = useMemo(
    () =>
      debounce(async () => {
        if (token && tab === "users") {
          await request("http://localhost:5000/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }, 300),
    [token, tab, request]
  );

  useEffect(() => {
    if (!token) {
      setActiveTab("home");
      return;
    }
    fetchUsers();
  }, [token, setActiveTab, fetchUsers]);

  useEffect(() => {
    if (error) {
      setActiveTab("home");
    }
  }, [error, setActiveTab]);

  return (
    <PageContainer className="space-y-10">
      <SectionHeading>Админка</SectionHeading>
      <div className="w-full text-black max-w-3xl sm:max-w-4xl bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <TabSelector activeTab={tab} setTab={setTab} />
        {tab === "users" ? (
          <UserManagement users={users || []} loading={isLoading} />
        ) : (
          <ComponentForm token={token} />
        )}
      </div>
    </PageContainer>
  );
};

export default memo(Admin);