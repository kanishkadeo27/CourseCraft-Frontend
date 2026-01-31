import { Outlet } from "react-router-dom";
import UserNavbar from "../components/common/UserNavbar";
import Footer from "../components/common/Footer";

const UserLayout = () => {
  return (
    <>
      <UserNavbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;