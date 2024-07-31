import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

export default function Report() {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportedUsers = async () => {
      const q = query(collection(db, "users"), where("reported", "==", true));
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReportedUsers(userData);
    };

    fetchReportedUsers();
  }, []);

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  const handleUserClick = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setSelectedUser(userSnap.data());
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleClearReport = async () => {
    if (selectedUser && selectedUser.uid) {
      try {
        const userRef = doc(db, "users", selectedUser.uid);
        await updateDoc(userRef, {
          reported: false,
          reportReason: [],
        });

        setSelectedUser({ ...selectedUser, reported: false, reportReason: [] });
        setReportedUsers(
          reportedUsers.filter((user) => user.id !== selectedUser.uid)
        );
        closeModal();
      } catch (error) {
        console.error("Error clearing report:", error);
      }
    }
  };

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3">
      <div className="text-indigo-500 dark:text-indigo-400">{icon}</div>
      <div>
        <span className="font-medium text-gray-600 dark:text-gray-400">
          {label}:
        </span>{" "}
        <span className="text-gray-800 dark:text-gray-200">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 lg:flex-row">
      <motion.header
        className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center lg:hidden z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <h1 className="text-xl font-semibold">Reported Users</h1>
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
      </motion.header>

      {/* Sidebar */}
      <motion.div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } lg:block lg:w-64 bg-white shadow-lg`}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-600">
            Admin Dashboard
          </h2>
          <nav className="space-y-2">
            <motion.a
              href="#"
              className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
            >
              All Users
            </motion.a>
            <motion.a
              href="#"
              className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/agents")}
            >
              ALL Agents
            </motion.a>
            <motion.a
              href="#"
              className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Settings
            </motion.a>
            <motion.button
              onClick={handleLogout}
              className="w-full text-left py-2 px-4 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-16 lg:pt-0">
        <motion.header
          className="bg-white shadow-md p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-semibold text-gray-800">
            Reported Users
          </h1>
        </motion.header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 lg:p-6">
          <motion.div
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              Reported Users List
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Name", "Email", "Reason for Report"].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportedUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      className="hover:bg-indigo-50 cursor-pointer transition-colors duration-150"
                      onClick={() => handleUserClick(user.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name || "No Name"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.reportReason && user.reportReason.length > 0
                          ? user.reportReason.join(", ")
                          : "Not specified"}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>

      {isModalOpen && selectedUser && (
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-white focus:outline-none"
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
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h3 className="text-3xl font-bold text-white">
                    {selectedUser.name}'s Profile (Reported)
                  </h3>
                </motion.div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
              </div>

              <div className="px-8 py-6 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                      Personal Information
                    </h4>
                    <InfoItem
                      icon={<FaUser />}
                      label="Age"
                      value={selectedUser.age}
                    />
                    <InfoItem
                      icon={<FaUser />}
                      label="Sex"
                      value={selectedUser.sex}
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                      Contact Details
                    </h4>
                    <InfoItem
                      icon={<FaEnvelope />}
                      label="Email"
                      value={selectedUser.email}
                    />
                    <InfoItem
                      icon={<FaPhone />}
                      label="Phone"
                      value={selectedUser.number}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="space-y-4"
                >
                  <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    Report Information
                  </h4>
                  <InfoItem
                    icon={<FaUser />}
                    label="Reason for Report"
                    value={
                      selectedUser.reportReason &&
                      selectedUser.reportReason.length > 0
                        ? selectedUser.reportReason.join(", ")
                        : "Not specified"
                    }
                  />
                </motion.div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 px-8 py-6 space-y-6 flex justify-center text-center items-center ">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Admin Actions
                  </h4>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearReport}
                    className="px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 bg-green-500 hover:bg-green-600"
                  >
                    Clear Report
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
