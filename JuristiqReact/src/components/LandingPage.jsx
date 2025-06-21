import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LandingPage() {
  const navigate = useNavigate();
  const API = import.meta.env.REACT_APP_API_URL;

  const [isScrolled, setIsScrolled] = useState(false);
  const [feedbackForm, showFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ email: "", feedback: "" });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => navigate("/login");
  const handleSignUp = () => navigate("/signUp");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({ ...feedbackData, [name]: value });
  };

  const handleFeedback = () => showFeedbackForm(true);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/feedback`, feedbackData);
      alert("Feedback submitted successfully");
      setFeedbackData({ email: "", feedback: "" });
      showFeedbackForm(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback");
    }
  };

  const handleButtonClick = (e) => {
    const button = e.currentTarget;
    button.classList.add("clicked");
    setTimeout(() => {
      button.classList.remove("clicked");
    }, 200);
  };


  return (
    <div className="landing-page-container">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        button {
          cursor: pointer;
          font-family: inherit;
          border: none;
          outline: none;
        }

      


        .decoration-circle:nth-child(1) {
          top: 10%;
          left: 10%;
          width: 150px;
          height: 150px;
          animation-delay: 0s;
        }

        .decoration-circle:nth-child(2) {
          top: 40%;
          right: 15%;
          width: 100px;
          height: 100px;
          animation-delay: 2s;
        }

        .decoration-circle:nth-child(3) {
          bottom: 10%;
          left: 20%;
          width: 120px;
          height: 120px;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .landing-page-container {
          width: 100%;
          overflow-x: hidden;
        }

        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
          padding: 16px 0;
          transition: all 0.3s ease;
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }

        .site-header.scrolled {
          background-color: rgba(255, 255, 255, 0.98);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
          padding: 12px 0;
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .logo-container {
          display: flex;
          align-items: center;
        }

        .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .main-logo {
          height: 45px;
          width: auto;
          max-width: 180px;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .main-logo:hover {
          transform: scale(1.05);
        }

        .main-navigation {
          display: flex;
          gap: 32px;
        }

        .main-navigation a {
          font-size: 16px;
          color: #666;
          transition: color 0.2s;
          font-weight: 500;
        }

        .main-navigation a:hover {
          color: #000;
        }

        .header-actions {
          display: flex;
          gap: 16px;
        }

        .landing-login-button, .signup-button {
          height: 40px;
          padding: 0 24px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .landing-login-button {
          background-color: #000;
          color: #fff;
        }

        .landing-login-button:hover {
          background-color: #333;
          transform: translateY(-2px);
        }

        .signup-button {
          background-color: #fff;
          color: #000;
          border: 2px solid #000;
        }

        .signup-button:hover {
          background-color: #000;
          color: #fff;
          transform: translateY(-2px);
        }

        .hero-section {
          padding: 140px 0 80px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .hero-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .hero-text {
          flex: 1;
          text-align: center;
        }

        .hero-text h1 {
          font-size: 48px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #000 0%, #333 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-text p {
          font-size: 20px;
          color: #666;
          margin-bottom: 32px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .cta-button {
          height: 56px;
          padding: 0 40px;
          background-color: #000;
          color: #fff;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .cta-button:hover {
          background-color: #333;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .cta-button.clicked {
          transform: scale(0.95);
        }

        .cta-button.white {
          background-color: #fff;
          color: #000;
          border: 2px solid #000;
        }

        .cta-button.white:hover {
          background-color: #000;
          color: #fff;
        }

        .arrow-icon {
          font-size: 20px;
          transition: transform 0.2s;
        }

        .cta-button:hover .arrow-icon {
          transform: translateX(4px);
        }

        .hero-image-container {
          flex: 1;
          position: relative;
          margin-top: 60px;
        }

        .hero-image {
          position: relative;
          height: 400px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          margin: 0 auto;
          max-width: 600px;
        }

        .hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
        }

        .stats-card {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 16px;
          backdrop-filter: blur(10px);
        }

        .stats-icon {
          width: 48px;
          height: 48px;
          background-color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-circle {
          width: 24px;
          height: 24px;
          background-color: #fff;
          border-radius: 50%;
        }

        .stats-text {
          display: flex;
          flex-direction: column;
        }

        .stats-label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .stats-description {
          font-size: 16px;
          color: #000;
          font-weight: 600;
        }

        .features-section {
          padding: 100px 0;
          background-color: #fff;
        }

        .section-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 64px;
        }

        .section-header h2 {
          font-size: 40px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #000;
        }

        .section-header p {
          font-size: 18px;
          color: #666;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .feature-card {
          background-color: #fff;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border-color: #e0e0e0;
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #000 0%, #333 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .icon-placeholder {
          width: 28px;
          height: 28px;
          background-color: #fff;
          border-radius: 4px;
        }

        .feature-card h3 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #000;
        }

        .feature-card p {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
        }

        .cta-section {
          padding: 100px 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .cta-container {
          background: linear-gradient(135deg, #000 0%, #333 100%);
          color: #fff;
          border-radius: 20px;
          padding: 60px;
          display: flex;
          flex-direction: column;
          gap: 48px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
        }

        .cta-content {
          flex: 1;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .cta-content p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 32px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .cta-image {
          flex: 1;
          height: 300px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          overflow: hidden;
          margin-top: 40px;
        }

        .cta-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .feedback-section {
          padding: 80px 0;
          background-color: #f8f9fa;
        }

        .feedback-container {
          background-color: #fff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border-radius: 20px;
          padding: 48px;
          max-width: 600px;
          margin: 0 auto;
        }

        .feedback-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .feedback-header h2 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #000;
        }

        .feedback-header p {
          color: #666;
          font-size: 16px;
        }

        .feedback-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .feedback-form label {
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .feedback-form input,
        .feedback-form textarea {
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
          font-family: inherit;
        }

        .feedback-form input:focus,
        .feedback-form textarea:focus {
          outline: none;
          border-color: #000;
        }

        .feedback-form textarea {
          resize: vertical;
          min-height: 120px;
        }

        .button-container {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 16px;
        }

        .submit-button {
          padding: 12px 24px;
          background-color: #000;
          color: #fff;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.2s;
          min-width: 100px;
        }

        .submit-button:hover {
          background-color: #333;
          transform: translateY(-2px);
        }

        .submit-button:nth-child(2) {
          background-color: #fff;
          color: #000;
          border: 2px solid #000;
        }

        .submit-button:nth-child(2):hover {
          background-color: #f0f0f0;
        }

        .footer-section {
          background-color: #000;
          color: #fff;
          padding: 60px 20px 30px;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 40px;
          text-align: center;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .footer-logo-container {
          display: flex;
          align-items: center;
        }

        .footer-logo-img {
          height: 50px;
          width: auto;
          max-width: 200px;
          object-fit: contain;
          filter: brightness(1.2);
        }

        .footer-text {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.8);
          max-width: 500px;
          line-height: 1.6;
        }

        .footer-copyright {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .footer-links {
          display: flex;
          justify-content: center;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            gap: 16px;
            padding: 0 16px;
          }

          .main-navigation {
            gap: 20px;
          }

          .header-actions {
            gap: 12px;
          }

          .main-logo {
            height: 40px;
            max-width: 150px;
          }

          .hero-text h1 {
            font-size: 36px;
          }

          .hero-text p {
            font-size: 18px;
          }

          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-button {
            width: 100%;
            max-width: 300px;
          }

          .section-header h2 {
            font-size: 32px;
          }

          .cta-container {
            padding: 40px 20px;
          }

          .cta-content h2 {
            font-size: 28px;
          }

          .stats-card {
            position: static;
            transform: none;
            margin-top: 20px;
          }

          .hero-content {
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding: 120px 0 60px;
          }

          .hero-text h1 {
            font-size: 28px;
          }

          .hero-text p {
            font-size: 16px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .feature-card {
            padding: 30px 20px;
          }

          .feedback-container {
            padding: 30px 20px;
            margin: 0 16px;
          }

          .button-container {
            flex-direction: column;
          }

          .submit-button {
            width: 100%;
          }
        }

        @media (min-width: 768px) {
          .hero-content {
            flex-direction: row;
            align-items: center;
            text-align: left;
          }

          .hero-buttons {
            justify-content: flex-start;
          }

          .cta-container {
            flex-direction: row;
            align-items: center;
          }

          .cta-content {
            text-align: left;
          }

          .cta-buttons {
            justify-content: flex-start;
          }

          .footer-container {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            text-align: left;
          }

          .footer-brand {
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="background-decoration">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
      </div>

      <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          <div className="logo-container">
            <div className="logo-icon">
              <svg className="main-logo" viewBox="0 0 200 50" fill="none">
                <rect width="200" height="50" rx="8" fill="#000"/>
                <text x="20" y="32" fill="white" fontSize="18" fontWeight="bold">LawConnect</text>
              </svg>
            </div>
          </div>

          <nav className="main-navigation">
            <a href="#features">Features</a>
            <a href="#feedback" onClick={handleFeedback}>Feedback</a>
          </nav>

          <div className="header-actions">
            <button className="landing-login-button" onClick={handleGetStarted}>
              Log In
            </button>
            <button className="signup-button" onClick={handleSignUp}>
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Effortless Legal Case Management</h1>
              <p>Secure, organized, and built specifically for advocates. Streamline your practice with LawConnect.</p>
              <div className="hero-buttons">
                <button 
                  className="cta-button" 
                  onClick={(e) => { handleButtonClick(e); handleGetStarted(); }}
                >
                  Get Started <span className="arrow-icon">→</span>
                </button>
              </div>
            </div>

            <div className="hero-image-container">
              <div className="hero-image">
                <img 
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Legal gavel and documents" 
                />
                <div className="image-overlay"></div>
              </div>

              <div className="stats-card">
                <div className="stats-icon">
                  <div className="icon-circle"></div>
                </div>
                <div className="stats-text">
                  <p className="stats-label">Trusted by</p>
                  <p className="stats-description">Legal professionals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Powerful Features for Legal Professionals</h2>
            <p>Everything you need to manage cases, clients, and your practice in one secure platform.</p>
          </div>

          <div className="features-grid">
            {[
              { title: "Case Management", desc: "Organize and track all your legal cases with intelligent workflows and automated reminders." },
              { title: "Fees Management", desc: "Streamline billing, track payments, and generate professional invoices effortlessly." },
              { title: "Client Portal", desc: "Provide clients secure access to their case information and documents 24/7." },
              { title: "Calendar & Deadlines", desc: "Never miss important dates with integrated calendar and deadline tracking systems." }
            ].map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">
                  <div className="icon-placeholder"></div>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="section-container">
          <div className="cta-container">
            <div className="cta-content">
              <h2>Ready to transform your legal practice?</h2>
              <p>Join thousands of legal professionals who trust LawConnect for their case management needs.</p>
              <div className="cta-buttons">
                <button 
                  className="cta-button white" 
                  onClick={(e) => { handleButtonClick(e); handleGetStarted(); }}
                >
                  Get Started Today
                </button>
              </div>
            </div>
            <div className="cta-image">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="LawConnect dashboard preview" 
              />
            </div>
          </div>
        </div>
      </section>

      {feedbackForm && (
        <section id="feedback" className="feedback-section">
          <div className="feedback-container">
            <div className="feedback-header">
              <h2>Share Your Feedback</h2>
              <p>Help us improve by sharing your thoughts. Your opinion matters to us!</p>
            </div>
            <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
              <label htmlFor="email">Email Address</label>
              <input 
                id="email"
                placeholder="Enter your email address" 
                type="email" 
                value={feedbackData.email} 
                name="email" 
                onChange={handleInputChange} 
                required 
              />
              
              <label htmlFor="feedback">Your Feedback</label>
              <textarea 
                id="feedback"
                placeholder="Share your thoughts, suggestions, or concerns..." 
                value={feedbackData.feedback} 
                name="feedback" 
                rows="6" 
                onChange={handleInputChange} 
                required 
              />
              
              <div className="button-container">
                <button type="submit" className="submit-button">
                  Send Feedback
                </button>
                <button 
                  type="button" 
                  className="submit-button" 
                  onClick={() => showFeedbackForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
      
      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo-container">
              <div className="footer-logo">
                <svg className="footer-logo-img" viewBox="0 0 200 50" fill="none">
                  <rect width="200" height="50" rx="8" fill="#333"/>
                  <text x="20" y="32" fill="white" fontSize="18" fontWeight="bold">LawConnect</text>
                </svg>
              </div>
            </div>
            <p className="footer-text">
              Effortless legal case management—secure, organized, and built for advocates.
            </p>
          </div>
          
          <div className="footer-links">
            <p className="footer-text">Developed by Maanya Gupta & Devyani Sharma</p>
          </div>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} LawConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;