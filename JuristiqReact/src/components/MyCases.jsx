import SideBar from "./sideBar"
import { useState, useEffect } from "react"
import axios from "axios"
import "./sideBar.css"
import "./Mycases.css"

function MyCases() {
  const [showForm, setShowForm] = useState(false)
  const [cases, setCases] = useState([])
  const [editingCase, setEditingCase] = useState(null) // Track the case being edited
  //const API = import.meta.env.REACT_APP_API_URL // if using Vite

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const response = await axios.get("https://lawconnect-wxr0.onrender.com/getcases", {
        withCredentials: true, // Ensures cookies are sent
      });
  
      console.log("Response Data:", response.data); // Debugging
  
      setCases(response.data);
    } catch (error) {
      console.error("Error fetching cases:", error.response?.data || error);
      setCases([]);
    }
  };
  

  const handleClick = () => {
    setShowForm(!showForm)
    setEditingCase(null) // Reset editing state when toggling
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const newCase = {
      case_ref_no: Number(formData.get("case_ref_no")),
      caseTitle: formData.get("caseTitle"),
      clientName: formData.get("clientName"),
      status: formData.get("status"),
      nextHearing: formData.get("hearingDate") ? new Date(formData.get("hearingDate")).toISOString() : null,
      fees: Number(formData.get("totalFees")),
      amount_paid: Number(formData.get("amountPaid")),
    }

    // Basic Form Validation
    if (!newCase.case_ref_no || !newCase.caseTitle || !newCase.clientName || !newCase.status) {
      alert("Please fill all the required fields.")
      return
    }

    try {
      if (editingCase) {
        // Update Case (PUT request)
        await axios.put(`https://lawconnect-wxr0.onrender.com/updatecase/${editingCase.case_ref_no}`, newCase)
      } else {
        // Add New Case (POST request)
        await axios.post("https://lawconnect-wxr0.onrender.com/createcase", newCase ,{withCredentials: true})
      }

      // Reset the form and fetch updated data
      e.target.reset()
      setEditingCase(null) // Exit edit mode
      setShowForm(false) // Close the form
      fetchCases() // Refresh the table
    } catch (error) {
      console.error("Error processing case:", error)
      alert("Error adding/updating case. Try again.")
    }
  }

  const handleDelete = async (case_ref_no) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return

    try {
      await axios.delete(`https://lawconnect-wxr0.onrender.com/deletecase/${case_ref_no}`)
      fetchCases() // Refresh table after delete
    } catch (error) {
      console.error("Error deleting case:", error)
      alert("Failed to delete case. Try again.")
    }
  }

  const handleEdit = (caseItem) => {
    setEditingCase(caseItem) // Set the case being edited
    setShowForm(true) // Open the form
  }

  return (
    <div className="case-management-container">
      <SideBar />
      <button onClick={handleClick} className="add-case-button">
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
        <span className="sr-only">Add case</span>
      </button>

      {showForm && (
        <>
          <div className="overlay" onClick={handleClick}></div>
          <div className="case-form">
            <form className="case-box" onSubmit={handleFormSubmit}>
              <label>Case ref no.:</label>
              <input
                type="number"
                name="case_ref_no"
                required
                defaultValue={editingCase?.case_ref_no}
                readOnly={!!editingCase}
              />

              <label>Case Title:</label>
              <input type="text" name="caseTitle" required defaultValue={editingCase?.caseTitle} />

              <label>Client name:</label>
              <input type="text" name="clientName" required defaultValue={editingCase?.clientName} />

              <label>Status:</label>
              <select name="status" required defaultValue={editingCase?.status}>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
                <option value="Won">Won</option>
              </select>

              <label>Next hearing:</label>
              <input
                type="date"
                name="hearingDate"
                required
                defaultValue={
                  editingCase?.nextHearing ? new Date(editingCase.nextHearing).toISOString().split("T")[0] : ""
                }
              />

              <label>Total fees:</label>
              <input type="number" name="totalFees" required defaultValue={editingCase?.fees} />

              <label>Amount Paid:</label>
              <input type="number" name="amountPaid" required defaultValue={editingCase?.amount_paid} />

              <button className="submit-case" type="submit">
                {editingCase ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </>
      )}

      <div className={`table-container ${showForm ? "hidden" : ""}`}>
        <table>
          <thead>
            <tr>
              <th>Case No.</th>
              <th>Case Title</th>
              <th>Client Name</th>
              <th>Status</th>
              <th>Next Hearing</th>
              <th>Total Fees</th>
              <th>Pending Fees</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {Array.isArray(cases) && cases.length > 0 ? (
    cases.map((caseItem, index) => (
      <tr key={index}>
        <td>{caseItem.case_ref_no}</td>
        <td>{caseItem.caseTitle}</td>
        <td>{caseItem.clientName}</td>
        <td>{caseItem.status}</td>
        <td>{caseItem.nextHearing ? new Date(caseItem.nextHearing).toLocaleDateString("en-GB") : "N/A"}</td>
        <td>{caseItem.fees}</td>
       <td>{caseItem.fees - caseItem.amount_paid}</td>
        <td>
          <button className="edit-btn" onClick={() => handleEdit(caseItem)}>
            Update
          </button>
          <button className="delete-btn" onClick={() => handleDelete(caseItem.case_ref_no)}>
            Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8">No cases available</td>
    </tr>
  )}
</tbody>

</table>
      </div>
    </div>
  )
}

export default MyCases

























































