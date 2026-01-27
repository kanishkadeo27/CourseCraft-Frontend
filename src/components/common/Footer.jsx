import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();
   return (
    <footer className="ftr-footer">
  <div className="ftr-container">

    {/* TOP ROW */}
    <div className="ftr-row footer-top">

      {/* LOGO + ABOUT */}
      <div className="ftr-col-lg-3">
        <img
          src="/image/navbar-logo.png"
          alt="EduHub"
          className="footer-logo"
        />
        <p className="footer-description">
          EduHub is your gateway to quality education. We provide comprehensive courses 
          and learning resources to help you achieve your academic and professional goals.
        </p>
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

      {/* QUICK INFO */}
      <div className="ftr-col-lg-3">
        <h4 className="ftr-footer_title">Quick Info</h4>
        <div className="quick-info">
          <p><strong>📚 Course Categories:</strong> Programming, Web Development, Data Science</p>
          <p><strong>🎓 Students Enrolled:</strong> 1000+</p>
          <p><strong>👨‍🏫 Expert Instructors:</strong> 50+</p>
          <p><strong>⏰ Support Hours:</strong> Mon-Fri 9AM-6PM</p>
        </div>
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
