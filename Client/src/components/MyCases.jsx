import SideBar from './sideBar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './sideBar.css';
import './Mycases.css';
import { API_URL } from '../config/EnvConfig.js';

function MyCases() {
  const [showForm, setShowForm] = useState(false);
  const [cases, setCases] = useState([]);
  const [editingCase, setEditingCase] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      // Set Authorization header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    axios.defaults.withCredentials = true;
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCases();
    } else {
      console.error('No token found. Please login again.');
      // Redirect to login or show error message
    }
  }, [token]);

  const fetchCases = async () => {
    if (!token) {
      console.error('No token available');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/getcases`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response Data:', response.data);
      setCases(response.data);
    } catch (error) {
      console.error('Error fetching cases:', error.response?.data || error);

      // Handle authentication errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error('Authentication failed. Please login again.');
        localStorage.removeItem('token');
        // Redirect to login page
        window.location.href = '/login';
      }

      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    setShowForm(!showForm);
    setEditingCase(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('Please login again.');
      return;
    }

    const formData = new FormData(e.target);
    const newCase = {
      case_ref_no: Number(formData.get('case_ref_no')),
      caseTitle: formData.get('caseTitle'),
      clientName: formData.get('clientName'),
      status: formData.get('status'),
      nextHearing: formData.get('hearingDate')
        ? new Date(formData.get('hearingDate')).toISOString()
        : null,
      fees: Number(formData.get('totalFees')),
      pending_fees:
        Number(formData.get('totalFees')) -
        Number(formData.get('amountPaid') || 0),
    };

    // Basic Form Validation
    if (
      !newCase.case_ref_no ||
      !newCase.caseTitle ||
      !newCase.clientName ||
      !newCase.status
    ) {
      alert('Please fill all the required fields.');
      return;
    }

    setLoading(true);
    try {
      const config = {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      if (editingCase) {
        // Update Case (PUT request)
        await axios.put(
          `${API_URL}/cases/updatecase/${editingCase.case_ref_no}`,
          newCase,
          config
        );
        alert('Case updated successfully!');
      } else {
        // Add New Case (POST request)
        await axios.post(`${API_URL}/cases/createcase`, newCase, config);
        alert('Case created successfully!');
      }

      // Reset the form and fetch updated data
      e.target.reset();
      setEditingCase(null);
      setShowForm(false);
      fetchCases();
    } catch (error) {
      console.error('Error processing case:', error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Authentication failed. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert(
          `Error ${editingCase ? 'updating' : 'creating'} case: ${
            error.response?.data?.message || 'Please try again.'
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (case_ref_no) => {
    if (!window.confirm('Are you sure you want to delete this case?')) return;

    if (!token) {
      alert('Please login again.');
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/deletecase/${case_ref_no}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Case deleted successfully!');
      fetchCases();
    } catch (error) {
      console.error('Error deleting case:', error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Authentication failed. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert(
          `Failed to delete case: ${
            error.response?.data?.message || 'Please try again.'
          }`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (caseItem) => {
    setEditingCase(caseItem);
    setShowForm(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="case-management-container">
        <SideBar />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="case-management-container">
      <SideBar />
      <button
        onClick={handleClick}
        className="add-case-button"
        disabled={loading}
      >
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
              <input
                type="text"
                name="caseTitle"
                required
                defaultValue={editingCase?.caseTitle}
              />

              <label>Client name:</label>
              <input
                type="text"
                name="clientName"
                required
                defaultValue={editingCase?.clientName}
              />

              <label>Status:</label>
              <select name="status" required defaultValue={editingCase?.status}>
                <option value="">Select Status</option>
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
                  editingCase?.nextHearing
                    ? new Date(editingCase.nextHearing)
                        .toISOString()
                        .split('T')[0]
                    : ''
                }
              />

              <label>Total fees:</label>
              <input
                type="number"
                name="totalFees"
                required
                defaultValue={editingCase?.fees}
              />

              <label>Amount Paid:</label>
              <input
                type="number"
                name="amountPaid"
                defaultValue={editingCase?.amount_paid || 0}
              />

              <button className="submit-case" type="submit" disabled={loading}>
                {loading ? 'Processing...' : editingCase ? 'Update' : 'Submit'}
              </button>
            </form>
          </div>
        </>
      )}

      <div className={`table-container ${showForm ? 'hidden' : ''}`}>
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
                <tr key={caseItem._id || index}>
                  <td>{caseItem.case_ref_no}</td>
                  <td>{caseItem.caseTitle}</td>
                  <td>{caseItem.clientName}</td>
                  <td>
                    <span
                      className={`status-badge status-${caseItem.status?.toLowerCase()}`}
                    >
                      {caseItem.status}
                    </span>
                  </td>
                  <td>
                    {caseItem.nextHearing
                      ? new Date(caseItem.nextHearing).toLocaleDateString(
                          'en-GB'
                        )
                      : 'N/A'}
                  </td>
                  <td>₹{caseItem.fees?.toLocaleString() || 0}</td>
                  <td>
                    ₹
                    {(
                      caseItem.pending_fees ||
                      caseItem.fees - (caseItem.amount_paid || 0)
                    )?.toLocaleString() || 0}
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(caseItem)}
                      disabled={loading}
                    >
                      Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(caseItem.case_ref_no)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: 'center', padding: '20px' }}
                >
                  {loading ? 'Loading cases...' : 'No cases available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyCases;
