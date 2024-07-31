import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaUsers } from "react-icons/fa";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [associatedUsers, setAssociatedUsers] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "agents"));
      const agentData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAgents(agentData);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const handleAgentClick = async (agent) => {
    setSelectedAgent(agent);
    try {
      const usersQuery = query(
        collection(db, "users"),
        where("agentRefCode", "==", agent.referenceCode)
      );
      const querySnapshot = await getDocs(usersQuery);
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssociatedUsers(userData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching associated users:", error);
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
    setAssociatedUsers([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 lg:flex-row">
      <motion.header
        className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center lg:hidden z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <h1 className="text-xl font-semibold">Agents</h1>
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
              onClick={() => navigate("/reportedusers")}
            >
              Reported Users
            </motion.a>
            <motion.a
              href="#"
              className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/settings")}
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
            Agents Overview
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
              All Agents
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Name", "Email", "Reference Code", "Actions"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agents.map((agent, index) => (
                    <motion.tr
                      key={agent.id}
                      className="hover:bg-indigo-50 cursor-pointer transition-colors duration-150"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {agent.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agent.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agent.referenceCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAgentClick(agent)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Users
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Modal for Associated Users */}
      {isModalOpen && selectedAgent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">
              Users for Agent: {selectedAgent.name}
            </h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {associatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name ? <>{user.name}</> : "No Name"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={closeModal}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
