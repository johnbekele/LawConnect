import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/EnvConfig.js'; // Adjust the import path as necessary

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(''); // State for custom messages
  const [showMessage, setShowMessage] = useState(false); // State to control message visibility
  const [isSuccessMessage, setIsSuccessMessage] = useState(false); // To style success/error messages

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

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    showCustomMessage(''); // Clear previous messages

    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true } // To handle cookies (JWT authentication)
      );

      if (response.status === 200) {
        showCustomMessage('Login successful! Redirecting...', true);
        setTimeout(() => {
          navigate('/home'); // Redirect to home page on successful login
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Invalid credentials! Please try again.';
      showCustomMessage(errorMessage, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate('/signup'); // Navigate to the sign-up page
  };

  // Renamed and adjusted this function for clarity and consistency.
  // This button is on the branding side, so it should navigate away or provide info.
  const handleLearnMore = () => {
    navigate('/'); // Navigate to the landing page
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-200 font-sans text-gray-800 antialiased overflow-hidden relative">
      {/* Background Decoration (Copied from LandingPage and SignUp) */}
      <div className="fixed inset-0 pointer-events-none z-[-2]">
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

      {/* Custom Message Box (Copied from SignUp) */}
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

      {/* Main Login Container - Split Layout */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col lg:flex-row border border-gray-100">
        {/* Left side - Branding/Image */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-black text-white flex flex-col justify-center items-center text-center relative">
          <div className="mb-8">
            {/* Using the SVG text logo from LandingPage/SignUp for consistency */}
            <svg
              className="h-[50px] w-auto max-w-[200px] object-contain brightness-125 mx-auto mb-4"
              viewBox="0 0 200 50"
              fill="none"
            >
              <rect width="200" height="50" rx="8" fill="#333" />
              <text x="20" y="32" fill="white" fontSize="18" fontWeight="bold">
                LawConnect
              </text>
            </svg>
            <h2 className="text-3xl font-bold mb-4">Welcome to Law Connect</h2>
            <p className="text-lg text-white/80 max-w-sm mx-auto mb-8">
              Effortless legal case management—secure, organized, and built for
              advocates.
            </p>
            <button
              className="h-14 px-10 bg-white text-black border-2 border-black rounded-lg text-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-1 active:scale-95 mx-auto"
              onClick={handleLearnMore}
            >
              Learn More <span className="text-xl">→</span>
            </button>
          </div>
          {/* Removed wave-container for design consistency with other pages */}
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 p-8 md:p-10 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600 text-base">
                Please sign in to your account
              </p>
            </div>

            <form onSubmit={handleSignIn} className="flex flex-col gap-5">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-base"
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password">Password</label>
                  <span
                    onClick={() => navigate('/forget-password')}
                    className="text-sm text-black font-semibold cursor-pointer hover:underline"
                  >
                    Forgot password?
                  </span>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-base"
                />
              </div>

              <button
                type="submit"
                className={`w-full bg-black text-white py-3 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
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
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400">Or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <button
                type="button"
                className="w-full bg-white text-black border-2 border-black py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-200"
                onClick={handleSignUp}
              >
                Create an account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
