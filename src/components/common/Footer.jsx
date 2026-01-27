import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();
   return (
    <footer className="ftr-footer">
  <div className="ftr-container">

    {/* TOP ROW */}
    <div className="ftr-row footer-top">

      {/* LOGO + SOCIAL */}
      <div className="ftr-col-lg-3">
        <img
          src="/image/navbar-logo.png"
          alt="EduHub"
          className="footer-logo"
        />

        <div className="ftr-footer_social">
          <ul>
            <li><img src="/image/footer/facebook.png" alt="fb" /></li>
            <li><img src="/image/footer/icons8-github-512.png" alt="github" /></li>
            <li><img src="/image/footer/instagram.png" alt="insta" /></li>
            <li><img src="/image/footer/linkedin.png" alt="linkedin" /></li>
          </ul>
        </div>
      </div>

      {/* CONTACT */}
      <div className="ftr-col-lg-3">
        <h4 className="ftr-footer_title">Contact Us</h4>
        <p>Email: projectmail027@gmail.com</p>
        <p>Phone: +91 6264547523</p>
        <p>Address: CDAC Panchwati, Pune, 411008, Maharashtra, India</p>
      </div>

      {/* MENU */}
      <div className="ftr-col-lg-3">
  <h4 className="ftr-footer_title">Menu</h4>

  {/* ================= GUEST MENU ================= */}
  {!user && (
    <div className="menu-grid">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/search">Search</Link></li>
      </ul>
      <ul>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/contact-us">Contact Us</Link></li>
        <li><Link to="/signup">Signup</Link></li>
      </ul>
    </div>
  )}

  {/* ================= USER MENU ================= */}
  {user?.role?.toLowerCase() === "user" && (
    <div className="menu-grid">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/search">Search</Link></li>
        <li><Link to="/courses">Courses</Link></li>
      </ul>
      <ul>
        <li><Link to="/user/my-courses">My Courses</Link></li>
        <li><Link to="/user/profile">Profile</Link></li>
        <li><Link to="/contact-us">Contact Us</Link></li>
      </ul>
    </div>
  )}

  {/* ================= ADMIN MENU ================= */}
  {user?.role?.toLowerCase() === "admin" && (
    <div className="menu-grid">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/search">Search</Link></li>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/courses/create">Add Course</Link></li>
      </ul>
      <ul>
        <li><Link to="/admin/manage-courses">Manage Courses</Link></li>
        <li><Link to="/admin/users">Manage Users</Link></li>
        <li><Link to="/admin/analytics">Analytics</Link></li>
        <li><Link to="/user/profile">Profile</Link></li>
      </ul>
    </div>
  )}
</div>


      {/* MOBILE APP */}
      <div className="ftr-col-lg-3">
        <h4 className="ftr-footer_title">Mobile App</h4>
        <img src="/image/footer/mobile_1.png" className="app-badge" />
        <img src="/image/footer/mobile_2.png" className="app-badge" />
      </div>

    </div>

    {/* DIVIDER */}
    <hr className="footer-divider" />

    {/* BOTTOM BAR */}
    <div className="footer-bottom">
      <span>Copyright © 2026 EduHub. All rights reserved</span>
      <div className="footer-links">
        <span>Copyright notification</span>
        <span>Terms of Use</span>
        <span>Privacy Policy</span>
      </div>
    </div>

  </div>
</footer>

  );
};

export default Footer;
