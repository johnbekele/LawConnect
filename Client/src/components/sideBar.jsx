import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/EnvConfig.js';

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ email: '', profilePic: '' });

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile();
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
      setUser({
        email: response.data.email,
        profilePic: response.data.profilePic,
      });
    } catch (error) {
      console.error(
        'Error fetching profile:',
        error.response?.data || error.message
      );
    }
  };

  // Helper function to check if current route is active
  const isActive = (path) => location.pathname === path;

  const handleHome = () => {
    console.log('Home clicked');
    navigate('/home');
  };

  const handleMyCases = () => {
    console.log('My Cases clicked');
    navigate('/myCases');
  };

  const handleClients = () => {
    console.log('Clients clicked');
    navigate('/clients');
  };

  const handleFees = () => {
    console.log('Fees clicked');
    navigate('/fees');
  };

  const handleProfile = () => {
    console.log('Profile clicked');
    navigate('/profile');
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // Add any logout logic here (clear tokens, etc.)
    navigate('/');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/home',
      onClick: handleHome,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'My Cases',
      path: '/myCases',
      onClick: handleMyCases,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      name: 'Clients',
      path: '/clients',
      onClick: handleClients,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
    {
      name: 'Fees & Billing',
      path: '/fees',
      onClick: handleFees,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      name: 'Profile',
      path: '/profile',
      onClick: handleProfile,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="h-screen w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-xl font-bold text-gray-900 text-center">
          LawConnect
        </h1>
        <p className="text-xs text-gray-500 text-center mt-1">
          Legal Case Management
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left group ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:transform hover:scale-105'
              }`}
            >
              <span
                className={`transition-transform duration-200 ${
                  isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'
                }`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-semibold">{item.name}</span>
              {isActive(item.path) && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <img
                src={
                  user.profilePic
                    ? `${API_URL}${user.profilePic}`
                    : 'https://placehold.co/128x128/e0e0e0/333333?text=Avatar'
                }
                alt=""
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Legal Professional
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left group bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 hover:transform hover:scale-105 border border-red-200"
        >
          <span className="transition-transform duration-200 group-hover:scale-110">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </span>
          <span className="text-sm font-semibold">Log Out</span>
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">© 2025 LawConnect</p>
      </div>
    </div>
  );
}

export default SideBar;
