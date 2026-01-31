import { Routes, Route } from "react-router-dom";
import DynamicLayout from "../layouts/DynamicLayout";
import { AuthenticatedRoute, AdminRoute, StudentRoute } from "../components/common/ProtectedRoute";

// Auth
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";

// Public Pages
import Home from "../pages/Home";
import About from "../pages/About";
import ContactUs from "../pages/ContactUs";
import Search from "../pages/Search";

// User Pages
import Profile from "../pages/Profile";

// Courses (Public + Protected)
import CourseCatalog from "../features/courses/CourseCatalog";
import CourseDetails from "../features/courses/CourseDetails";
import CourseSyllabus from "../features/courses/CourseSyllabus";
import MyCourses from "../features/courses/MyCourses";
import Classroom from "../features/courses/Classroom";
import PdfViewerPage from "../features/courses/PdfViewerPage";

// Admin Features
import CreateCourse from "../features/admin/CreateCourse";
import ManageCourse from "../features/admin/ManageCourse";
import AdminDashboard from "../features/admin/AdminDashboard";
import ManageUsers from "../features/admin/ManageUsers";
import ManageTrainers from "../features/admin/ManageTrainers";
import ManageTrainer from "../features/admin/ManageTrainer";
import Analytics from "../features/admin/Analytics";
import CreateTrainer from "../features/admin/CreateTrainer";
import CourseContentManager from "../features/admin/CourseContentManager";
import AdminManageCourses from "../features/admin/AdminManageCourses";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<DynamicLayout />}>

        {/* ================= PUBLIC ROUTES ================= */}
        {/* Anyone can access these */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/search" element={<Search />} />
        
        {/* Public Course Routes */}
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:id/syllabus" element={<CourseSyllabus />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        
        {/* Protected Course Routes */}
        <Route path="/courses/:id/classroom" element={
          <StudentRoute>
            <Classroom />
          </StudentRoute>
        } />
        
        <Route path="/courses/:id/pdf/:pdfId" element={
          <StudentRoute>
            <PdfViewerPage />
          </StudentRoute>
        } />

        {/* ================= USER ROUTES ================= */}
        {/* Only authenticated users can access these */}
        <Route path="/user/profile" element={
          <AuthenticatedRoute>
            <Profile />
          </AuthenticatedRoute>
        } />
        
        <Route path="/user/my-courses" element={
          <StudentRoute>
            <MyCourses />
          </StudentRoute>
        } />

        {/* ================= ADMIN ROUTES ================= */}
        {/* Only admin users can access these */}
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        
        <Route path="/admin/courses/create" element={
          <AdminRoute>
            <CreateCourse />
          </AdminRoute>
        } />
        
        <Route path="/admin/courses/content" element={
          <AdminRoute>
            <CourseContentManager />
          </AdminRoute>
        } />
        
        <Route path="/admin/trainer/create" element={
          <AdminRoute>
            <CreateTrainer />
          </AdminRoute>
        } />
        
        <Route path="/admin/trainers" element={
          <AdminRoute>
            <ManageTrainers />
          </AdminRoute>
        } />
        
        <Route path="/admin/manage/:id/trainer" element={
          <AdminRoute>
            <ManageTrainer />
          </AdminRoute>
        } />
        
        <Route path="/admin/courses/manage/:id" element={
          <AdminRoute>
            <ManageCourse />
          </AdminRoute>
        } />
        
        <Route path="/admin/manage-courses" element={
          <AdminRoute>
            <AdminManageCourses />
          </AdminRoute>
        } />
        
        <Route path="/admin/users" element={
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        } />
        
        <Route path="/admin/analytics" element={
          <AdminRoute>
            <Analytics />
          </AdminRoute>
        } />
        
        <Route path="/admin/profile" element={
          <AdminRoute>
            <Profile />
          </AdminRoute>
        } />

        {/* ================= LEGACY REDIRECTS ================= */}
        {/* Redirect old paths to new structure */}
        <Route path="/profile" element={
          <AuthenticatedRoute>
            <Profile />
          </AuthenticatedRoute>
        } />
        
        <Route path="/my-courses" element={
          <StudentRoute>
            <MyCourses />
          </StudentRoute>
        } />

        {/* Admin legacy redirects */}
        <Route path="/admin/create-course" element={
          <AdminRoute>
            <CreateCourse />
          </AdminRoute>
        } />

      </Route>
    </Routes>
  );
};

export default AppRoutes;
