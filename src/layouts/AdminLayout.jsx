import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/common/AdminNavbar";
import Footer from "../components/common/Footer";

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AdminLayout;