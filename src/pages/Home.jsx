import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
  db,
  analytics,
  logAnalyticsEvent,
  getAnalyticsData,
} from "../firebase";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getAnalytics,
  logEvent,
  getUserProperties,
  getPerformance,
} from "firebase/analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userData);
    };

    fetchUsers();
  }, []);

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 lg:flex-row">
      <header className="bg-indigo-800 text-white p-4 flex justify-between items-center lg:hidden">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } lg:block lg:w-64 bg-indigo-800 text-white p-6`}
      >
        <h2 className="text-2xl font-semibold mb-6 hidden lg:block">
          Admin Dashboard
        </h2>
        <nav>
          <a href="#" className="block py-2 px-4 rounded hover:bg-indigo-700">
            Dashboard
          </a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-indigo-700">
            Users
          </a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-indigo-700">
            Settings
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-4 rounded hover:bg-indigo-700"
          >
            Logout
          </button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md p-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Dashboard Overview
          </h1>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4 lg:p-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h3 className="text-lg font-semibold p-4 bg-gray-50">
              Recent Users
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider lg:px-6">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-orange-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm lg:px-6">
                        {user.name != "" ? <>{user.name}</> : "No Name"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm lg:px-6">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm lg:px-6">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
