import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/EnvConfig.js';

function SignUp() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [secretString, setSecretString] = useState('');
  const [age, setAge] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

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
    }, 4000);
  };

  // Send OTP to user's email
  const handleEmailSubmit = async () => {
    if (!name || !email || !age) {
      showCustomMessage('Please fill in all fields before sending OTP', false);
      return;
    }

    setOtpLoading(true);
    try {
      await axios.post(`${API_URL}/auth/advocate`, {
        name,
        email,
        age,
      });

      setOtpSent(true);
      showCustomMessage('OTP sent to your email successfully!', true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to send OTP. Please try again.';
      showCustomMessage(errorMessage, false);
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleOtpSubmit = async () => {
    if (!otp) {
      showCustomMessage('Please enter the OTP', false);
      return;
    }

    setVerifyLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/verifyotp`, {
        name,
        email,
        age,
        otp,
      });
      if (response.status === 200) {
        setOtpVerified(true);
        showCustomMessage(
          'OTP verified successfully! You can now create your password.',
          true
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Invalid OTP. Please try again.';
      showCustomMessage(errorMessage, false);
      console.error('OTP Verification error:', error);
    } finally {
      setVerifyLoading(false);
    }
  };

  // Register the user in the database
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      showCustomMessage('Please verify OTP first.', false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        age,
        secretString,
      });

      if (response.status === 200) {
        showCustomMessage(
          'Registration successful! Redirecting to login...',
          true
        );
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Registration failed. User may already exist.';
      showCustomMessage(errorMessage, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleLearnMore = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-200 font-sans text-gray-800 antialiased overflow-hidden relative">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute rounded-full bg-gray-600/10 animate-float-1 top-[10%] left-[10%] w-[150px] h-[150px]"></div>
        <div className="absolute rounded-full bg-gray-600/10 animate-float-2 top-[40%] right-[15%] w-[100px] h-[100px]"></div>
        <div className="absolute rounded-full bg-gray-600/10 animate-float-3 bottom-[10%] left-[20%] w-[120px] h-[120px]"></div>
      </div>

      {/* Animations */}
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

      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col lg:flex-row border border-gray-200">
        {/* Left side - Branding */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-gray-900 to-black text-white flex flex-col justify-center items-center text-center relative">
          <div className="mb-8 z-10">
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
              Join the
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Legal Network
              </span>
            </h2>

            <p className="text-lg text-gray-300 max-w-sm mx-auto mb-8 leading-relaxed">
              Professional registration for advocates. Secure, verified, and
              built for legal professionals.
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

          <div className="absolute top-10 right-10 w-20 h-20 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 border border-white/20 rounded-full"></div>
        </div>

        {/* Right side - Registration form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 bg-gray-50 overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Advocate Registration
              </h2>
              <p className="text-gray-600 text-base">
                Create your professional account
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div>
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
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white shadow-sm"
                  />
                </div>

                <div>
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
                    max="100"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white shadow-sm"
                  />
                </div>

                <div>
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
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white shadow-sm"
                  />

                  {!otpSent && (
                    <button
                      type="button"
                      className={`mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                        otpLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      onClick={handleEmailSubmit}
                      disabled={otpLoading}
                    >
                      {otpLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white mr-3 inline"
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
                          Sending OTP...
                        </>
                      ) : (
                        'Send Verification Code'
                      )}
                    </button>
                  )}

                  {otpSent && !otpVerified && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        ✓ Verification code sent to your email
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* OTP Verification Section */}
              {otpSent && !otpVerified && (
                <div className="space-y-4 border-t pt-6">
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Verification Code
                    </label>
                    <input
                      id="otp"
                      type="text"
                      required
                      placeholder="Enter 6-digit code"
                      maxLength="6"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ''))
                      }
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white shadow-sm text-center text-lg tracking-widest"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Check your email for the 6-digit verification code
                    </p>
                  </div>

                  <button
                    type="button"
                    className={`w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 hover:from-green-700 hover:to-green-800 hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      verifyLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    onClick={handleOtpSubmit}
                    disabled={verifyLoading}
                  >
                    {verifyLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white mr-3 inline"
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
                      'Verify Code'
                    )}
                  </button>
                </div>
              )}

              {/* Password Section */}
              {otpVerified && (
                <div className="space-y-4 border-t pt-6">
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Email verified successfully! Complete your registration
                      below.
                    </p>
                  </div>

                  <div>
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
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white shadow-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="secretPhrase"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Secret Recovery Phrase
                    </label>
                    <input
                      id="secretPhrase"
                      type="password"
                      required
                      placeholder="Enter your secret recovery phrase"
                      value={secretString}
                      onChange={(e) => setSecretString(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base bg-white shadow-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will be used for password recovery. Keep it secure!
                    </p>
                  </div>

                  <button
                    type="submit"
                    className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg font-semibold transition-all duration-200 hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white mr-3 inline"
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
                        Creating Account...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                </div>
              )}

              {/* Sign In Link */}
              <div className="text-center pt-6 border-t">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
