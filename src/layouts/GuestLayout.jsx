import { Outlet } from "react-router-dom";
import GuestNavbar from "../components/common/GuestNavbar";
import Footer from "../components/common/Footer";

const GuestLayout = () => {
  return (
    <>
      <GuestNavbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default GuestLayout;