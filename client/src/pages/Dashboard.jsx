import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import api from "../utils/axiosInstance";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/superadmin/analytics/summary");
        console.log(res);

        setAnalytics(res.data.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">Total Users</h2>
              <p className="text-3xl font-bold">{analytics.totalUsers}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">Active Users (7d)</h2>
              <p className="text-3xl font-bold">{analytics.activeUsers}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-gray-500">Roles Count</h2>
              <p className="text-3xl font-bold">{analytics.rolesCount}</p>
            </div>
          </div>
        )}

        {/* Nested routes */}
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
