import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LandingPage() {
  const navigate = useNavigate();
  // Ensure REACT_APP_API_URL is correctly defined in your .env file
  // and accessible via import.meta.env for Vite or process.env for Create React App
  const API = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:3001';

  const [isScrolled, setIsScrolled] = useState(false);
  const [feedbackForm, showFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ email: '', feedback: '' });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => navigate('/login');
  const handleSignUp = () => navigate('/signup'); // Corrected to "/signup" as per typical routing

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({ ...feedbackData, [name]: value });
  };

  const handleFeedback = () => showFeedbackForm(true);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/feedback`, feedbackData);
      alert('Feedback submitted successfully');
      setFeedbackData({ email: '', feedback: '' });
      showFeedbackForm(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    }
  };

  const handleButtonClick = (e) => {
    const button = e.currentTarget;
    button.classList.add('scale-95'); // Tailwind class for scale animation
    setTimeout(() => {
      button.classList.remove('scale-95');
    }, 200);
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 antialiased overflow-x-hidden">
      {/* Background Decoration */}
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

      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 py-4 transition-all duration-300 bg-white/95 backdrop-blur-md 
        ${isScrolled ? 'shadow-lg py-3' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between flex-wrap">
          <div className="flex items-center">
            <div className="flex items-center justify-center">
              <svg
                className="h-[45px] w-auto max-w-[180px] object-contain transition-transform duration-300 hover:scale-105"
                viewBox="0 0 200 50"
                fill="none"
              >
                <rect width="200" height="50" rx="8" fill="#000" />
                <text
                  x="20"
                  y="32"
                  fill="white"
                  fontSize="18"
                  fontWeight="bold"
                >
                  LawConnect
                </text>
              </svg>
            </div>
          </div>

          <nav className="flex gap-8 mt-4 md:mt-0">
            <a
              href="#features"
              className="text-base text-gray-600 hover:text-black font-medium transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#feedback"
              onClick={handleFeedback}
              className="text-base text-gray-600 hover:text-black font-medium transition-colors duration-200"
            >
              Feedback
            </a>
          </nav>

          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              className="h-10 px-6 bg-black text-white rounded-md text-base font-medium flex items-center justify-center transition-all duration-200 hover:bg-gray-700 hover:-translate-y-0.5"
              onClick={handleGetStarted}
            >
              Log In
            </button>
            <button
              className="h-10 px-6 bg-white text-black border-2 border-black rounded-md text-base font-medium flex items-center justify-center transition-all duration-200 hover:bg-black hover:text-white hover:-translate-y-0.5"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-20 bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
            <div className="flex-1">
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-800">
                Effortless Legal Case Management
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
                Secure, organized, and built specifically for advocates.
                Streamline your practice with LawConnect.
              </p>
              <div className="flex justify-center md:justify-start gap-4 flex-wrap">
                <button
                  className="h-14 px-10 bg-black text-white rounded-lg text-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:bg-gray-700 hover:-translate-y-1 hover:shadow-xl active:scale-95"
                  onClick={(e) => {
                    handleButtonClick(e);
                    handleGetStarted();
                  }}
                >
                  Get Started{' '}
                  <span className="text-xl transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 relative mt-16 md:mt-0">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Legal gavel and documents"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/10"></div>
              </div>

              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white p-5 rounded-xl shadow-xl flex items-center gap-4 backdrop-blur-lg">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-600 font-medium">
                    Trusted by
                  </p>
                  <p className="text-base text-black font-semibold">
                    Legal professionals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-black">
              Powerful Features for Legal Professionals
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to manage cases, clients, and your practice in
              one secure platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Case Management',
                desc: 'Organize and track all your legal cases with intelligent workflows and automated reminders.',
              },
              {
                title: 'Fees Management',
                desc: 'Streamline billing, track payments, and generate professional invoices effortlessly.',
              },
              {
                title: 'Client Portal',
                desc: 'Provide clients secure access to their case information and documents 24/7.',
              },
              {
                title: 'Calendar & Deadlines',
                desc: 'Never miss important dates with integrated calendar and deadline tracking systems.',
              },
            ].map((feature, index) => (
              <div
                className="bg-white p-10 rounded-2xl shadow-md transition-all duration-300 border border-gray-100 hover:translate-y-[-8px] hover:shadow-xl hover:border-gray-200"
                key={index}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-xl flex items-center justify-center mb-6">
                  <div className="w-7 h-7 bg-white rounded"></div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-black">
                  {feature.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="max-w-7xl mx-auto px-5">
          <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl p-16 flex flex-col lg:flex-row gap-12 items-center shadow-2xl">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-4">
                Ready to transform your legal practice?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0">
                Join thousands of legal professionals who trust LawConnect for
                their case management needs.
              </p>
              <div className="flex justify-center lg:justify-start gap-4 flex-wrap">
                <button
                  className="h-14 px-10 bg-white text-black border-2 border-black rounded-lg text-lg font-semibold flex items-center justify-center transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-1 active:scale-95"
                  onClick={(e) => {
                    handleButtonClick(e);
                    handleGetStarted();
                  }}
                >
                  Get Started Today
                </button>
              </div>
            </div>
            <div className="flex-1 h-72 lg:h-96 w-full lg:w-auto border-4 border-white/20 rounded-2xl overflow-hidden mt-10 lg:mt-0">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="LawConnect dashboard preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      {feedbackForm && (
        <section id="feedback" className="py-20 bg-gray-50">
          <div className="bg-white shadow-xl rounded-2xl p-12 max-w-xl mx-auto px-5">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 text-black">
                Share Your Feedback
              </h2>
              <p className="text-base text-gray-600">
                Help us improve by sharing your thoughts. Your opinion matters
                to us!
              </p>
            </div>
            <form
              className="flex flex-col gap-5"
              onSubmit={handleFeedbackSubmit}
            >
              <label
                htmlFor="email"
                className="font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                placeholder="Enter your email address"
                type="email"
                value={feedbackData.email}
                name="email"
                onChange={handleInputChange}
                required
                className="p-3 border-2 border-gray-200 rounded-lg text-base transition-colors duration-200 focus:outline-none focus:border-black"
              />

              <label
                htmlFor="feedback"
                className="font-semibold text-gray-700 mb-2"
              >
                Your Feedback
              </label>
              <textarea
                id="feedback"
                placeholder="Share your thoughts, suggestions, or concerns..."
                value={feedbackData.feedback}
                name="feedback"
                rows="6"
                onChange={handleInputChange}
                required
                className="p-3 border-2 border-gray-200 rounded-lg text-base resize-y min-h-[120px] transition-colors duration-200 focus:outline-none focus:border-black"
              />

              <div className="flex gap-4 justify-center mt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-lg text-base font-semibold transition-all duration-200 hover:bg-gray-700 hover:-translate-y-0.5 min-w-[100px]"
                >
                  Send Feedback
                </button>
                <button
                  type="button"
                  className="px-6 py-3 bg-white text-black border-2 border-black rounded-lg text-base font-semibold transition-all duration-200 hover:bg-gray-100 hover:-translate-y-0.5 min-w-[100px]"
                  onClick={() => showFeedbackForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-0 justify-between items-center text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-5">
            <div className="flex items-center">
              <svg
                className="h-[50px] w-auto max-w-[200px] object-contain brightness-125"
                viewBox="0 0 200 50"
                fill="none"
              >
                <rect width="200" height="50" rx="8" fill="#333" />
                <text
                  x="20"
                  y="32"
                  fill="white"
                  fontSize="18"
                  fontWeight="bold"
                >
                  LawConnect
                </text>
              </svg>
            </div>
            <p className="text-base text-white/80 max-w-md leading-relaxed">
              Effortless legal case management—secure, organized, and built for
              advocates.
            </p>
          </div>

          <div className="text-base text-white/80">
            <p>Developed by Maanya Gupta & Devyani Sharma</p>
          </div>
        </div>
        <div className="text-sm text-white/60 text-center pt-8 mt-10 border-t border-white/20">
          © {new Date().getFullYear()} LawConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
