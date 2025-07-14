import { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from './sideBar'; // Assuming SideBar is also styled with Tailwind or its own CSS
import { API_URL } from '../config/EnvConfig.js'; // Adjust the import path as necessary

function Profile() {
  const [advocate, setAdvocate] = useState({
    name: '',
    email: '',
    age: '',
    contact: '',
    casesHandled: 0,
    casesWon: 0,
    profilePic: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(''); // State for custom messages
  const [showMessage, setShowMessage] = useState(false); // State to control message visibility
  const [isSuccessMessage, setIsSuccessMessage] = useState(false); // To style success/error messages

  // Function to show custom messages (copied from LoginPage/SignUp for consistency)
  const showCustomMessage = (msg, isSuccess = false) => {
    setMessage(msg);
    setIsSuccessMessage(isSuccess);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setMessage('');
      setIsSuccessMessage(false);
    }, 4000); // Message disappears after 4 seconds
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
      await fetchCaseStatistics();
    };
    fetchData();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        // Corrected string interpolation
        withCredentials: true,
      });

      console.log('Profile Data from Backend:', response.data);
      setAdvocate((prev) => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error(
        'Error fetching profile:',
        error.response?.data || error.message
      );
      showCustomMessage('Failed to load profile data.', false); // Show error message
    }
  };

  const fetchCaseStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/getcases`, {
        // Corrected string interpolation
        withCredentials: true,
      });
      const cases = response.data;
      const casesHandled = cases.length;
      const casesWon = cases.filter(
        (c) => c.status.toLowerCase() === 'won'
      ).length;

      setAdvocate((prev) => ({
        ...prev,
        casesHandled: casesHandled || prev.casesHandled,
        casesWon: casesWon,
      }));
    } catch (error) {
      console.error('Error fetching case statistics:', error);
      showCustomMessage('Failed to load case statistics.', false); // Show error message
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', advocate.name);
      formData.append('age', advocate.age);
      formData.append('contact', advocate.contact);

      // Only append if profilePic is a File object
      if (advocate.profilePic instanceof File) {
        formData.append('profilePic', advocate.profilePic);
      }

      await axios.put(`${API_URL}/users/updateProfile`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showCustomMessage('Profile updated successfully!', true);
      await fetchProfile();
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showCustomMessage('Failed to update profile.', false);
    }
  };

  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAdvocate((prev) => ({ ...prev, profilePic: file }));
    }
  };

  const calculateSuccessRate = () => {
    if (advocate.casesHandled === 0) return 0;
    return Math.round((advocate.casesWon / advocate.casesHandled) * 100);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans antialiased overflow-hidden">
      <SideBar /> {/* Assuming SideBar has its own styling */}
      {/* Custom Message Box (Copied from SignUp/LoginPage) */}
      {showMessage && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-xl z-50 animate-fade-in-down
          ${
            isSuccessMessage ? 'bg-green-600 text-white' : 'bg-black text-white'
          }`}
        >
          {message}
        </div>
      )}
      {/* Tailwind Keyframes for Fade-in-down animation */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
      `}</style>
      <div
        className={`flex-1 p-8 md:p-12 transition-all duration-300 ${
          editMode ? 'bg-gray-50' : 'bg-white'
        }`}
      >
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900">
              Advocate Profile
            </h2>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                  <path d="m15 5 4 4"></path>
                </svg>
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Changes
              </button>
            )}
          </div>

          <div className="profile-content flex flex-col md:flex-row gap-8">
            {/* Profile Picture Section */}
            <div className="w-full md:w-1/3 flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-inner">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-black mb-4">
                <img
                  src={
                    advocate.profilePic
                      ? `${API_URL}${advocate.profilePic}`
                      : 'https://placehold.co/128x128/e0e0e0/333333?text=Avatar'
                  } // Placeholder
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {editMode && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicUpload}
                      className="hidden" // Tailwind class for hidden input
                    />
                  </label>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {advocate.name || 'Advocate Name'}
              </h3>
              <p className="text-gray-600 text-sm mt-1">{advocate.email}</p>
            </div>

            {/* Personal Information Card */}
            <div className="w-full md:w-2/3 p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div className="detail-item">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={advocate.name}
                      onChange={(e) =>
                        setAdvocate({ ...advocate, name: e.target.value })
                      }
                      placeholder="Enter your name"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-transparent text-base"
                    />
                  ) : (
                    <p className="text-gray-800 text-lg font-medium">
                      {advocate.name || 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="detail-item">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Age
                  </label>
                  {editMode ? (
                    <input
                      type="number"
                      value={advocate.age}
                      onChange={(e) =>
                        setAdvocate({ ...advocate, age: e.target.value })
                      }
                      placeholder="Enter your age"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-transparent text-base"
                    />
                  ) : (
                    <p className="text-gray-800 text-lg font-medium">
                      {advocate.age || 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="detail-item">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Contact
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={advocate.contact}
                      onChange={(e) =>
                        setAdvocate({ ...advocate, contact: e.target.value })
                      }
                      placeholder="Enter your contact number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-transparent text-base"
                    />
                  ) : (
                    <p className="text-gray-800 text-lg font-medium">
                      {advocate.contact || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Case Statistics Card */}
          <div className="profile-card mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Case Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="stat-box bg-blue-50 p-4 rounded-lg">
                <div className="text-4xl font-extrabold text-blue-700">
                  {advocate.casesHandled}
                </div>
                <div className="text-sm text-blue-600 font-medium mt-1">
                  Cases Handled
                </div>
              </div>
              <div className="stat-box bg-green-50 p-4 rounded-lg">
                <div className="text-4xl font-extrabold text-green-700">
                  {advocate.casesWon}
                </div>
                <div className="text-sm text-green-600 font-medium mt-1">
                  Cases Won
                </div>
              </div>
              <div className="stat-box bg-purple-50 p-4 rounded-lg">
                <div className="text-4xl font-extrabold text-purple-700">
                  {calculateSuccessRate()}%
                </div>
                <div className="text-sm text-purple-600 font-medium mt-1">
                  Success Rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
