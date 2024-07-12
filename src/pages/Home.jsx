import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, listAll } from "firebase/storage";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPhotos, setUserPhotos] = useState([]);
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

  const handleUserClick = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setSelectedUser(userSnap.data());
      fetchUserPhotos(userId);
      setIsModalOpen(true);
    }
  };

  const fetchUserPhotos = async (userId) => {
    const photosRef = ref(storage, `users/${userId}/photos`);
    const photosList = await listAll(photosRef);
    const photoUrls = await Promise.all(
      photosList.items.map((item) => getDownloadURL(item))
    );
    setUserPhotos(photoUrls);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setUserPhotos([]);
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
        } lg:block lg:w-64 bg-gradient-to-br from-indigo-100 to-[#F39C3E] text-white p-6`}
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
                    <tr
                      key={user.id}
                      className="hover:bg-orange-50"
                      onClick={() => handleUserClick(user.id)}
                    >
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

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
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
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <h3 className="text-2xl font-bold text-white">
                {selectedUser.name}'s Profile
              </h3>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    Personal Information
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium text-gray-600">Age:</span>{" "}
                      {selectedUser.age}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Sex:</span>{" "}
                      {selectedUser.sex}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">
                        Date of Birth:
                      </span>{" "}
                      {selectedUser.dateOfBirth}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">
                        Mother Tongue:
                      </span>{" "}
                      {selectedUser.motherTongue}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">
                        Religion:
                      </span>{" "}
                      {selectedUser.religion}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    Contact Details
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium text-gray-600">Email:</span>{" "}
                      {selectedUser.email}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Phone:</span>{" "}
                      {selectedUser.number}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">
                        Address:
                      </span>{" "}
                      {selectedUser.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Professional Information
                </h4>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium text-gray-600">
                      Profession:
                    </span>{" "}
                    {selectedUser.profession}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">
                      Employment Status:
                    </span>{" "}
                    {selectedUser.employmentStatus}
                  </p>
                  <p>
                    <span className="font-medium text-gray-600">Salary:</span>{" "}
                    {selectedUser.salary}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Description
                </h4>
                <p className="text-gray-600">{selectedUser.description}</p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                Photos
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {userPhotos.map((photoUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photoUrl}
                      alt={`User photo ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg shadow-md transition duration-300 ease-in-out transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out rounded-lg flex items-center justify-center">
                      <button className="text-white bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded">
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
