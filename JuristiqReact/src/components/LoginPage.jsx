
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./LoginPage.css"

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {

      const response = await axios.post(
        "http://localhost:3000/login",
        { email, password },
        { withCredentials: true } // To handle cookies (JWT authentication)
      );


      if (response.status === 200) {
        setSuccess(true)
        setTimeout(() => {
          navigate("/home")
        }, 1000)
      }
    } catch (error) {
      setError("Invalid credentials! Please try again.")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    navigate("/signUp")
  }

  const handleComerRighTov = () => {
    const button = document.querySelector(".cta-button")
    button.classList.add("clicked")
    setTimeout(() => {
      button.classList.remove("clicked")
    }, 200)
  }

  return (
    <div className="page-container">
      <div className="background-decoration">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
      </div>
    
      <div className="login-container">
        {/* Left side - Brand/Image */}
        <div className="login-branding">
          <div className="branding-content">
            
            <div className="logo-icon"><img src="juristiq_icon.jpg"/></div>
             

            <div className="welcome-message">
              <h2>Welcome to Law Connect</h2>
              <p>Effortless legal case management—secure, organized, and built for advocates.</p>
              <button className="cta-button" onClick={handleComerRighTov}>
                Log In Now <span className="arrow-icon">→</span>
              </button>
            </div>

          </div><br></br>
          <div className="wave-container">
            <div className="wave-decoration">
              
            </div>
      </div>
    </div>

        {/* Right side - Login form */}
        <div className="login-form-container">
          <div className="login-form-wrapper">
            <div className="login-header">
              <h2>Welcome back</h2>
              <p>Please sign in to your account</p>
            </div>

            <form onSubmit={handleSignIn} className="login-form">
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">Login successful! Redirecting...</div>}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <div className="password-header">
              
                  <div className="forgot-password" onClick={() => navigate("/forget-password")}>
                    Forgot password?
                  </div>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className={`login-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <div className="divider">
                <span>Or</span>
              </div>

              <button type="button" className="create-button" onClick={handleSignUp}>
                Create an account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage



















