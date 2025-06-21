
import { useState, useEffect } from "react"
import axios from "axios"
import "./Profile.css"
import SideBar from "./sideBar"

function Profile() {
  const [advocate, setAdvocate] = useState({
    name: "",
    email: "",
    age: "",
    contact: "",
    casesHandled: 0,
    casesWon: 0,
    profilePic: "",
  })
  const [editMode, setEditMode] = useState(false)
  //const API = import.meta.env.REACT_APP_API_URL // if using Vite

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfile()
      await fetchCaseStatistics()
    }
    fetchData()
  }, [])
  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:3000/profile", { 
        withCredentials: true 
      });
  
      console.log("Profile Data from Backend:", response.data); // ✅ Log fetched data
      setAdvocate((prev) => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error("Error fetching profile:", error.response?.data || error.message);
      setAdvocate([]);
    }

  };
  
  const fetchCaseStatistics = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getcases",{withCredentials:true})
      const cases = response.data
      const casesHandled = cases.length
      const casesWon = cases.filter((c) => c.status.toLowerCase() === "won").length

      setAdvocate((prev) => ({
        ...prev,
        casesHandled: casesHandled || prev.casesHandled,
        casesWon: casesWon || prev.casesWon,
      }))
    } catch (error) {
      console.error("Error fetching case statistics:", error)
    }
  }

  const handleUpdate = async () => {
    try {
      await axios.put("http://localhost:3000/updateProfile", advocate, { withCredentials: true })
      alert("Profile updated successfully!")
  
      await fetchProfile() // ✅ wait for fresh data to load
      console.log("fetching");
      setEditMode(false)   // ✅ switch out of edit mode AFTER reloading
      console.log("riderecting");
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }
  
  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAdvocate((prev) => ({ ...prev, profilePic: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const calculateSuccessRate = () => {
    if (advocate.casesHandled === 0) return 0
    return Math.round((advocate.casesWon / advocate.casesHandled) * 100)
  }

  return (
    <div className="profile-page">
      <SideBar />

      <div className={`profile-container ${editMode ? "edit-mode" : ""}`}>
        <div className="profile-header">
          <h2>Advocate Profile</h2>
          {!editMode ? (
            <button onClick={() => setEditMode(true)} className="edit-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                <path d="m15 5 4 4"></path>
              </svg>
              Edit
            </button>
          ) : (
            <button onClick={handleUpdate} className="save-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Save
            </button>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-pic-section">
            <div className="profile-pic-container">
              <img src={advocate.profilePic || "default-avatar.png"} alt="Profile" className="profile-pic" />
              {editMode && (
                <label className="upload-label">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <input type="file" accept="image/*" onChange={handleProfilePicUpload} className="hidden-input" />
                </label>
              )}
            </div>
            <h3 className="advocate-name">{advocate.name || "Advocate Name"}</h3>
          </div>

          <div className="profile-card">
            <h3 className="card-title">Personal Information</h3>
            <div className="profile-details">
              <div className="detail-item">
                <label>Name</label>
                {editMode ? (
                  <input
                    type="text"
                    value={advocate.name}
                    onChange={(e) => setAdvocate({ ...advocate, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                ) : (
                  <p>{advocate.name || "Not provided"}</p>
                )}
              </div>

              <div className="detail-item">
                <label>Age</label>
                {editMode ? (
                  <input
                    type="number"
                    value={advocate.age}
                    onChange={(e) => setAdvocate({ ...advocate, age: e.target.value })}
                    placeholder="Enter your age"
                  />
                ) : (
                  <p>{advocate.age || "Not provided"}</p>
                )}
              </div>

              <div className="detail-item">
                <label>Contact</label>
                {editMode ? (
                  <input
                    type="text"
                    value={advocate.contact}
                    onChange={(e) => setAdvocate({ ...advocate, contact: e.target.value })}
                    placeholder="Enter your contact number"
                  />
                ) : (
                  <p>{advocate.contact || "Not provided"}</p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-card">
            <h3 className="card-title">Case Statistics</h3>
            <div className="stats-container">
              <div className="stat-box">
                <div className="stat-value">{advocate.casesHandled}</div>
                <div className="stat-label">Cases Handled</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{advocate.casesWon}</div>
                <div className="stat-label">Cases Won</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{calculateSuccessRate()}%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile




