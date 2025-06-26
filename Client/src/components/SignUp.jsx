import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Assuming API_URL is correctly configured in your environment or a config file
// For Vite, it's import.meta.env.VITE_API_URL
// For Create React App, it's process.env.REACT_APP_API_URL
const API_URL =
  import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';

function SignUp() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [secretString, setSecretString] = useState('');
  const [age, setAge] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState(''); // State for custom messages
  const [showMessage, setShowMessage] = useState(false); // State to control message visibility

  const navigate = useNavigate();

  // Function to show custom messages
  const showCustomMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    // Optional: Hide message after a few seconds
    setTimeout(() => {
      setShowMessage(false);
      setMessage('');
    }, 4000);
  };

  // Send OTP to user's email
  const handleEmailSubmit = async () => {
    try {
      await axios.post(`${API_URL}/auth/advocate`, {
        name,
        email,
        age,
      });

      setOtpSent(true);
      showCustomMessage('OTP sent to your email!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      showCustomMessage('Failed to send OTP. Try again.');
    }
  };

  // Verify OTP
  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/verifyotp`, {
        name,
        email,
        age,
        otp,
      });
      if (response.status === 200) {
        setOtpVerified(true);
        showCustomMessage('OTP Verified! You can now create a password.');
      }
    } catch (error) {
      showCustomMessage('Invalid OTP. Try again.');
      console.error('OTP Verification error:', error);
      // Removed window.location.reload() for better UX, let user correct OTP
    }
  };

  // Register the user in the database
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      showCustomMessage('Please verify OTP first.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        age,
        secretString,
      });

      if (response.status === 200) {
        showCustomMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000); // Redirect after a short delay
      }
    } catch (error) {
      console.error('Error during registration:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Signup failed. User may already exist.';
      showCustomMessage(errorMessage);
    }
  };

  const handleClick = () => {
    navigate('/login'); // Changed to /login for clarity since it's "Sign In"
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-200 font-sans text-gray-800 antialiased overflow-hidden relative">
      {/* Background Decoration (Copied from LandingPage) */}
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
      `}</style>

      {/* Custom Message Box */}
      {showMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-black text-white p-4 rounded-lg shadow-xl z-50 animate-fade-in-down">
          {message}
        </div>
      )}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.5s ease-out forwards;
        }
      `}</style>

      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-2xl z-10 border border-gray-100 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Advocate Registration
        </h2>
        <p className="text-base text-gray-600 text-center mb-6">
          Legal Professional Portal
        </p>
        <div className="flex justify-center mb-8">
          {/* Simple legal scale icon using SVG or a placeholder div for now */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2zM9 12c0 1.105-1.343 2-3 2H4c-1.657 0-3-.895-3-2s1.343-2 3-2h2c1.657 0 3 .895 3 2zM15 12c0 1.105 1.343 2 3 2h2c1.657 0 3-.895 3-2s-1.343-2-3-2h-2c-1.657 0-3 .895-3 2z"
            />
          </svg>
        </div>

        <form onSubmit={handleSignUp}>
          {' '}
          {/* Changed to onSubmit for form submission */}
          <div className="mb-6">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              placeholder="Enter your legal name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-base"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Age
            </label>
            <input
              id="age"
              type="number"
              required
              placeholder="Enter your age"
              min="18"
              step="1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-base"
            />
          </div>
          <div className="mb-6 relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Professional Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-base"
            />
            <button
              type="button"
              className="mt-4 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleEmailSubmit}
              disabled={otpSent}
            >
              {otpSent ? 'Verification Code Sent' : 'Send Verification Code'}
            </button>
          </div>
          {otpSent && !otpVerified && (
            <div className="mb-6 relative">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verification Code
              </label>
              <input
                id="otp"
                type="number"
                required
                placeholder="Enter the code sent to your email"
                min="100000"
                max="999999"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-base"
              />
              <button
                type="button"
                className="mt-4 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200"
                onClick={handleOtpSubmit}
              >
                Verify Code
              </button>
            </div>
          )}
          {otpVerified && (
            <div className="form-section">
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Create Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-base"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="secretPhrase"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Secret Phrase
                </label>
                <input
                  id="secretPhrase"
                  type="password"
                  required
                  placeholder="Enter your secret recovery phrase"
                  value={secretString}
                  onChange={(e) => setSecretString(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-base"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200"
              >
                Complete Registration
              </button>
            </div>
          )}
          <div className="text-center mt-6 text-gray-600 text-sm">
            Already registered?{' '}
            <span
              onClick={handleClick}
              className="text-black font-semibold cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
