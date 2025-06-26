import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgetPassword.css";
import { API_URL } from "../config/EnvConfig.js"; // Adjust the import path as necessary

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [secretString, setsecretString] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //const API = import.meta.env.REACT_APP_API_URL // if using Vite

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
  
    try {
      const response = await axios.post(`${API_URL}/existing`, { email, secretString });
  
      console.log("API Response:", response.data); // Debugging response
      setMessage(response.data.message);
  
      if (response.status==200) {
        console.log("Success received, navigating...");
        navigate("/home");  // Navigate to login
      } else {
        console.log("Success flag is false, not navigating.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.message || "Error connecting to server");
      setMessage(error.response?.data?.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="page-container">
      <div className="login-container">
        {/* Left side - Brand/Image */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="logo-container">
              <div className="logo-icon"></div>
              <h1>Law Connect</h1>
            </div>

            <div className="welcome-message">
              <h2>Welcome to Law Connect</h2>
              <p>Effortless legal case management—secure, organized, and built for advocates.</p>
              <button className="cta-button" onClick={() => navigate("/login")}> 
                Log In Now <span className="arrow-icon">→</span>
              </button>
            </div>
          </div>
          <br></br>
          <div className="wave-container">
            <div className="wave-decoration"></div>
          </div>
        </div>

        {/* Right side - Forget Password Form */}
        <div className="forget-password-container">
          <div className="forget-password-box">
            <h2 className="forgot-heading">Forgot password</h2>
            <form onSubmit={handleSubmit} className="forget-password-form">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
              <input
                type="password"
                placeholder="Enter secret key"
                value={secretString}
                onChange={(e) => setsecretString(e.target.value)}
                required
                className="input-field"
              />
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;










