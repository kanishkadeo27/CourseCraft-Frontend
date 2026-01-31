import { useAuth } from "../context/AuthContext";
import GuestLayout from "./GuestLayout";
import UserLayout from "./UserLayout";
import AdminLayout from "./AdminLayout";
import Loader from "../components/common/Loader";

const DynamicLayout = () => {
  const { user, loading, getUserRole } = useAuth();

  if (loading) {
    return <Loader />;
  }

  // Select layout based on user role
  if (!user) {
    return <GuestLayout />;
  }

  const userRole = getUserRole();

  if (userRole === "admin") {
    return <AdminLayout />;
  }

  if (userRole === "user") {
    return <UserLayout />;
  }

  // Fallback to guest layout
  return <GuestLayout />;
};

export default DynamicLayout;