import { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from './sideBar';
import { API_URL } from '../config/EnvConfig.js';

function MyCases() {
  const [showForm, setShowForm] = useState(false);
  const [cases, setCases] = useState([]);
  const [editingCase, setEditingCase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/cases/getcases`, {
        withCredentials: true,
      });
      console.log('Fetched Cases:', response.data);

      const casesData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setCases(casesData);
    } catch (error) {
      console.error('Error fetching cases:', error);
      setError('Failed to load cases. Please try again.');
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-GB');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'PLN',
    }).format(amount);
  };

  const handleClick = () => {
    setShowForm(!showForm);
    setEditingCase(null);
  };

  const handleEdit = (caseItem) => {
    setEditingCase(caseItem);
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const caseData = {
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

    try {
      if (editingCase) {
        await axios.put(
          `${API_URL}/cases/updatecase/${editingCase.case_ref_no}`,
          caseData,
          { withCredentials: true }
        );
      } else {
        await axios.post(`${API_URL}/cases/createcase`, caseData, {
          withCredentials: true,
        });
      }
      setShowForm(false);
      fetchCases();
    } catch (error) {
      console.error('Error processing case:', error);
      alert('Error processing request. Try again.');
    }
  };

  const handleDelete = async (case_ref_no) => {
    if (!window.confirm('Are you sure you want to delete this case?')) return;
    try {
      await axios.delete(`${API_URL}/cases/deletecase/${case_ref_no}`, {
        withCredentials: true,
      });
      fetchCases();
    } catch (error) {
      console.error('Error deleting case:', error);
      alert('Failed to delete case. Try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'from-yellow-500 to-orange-600';
      case 'active':
        return 'from-blue-500 to-indigo-600';
      case 'closed':
        return 'from-gray-500 to-gray-600';
      case 'won':
        return 'from-green-500 to-emerald-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'won':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SideBar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Cases</h1>
              <p className="text-gray-600 mt-1">
                Manage your legal cases and track their progress
              </p>
            </div>
            <div className="flex items-center space-x-6">
              {/* Quick Stats */}
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {cases.length}
                  </div>
                  <div className="text-xs text-gray-500">Total Cases</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      cases.filter((c) => c.status?.toLowerCase() === 'active')
                        .length
                    }
                  </div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      cases.filter((c) => c.status?.toLowerCase() === 'pending')
                        .length
                    }
                  </div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
              </div>

              {/* Add Case Button - Header */}
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Case
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <svg
                  className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
                <p className="text-gray-600 font-medium">Loading cases...</p>
              </div>
            </div>
          ) : (
            /* Cases Grid */
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.isArray(cases) && cases.length > 0 ? (
                cases.map((caseItem, index) => {
                  const pendingFees =
                    caseItem.pending_fees ||
                    caseItem.fees - (caseItem.amount_paid || 0);
                  const isOverdue =
                    caseItem.nextHearing &&
                    new Date(caseItem.nextHearing) < new Date();

                  return (
                    <div
                      key={caseItem._id || index}
                      className="group bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${
                          index * 0.1
                        }s both`,
                      }}
                    >
                      {/* Card Header */}
                      <div
                        className={`bg-gradient-to-r ${getStatusColor(
                          caseItem.status
                        )} p-4 relative`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <span className="bg-white bg-opacity-20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                            Case #{caseItem.case_ref_no}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                          {caseItem.caseTitle}
                        </h3>

                        <p className="text-gray-600 mb-4">
                          {caseItem.clientName}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Status</p>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                  caseItem.status
                                )}`}
                              >
                                {caseItem.status}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Total Fees
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(caseItem.fees || 0)}
                              </p>
                            </div>
                          </div>

                          {pendingFees > 0 && (
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-red-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Pending Fees
                                </p>
                                <p className="text-sm font-semibold text-red-600">
                                  {formatCurrency(pendingFees)}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                isOverdue ? 'bg-red-100' : 'bg-orange-100'
                              }`}
                            >
                              <svg
                                className={`w-4 h-4 ${
                                  isOverdue ? 'text-red-600' : 'text-orange-600'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h6a2 2 0 002-2l-2-13"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Next Hearing
                              </p>
                              <p
                                className={`text-sm font-semibold ${
                                  isOverdue ? 'text-red-600' : 'text-gray-900'
                                }`}
                              >
                                {formatDate(caseItem.nextHearing) ||
                                  'Not scheduled'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(caseItem)}
                              className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(caseItem.case_ref_no)}
                              className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Empty State */
                <div className="col-span-full flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No cases yet
                  </h3>
                  <p className="text-gray-600 mb-6 text-center max-w-md">
                    Start managing your legal cases by adding your first case.
                    Track case progress, client information, and important dates
                    all in one place.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Your First Case
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-white border-t border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>
                  {cases.length} case{cases.length !== 1 ? 's' : ''} loaded
                </span>
              </div>
            </div>
            <div className="text-gray-500">
              © 2024 LawConnect - Case Management
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add Button - Mobile */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center z-40"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>

      {/* Form Modal */}
      {showForm && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={handleClick}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {editingCase ? 'Edit Case' : 'Add New Case'}
                    </h2>
                    <p className="text-blue-100 mt-1">
                      {editingCase
                        ? 'Update case information'
                        : 'Enter case details'}
                    </p>
                  </div>
                  <button
                    onClick={handleClick}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="case_ref_no"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Case Reference No. *
                    </label>
                    <input
                      type="number"
                      id="case_ref_no"
                      name="case_ref_no"
                      defaultValue={editingCase?.case_ref_no || ''}
                      required
                      readOnly={!!editingCase}
                      placeholder="Enter case reference number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      defaultValue={editingCase?.status || ''}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Closed">Closed</option>
                      <option value="won">Won</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="caseTitle"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Case Title *
                    </label>
                    <input
                      type="text"
                      id="caseTitle"
                      name="caseTitle"
                      defaultValue={editingCase?.caseTitle || ''}
                      required
                      placeholder="Enter case title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="clientName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Client Name *
                    </label>
                    <input
                      type="text"
                      id="clientName"
                      name="clientName"
                      defaultValue={editingCase?.clientName || ''}
                      required
                      placeholder="Enter client name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="hearingDate"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Next Hearing Date
                    </label>
                    <input
                      type="date"
                      id="hearingDate"
                      name="hearingDate"
                      defaultValue={
                        editingCase?.nextHearing
                          ? new Date(editingCase.nextHearing)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="totalFees"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Total Fees *
                    </label>
                    <input
                      type="number"
                      id="totalFees"
                      name="totalFees"
                      min="0"
                      defaultValue={editingCase?.fees || ''}
                      required
                      placeholder="Enter total fees"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="amountPaid"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Amount Paid
                    </label>
                    <input
                      type="number"
                      id="amountPaid"
                      name="amountPaid"
                      min="0"
                      defaultValue={editingCase?.amount_paid || 0}
                      placeholder="Enter amount paid"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClick}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 font-semibold transition-all duration-200"
                  >
                    {editingCase ? 'Update Case' : 'Add Case'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default MyCases;
