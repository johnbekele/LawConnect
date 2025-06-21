
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./SignUp.css"

function SignUp() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [secretString, setSecretString] = useState("")
  const [age, setAge] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)

  const navigate = useNavigate()

  // Send OTP to user's email
  const handleEmailSubmit = async () => {
    try {
      await axios.post("http://localhost:3000/advocate", {
        name,
        email,
        age,
      });
      
      setOtpSent(true)
      alert("OTP sent to your email!")
    } catch (error) {
      console.error("Error sending OTP:", error)
      alert("Failed to send OTP. Try again.")
    }
  }

  // Verify OTP
  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/verifyotp", { name,email,age, otp })
      if (response.status === 200) {
        setOtpVerified(true)
        alert("OTP Verified! You can now create a password.")
      }
    } catch (error) {
      alert("Invalid OTP. Try again.")
      console.error("OTP Verification error:", error)
      window.location.reload() // Reload the page if OTP is wrong
    }
  }

  // Register the user in the database
  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!otpVerified) {
      alert("Please verify OTP first.")
      return
    }

    try {
      const response = await axios.post("http://localhost:3000/register", {
        name,
        email,
        password,
        age,
        secretString,
      })

      if (response.status === 200) {
        alert("Registration successful! Please log in.")
        navigate("/")
      }
    } catch (error) {
      console.error("Error during registration:", error)
      alert("Signup failed. User may already exist.")
    }
  }

  const handleClick = ()=>{
    navigate('/');
  }

  return (
    <div className="SignUp-container">
      
      <div className="background-decoration">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
      </div>
    
      <div className="SignUp-box">
        <h2 className="form-title">Advocate Registration</h2>
        <p className="form-subtitle">Legal Professional Portal</p>
        <div className="legal-seal"></div>

        <form>
          <div className="form-section">
            <label>Full Name</label>
            <input
              type="text"
              required
              placeholder="Enter your legal name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-section">
            <label> Age</label>
            <input
              type="number"
              required
              placeholder="Enter your age"
              min="18" step="1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="form-section">
            <label> Professional Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button" className="Email-button" onClick={handleEmailSubmit} disabled={otpSent}>
              {otpSent ? "Verification Code Sent" : "Send Verification Code"}
            </button>
          </div>

          {otpSent && !otpVerified && (
            <div className="form-section">
              <label>Verification Code</label>
              <input
                type="number"
                required
                placeholder="Enter the code sent to your email"
                min="100000" max="999999" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button type="button" className="Otp-button" onClick={handleOtpSubmit}>
                Verify Code
              </button>
            </div>
          )}

          {otpVerified && (
            <div className="form-section">
              <label>Create Password</label>
              <input
                type="password"
                required
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label>Secret Phrase</label>
              <input
                type="password"
                required
                placeholder="Enter your secret recovery phrase"
                value={secretString}
                onChange={(e) => setSecretString(e.target.value)}
              />
              <button type="submit" className="SignUp-button" onClick={handleSignUp}>
                Complete Registration
              </button>
            </div>
          )}

          <div className="form-footer">
            Already registered? <span onClick={handleClick}>Sign In</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp











