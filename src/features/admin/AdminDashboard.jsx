import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../api";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTrainers: 0,
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    totalEnrollments: 0,
    recentEnrollmentAgo: '',
    recentCoursePublishedAgo: '',
    recentUserRegisteredAgo: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Load dashboard stats
  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Load main dashboard stats
      const dashboardData = await adminService.getDashboardStats();
      const statsData = dashboardData.data || dashboardData;
      
      // Load trainers count separately since it's not in dashboard API
      const trainersData = await adminService.getAllTrainers();
      const trainersList = trainersData.data || trainersData.trainers || trainersData;
      const trainersCount = Array.isArray(trainersList) ? trainersList.length : 0;
      
      setStats({
        totalTrainers: trainersCount,
        totalCourses: statsData.totalCourses || 0,
        totalStudents: statsData.totalStudents || 0,
        totalRevenue: statsData.totalRevenue || 0,
        totalEnrollments: statsData.totalEnrollments || 0,
        recentEnrollmentAgo: statsData.recentEnrollmentAgo || '',
        recentCoursePublishedAgo: statsData.recentCoursePublishedAgo || '',
        recentUserRegisteredAgo: statsData.recentUserRegisteredAgo || ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to load dashboard data: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
        </div>

        {/* Error Message */}
        {message && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : stats.totalCourses.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trainers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : stats.totalTrainers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : stats.totalStudents.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : `₹${stats.totalRevenue.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enrollments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : stats.totalEnrollments.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/admin/courses/create" className="block w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition">
                + Create New Course
              </a>
              <a href="/admin/trainer/create" className="block w-full text-left px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition">
                👨‍🏫 Add Trainer
              </a>
              <a href="/admin/manage-courses" className="block w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition">
                📚 Manage Courses
              </a>
              <a href="/admin/users" className="block w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition">
                👥 Manage Users
              </a>
              <a href="/admin/trainers" className="block w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition">
                🎓 Manage Trainers
              </a>
          </div>
        </div>

        {/* Recent Activity */}
        {!loading && (stats.recentEnrollmentAgo || stats.recentCoursePublishedAgo || stats.recentUserRegisteredAgo) && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              {stats.recentEnrollmentAgo && (
                <div className="flex justify-between">
                  <span className="text-gray-600">New enrollment</span>
                  <span className="text-gray-500">{stats.recentEnrollmentAgo}</span>
                </div>
              )}
              {stats.recentCoursePublishedAgo && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Course published</span>
                  <span className="text-gray-500">{stats.recentCoursePublishedAgo}</span>
                </div>
              )}
              {stats.recentUserRegisteredAgo && (
                <div className="flex justify-between">
                  <span className="text-gray-600">User registered</span>
                  <span className="text-gray-500">{stats.recentUserRegisteredAgo}</span>
                </div>
              )}
            </div>
          </div>
        )}
        

      </div>
    </div>
  );
};

export default AdminDashboard;