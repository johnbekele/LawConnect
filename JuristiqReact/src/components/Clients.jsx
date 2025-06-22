
import { useState, useEffect } from "react"
import axios from "axios"
import SideBar from "./sideBar"
import "./Clients.css"

function Clients() {
  const [showForm, setShowForm] = useState(false)
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
    //const API = import.meta.env.REACT_APP_API_URL // if using Vite

    useEffect(() => {
      fetchClients();
    }, []);
    
const fetchClients = async () => {
  setIsLoading(true);
  try {
    const response = await axios.get("https://lawconnect-wxr0.onrender.com/clients", { withCredentials: true });
    console.log("Fetched Clients:", response.data);

    // If the response is an object, convert it into an array
    const clientsData = Array.isArray(response.data) ? response.data : [response.data];
    setClients(clientsData); // Directly update the state with the data

  } catch (error) {
    console.error("Error fetching clients:", error);
    setClients([]); // Clear out clients in case of error
  } finally {
    setIsLoading(false);
  }
};

    
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newClient = {
      client_name: formData.get("clientName"),
      phone: formData.get("phone"),
      case_ref_no: formData.get("case_ref_no"),
    }

    try {
      const response = await axios.post("https://lawconnect-wxr0.onrender.com/createclient", newClient, {
        withCredentials: true})
      console.log("New Client Added:", response.data)

      // Update state to reflect the new client
      setClients((prevClients) => [...prevClients, response.data])

      // Hide the form after submission
      setShowForm(false)
      e.target.reset() // Clear form fields
    } catch (error) {
      console.error("Error adding client:", error)
      alert("Error adding client. Try again.")
    }
  }

  return (
    <div className="app-container">
      <SideBar />

      <div className="content-container">
        <div className="page-header">
          <h1>Clients</h1>
          <p>Manage your client information</p>
        </div>

        {/* Clients List */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="clients-grid">
            {Array.isArray(clients) && clients.length > 0 ? (
              clients.map((client, index) => (
                <div key={index} className="client-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="card-header">
                    <div className="avatar-container">
                      <svg
                        className="user-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <span className="case-badge">Case #{client.case_ref_no}</span>
                  </div>
                  <div className="card-content">
                    <h2>{client.client_name}</h2>
                    <div className="client-details">
                      <div className="detail-item">
                        <svg
                          className="detail-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span>{client.phone}</span>
                      </div>
                      <div className="detail-item">
                        <svg
                          className="detail-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <span>Case Ref: {client.case_ref_no}</span>
                      </div>
                    </div>
                    <div className="card-footer">
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon-container">
                  <svg
                    className="empty-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h3>No clients yet</h3>
                <p>Add your first client to get started</p>
                <button onClick={() => setShowForm(true)} className="add-first-client-btn">
                  Add Client
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Client Button */}
      <button onClick={() => setShowForm(true)} className="add-button">
        <svg
          className="plus-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <span className="sr-only">Add client</span>
      </button>

      {/* Form Modal */}
      {showForm && (
        <>
          <div className="overlay" onClick={() => setShowForm(false)}></div>
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Client</h2>
              <button onClick={() => setShowForm(false)} className="close-button">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="client-form">
              <div className="form-group">
                <label htmlFor="clientName">Client Name</label>
                <input type="text" id="clientName" name="clientName" required placeholder="Enter client name" />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" required placeholder="Enter phone number" />
              </div>

              <div className="form-group">
                <label htmlFor="case_ref_no">Case Reference Number</label>
                <input
                  type="number"
                  id="case_ref_no"
                  name="case_ref_no"
                  required
                  min="1"
                  placeholder="Enter case reference number"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default Clients






