import { useState, useEffect } from "react";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with real analytics API
    const loadAnalytics = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await analyticsService.getAnalytics();
        // setAnalyticsData(response.data);
        
        // Mock data for demonstration
        setTimeout(() => {
          setAnalyticsData({
            overview: {
              totalUsers: 1234,
              totalCourses: 24,
              totalEnrollments: 3456,
              revenue: 45678,
              growthRate: 12.5
            },
            userGrowth: [
              { date: "2024-01-01", users: 100 },
              { date: "2024-01-02", users: 120 },
              { date: "2024-01-03", users: 150 },
              { date: "2024-01-04", users: 180 },
              { date: "2024-01-05", users: 200 },
              { date: "2024-01-06", users: 230 },
              { date: "2024-01-07", users: 250 }
            ],
            popularCourses: [
              { name: "React Fundamentals", enrollments: 456, revenue: 12000 },
              { name: "Node.js Backend", enrollments: 389, revenue: 10500 },
              { name: "Python Basics", enrollments: 234, revenue: 8900 },
              { name: "Java Spring Boot", enrollments: 198, revenue: 7800 },
              { name: "Database Design", enrollments: 167, revenue: 6700 }
            ],
            recentActivity: [
              { action: "New user registration", user: "john@example.com", time: "2 minutes ago" },
              { action: "Course enrollment", user: "jane@example.com", course: "React Fundamentals", time: "5 minutes ago" },
              { action: "Course completion", user: "bob@example.com", course: "Python Basics", time: "15 minutes ago" },
              { action: "Payment received", user: "alice@example.com", amount: "₹2,999", time: "30 minutes ago" },
              { action: "New course published", course: "Advanced JavaScript", time: "1 hour ago" }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Platform performance and insights</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.totalUsers.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm font-medium">+{analyticsData.overview.growthRate}%</span>
              <span className="text-gray-500 text-sm ml-1">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.totalCourses}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enrollments</p>
                <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.totalEnrollments.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">₹{analyticsData.overview.revenue.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.growthRate}%</p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Trend</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.userGrowth.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-blue-500 rounded-t w-8"
                    style={{ height: `${(day.users / 250) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(day.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Courses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Courses</h3>
            <div className="space-y-4">
              {analyticsData.popularCourses.map((course, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{course.name}</p>
                    <p className="text-sm text-gray-500">{course.enrollments} enrollments</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{course.revenue.toLocaleString()}</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(course.enrollments / 500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      {activity.user && `by ${activity.user}`}
                      {activity.course && ` - ${activity.course}`}
                      {activity.amount && ` - ${activity.amount}`}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;