import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/EnvConfig.js'; // Adjust the import path as necessary

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [secretString, setSecretString] = useState('');
  const [message, setMessage] = useState(''); // State for custom messages
  const [showMessage, setShowMessage] = useState(false); // State to control message visibility
  const [isSuccessMessage, setIsSuccessMessage] = useState(false); // To style success/error messages
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to show custom messages
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowMessage(false); // Clear previous messages immediately

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        secretString,
      });

      console.log('API Response:', response.data); // Debugging response

      if (response.status === 200) {
        showCustomMessage('Verification successful! Redirecting...', true);
        setTimeout(() => {
          navigate('/home'); // Navigate to home
        }, 1500);
      }
    } catch (error) {
      console.error(
        'Error:',
        error.response?.data?.message || 'Error connecting to server'
      );
      const errorMessage =
        error.response?.data?.message || 'Error connecting to server';
      showCustomMessage(errorMessage, false);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleLearnMore = () => {
    navigate('/'); // Navigate to the landing page
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-200 font-sans text-gray-800 antialiased overflow-hidden relative">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute rounded-full bg-gray-600/10 animate-float-1 top-[10%] left-[10%] w-[150px] h-[150px]"></div>
        <div className="absolute rounded-full bg-gray-600/10 animate-float-2 top-[40%] right-[15%] w-[100px] h-[100px]"></div>
        <div className="absolute rounded-full bg-gray-600/10 animate-float-3 bottom-[10%] left-[20%] w-[120px] h-[120px]"></div>
      </div>

      {/* Tailwind Keyframes for Floating Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float-1 { animation: float 6s ease-in-out infinite 0s; }
        .animate-float-2 { animation: float 6s ease-in-out infinite 2s; }
        .animate-float-3 { animation: float 6s ease-in-out infinite 4s; }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
      `}</style>

      {/* Custom Message Box */}
      {showMessage && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-xl z-50 animate-fade-in-down min-w-[300px] text-center
          ${
            isSuccessMessage
              ? 'bg-green-600 text-white border border-green-700'
              : 'bg-red-600 text-white border border-red-700'
          }`}
        >
          {message}
        </div>
      )}

      {/* Main Container - Split Layout */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col lg:flex-row border border-gray-200">
        {/* Left side - Branding/Image */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-gray-900 to-black text-white flex flex-col justify-center items-center text-center relative">
          <div className="mb-8 z-10">
            {/* Logo */}
            <div className="mb-6">
              <svg
                className="h-[60px] w-auto max-w-[250px] mx-auto mb-4"
                viewBox="0 0 250 60"
                fill="none"
              >
                <rect width="250" height="60" rx="10" fill="url(#gradient)" />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
                <text
                  x="25"
                  y="38"
                  fill="white"
                  fontSize="22"
                  fontWeight="bold"
                >
                  LawConnect
                </text>
              </svg>
            </div>

            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Reset Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Password
              </span>
            </h2>

            <p className="text-lg text-gray-300 max-w-sm mx-auto mb-8 leading-relaxed">
              Enter your email and secret key to verify your account and regain
              access.
            </p>

            <button
              className="h-14 px-8 bg-white text-black border-2 border-white rounded-lg text-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-transparent hover:text-white hover:border-white hover:scale-105 active:scale-95 mx-auto shadow-lg"
              onClick={handleLearnMore}
            >
              Learn More
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-20 h-20 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 border border-white/20 rounded-full"></div>
        </div>

        {/* Right side - Forgot Password form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex items-center justify-center bg-gray-50">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Forgot Password?
              </h2>
              <p className="text-gray-600 text-base">
                Enter your email and secret key to verify your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white shadow-sm"
                />
              </div>

              {/* Secret Key Field */}
              <div>
                <label
                  htmlFor="secretString"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Secret Key
                </label>
                <input
                  id="secretString"
                  type="password"
                  required
                  placeholder="Enter your secret key"
                  value={secretString}
                  onChange={(e) => setSecretString(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white shadow-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is the secret key you set during registration
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Verify Account'
                )}
              </button>

              {/* Divider */}
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm font-medium">
                  Or
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Back to Login Button */}
              <button
                type="button"
                className="w-full bg-white text-gray-700 border-2 border-gray-300 py-4 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-[1.02] shadow-sm"
                onClick={handleBackToLogin}
              >
                Back to Login
              </button>
            </form>

            {/* Help Text */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Don't have a secret key?
                <button
                  onClick={() => navigate('/signup')}
                  className="text-blue-600 hover:text-blue-800 font-medium ml-1 hover:underline"
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
