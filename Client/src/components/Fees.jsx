import { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from './sideBar';
import { data } from 'react-router-dom';

function Fees() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    case_ref_no: '',
    clientName: '',
    fees: '',
    pending_fees: '',
    payment_mode: '',
    due_date: '',
    status: 'pending',
    description: '',
    amount_paid: '',
  });
  const [fees, setFees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [optionIndex, setOptionIndex] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(
        'http://localhost:3000/api/fees/getfees',
        {
          withCredentials: true,
        }
      );
      console.log('Fetched Fees:', response.data);

      const feesData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setFees(feesData);
    } catch (error) {
      console.error('Error fetching fees:', error);
      setError('Failed to load fees. Please try again.');
      setFees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    console.log('submitte effect');
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      'case_ref_no',
      'clientName',
      'fees',
      'pending_fees',
      'amount_paid',
      'payment_mode',
      'due_date',
    ];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].toString().trim() === ''
    );

    if (emptyFields.length > 0) {
      setError(`Please fill in required fields: ${emptyFields.join(', ')}`);
      return;
    }

    // Validate fees are numbers
    if (isNaN(parseFloat(formData.fees)) || parseFloat(formData.fees) <= 0) {
      setError('Total fees must be a valid positive number');
      return;
    }

    if (
      isNaN(parseFloat(formData.pending_fees)) ||
      parseFloat(formData.pending_fees) < 0
    ) {
      setError('Pending fees must be a valid number (0 or greater)');
      return;
    }

    const dataToSend = {
      case_ref_no: formData.case_ref_no.trim(),
      clientName: formData.clientName.trim(),
      fees: parseFloat(formData.fees),
      pending_fees: parseFloat(formData.pending_fees),
      amount_paid: parseFloat(formData.amount_paid),
      payment_mode: formData.payment_mode.trim(),
      due_date: formData.due_date,
      status: formData.status || 'pending',
      description: formData.description?.trim() || '',
    };

    console.log('Data to send ', dataToSend);

    try {
      setError('');
      setSuccess('');

      const response = await axios.post(
        'http://localhost:3000/api/fees/createfee',
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('✅ Success Response:', response.data);
      setSuccess('Fee record created successfully!');

      // Reset form
      setFormData({
        case_ref_no: '',
        clientName: '',
        fees: '',
        pending_fees: '',
        payment_mode: '',
        due_date: '',
        status: 'pending',
        description: '',
      });

      setShowForm(false);
      fetchFees(); // Refresh the fees list
    } catch (error) {
      console.error('❌ Full Error Object:', error);

      if (error.response?.data?.message) {
        setError(`Server Error: ${error.response.data.message}`);
      } else if (error.response?.data?.error) {
        setError(`Server Error: ${error.response.data.error}`);
      } else {
        setError('Failed to create fee record. Please try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeesChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'fees' && !prev.pending_fees) {
        updated.pending_fees = value;
      }
      return updated;
    });
  };

  const handleOption = (index) => {
    setOptionIndex((prev) => (prev === index ? null : index));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return (
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case 'overdue':
        return (
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'partial':
        return (
          <svg
            className="w-4 h-4 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
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
              <h1 className="text-3xl font-bold text-gray-900">
                Fee Management
              </h1>
              <p className="text-gray-600 mt-1">
                Track and manage client fees and payments
              </p>
            </div>
            <div className="flex items-center space-x-6">
              {/* Quick Stats */}
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {fees.length}
                  </div>
                  <div className="text-xs text-gray-500">Total Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {fees.filter((fee) => fee.status === 'paid').length}
                  </div>
                  <div className="text-xs text-gray-500">Paid</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {fees.filter((fee) => fee.status === 'overdue').length}
                  </div>
                  <div className="text-xs text-gray-500">Overdue</div>
                </div>
              </div>

              {/* Add Fee Button */}
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
                Add Fee Record
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="ml-3 text-green-700 font-medium">{success}</p>
              </div>
            </div>
          )}

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
                <p className="text-gray-600 font-medium">Loading fees...</p>
              </div>
            </div>
          ) : (
            /* Fees Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.isArray(fees) && fees.length > 0 ? (
                fees.map((fee, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 relative">
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
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span className="bg-white bg-opacity-20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                          #{fee.case_ref_no}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                        {fee.clientName}
                      </h3>

                      {/* Card body when option */}
                      {optionIndex === index ? (
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
                                  d="M11 5h2m2 0h2m-5 0v2m0 4l6.586-6.586a2 2 0 112.828 2.828L15 13m-4 4H5v-4l9-9"
                                />
                              </svg>
                            </div>
                            <div>
                              <p>Edit Fee Record</p>
                            </div>
                          </div>

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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H8V5a1 1 0 011-1z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p>Delete Record</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
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
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  Total Fees
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                  ${fee.fees}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-orange-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Pending</p>
                              <p className="text-sm font-semibold text-orange-600">
                                ${fee.pending_fees}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Payment Mode
                              </p>
                              <p className="text-sm font-semibold text-gray-900 capitalize">
                                {fee.payment_mode?.replace('_', ' ')}
                              </p>
                            </div>
                          </div>

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
                                  d="M8 7V3a1 1 0 012 0v4m3-4v4a1 1 0 002 0V3a1 1 0 012 0v4m-8 0h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Due Date</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {new Date(fee.due_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Card Footer */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              fee.status
                            )}`}
                          >
                            <div className="w-2 h-2 rounded-full mr-1 flex items-center justify-center">
                              {getStatusIcon(fee.status)}
                            </div>
                            {fee.status
                              ? fee.status.charAt(0).toUpperCase() +
                                fee.status.slice(1)
                              : fee.status}
                          </span>
                          <button
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            onClick={() => handleOption(index)}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty State */
                <div className="col-span-full flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No fee records yet
                  </h3>
                  <p className="text-gray-600 mb-6 text-center max-w-md">
                    Start tracking your client fees by creating your first fee
                    record. Monitor payments, due dates, and payment statuses
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
                    Create Your First Fee Record
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
                  {fees.length} fee record{fees.length !== 1 ? 's' : ''} loaded
                </span>
              </div>
            </div>
            <div className="text-gray-500">
              © 2024 LawConnect - Fee Management
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
            onClick={() => setShowForm(false)}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Create Fee Record
                    </h2>
                    <p className="text-blue-100 mt-1">
                      Add a new fee record for client
                    </p>
                  </div>
                  <button
                    onClick={() => console.log('cliecked')}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Case Reference Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Case Reference Number *
                    </label>
                    <input
                      type="text"
                      name="case_ref_no"
                      value={formData.case_ref_no}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="e.g., CASE-2024-001"
                      required
                    />
                  </div>

                  {/* Client Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter client name"
                      required
                    />
                  </div>

                  {/* Total Fees */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Total Fees *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-500 font-semibold">
                        $
                      </span>
                      <input
                        type="number"
                        name="fees"
                        value={formData.fees}
                        onChange={handleFeesChange}
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  {/* Pending Fees */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pending Fees *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-500 font-semibold">
                        $
                      </span>
                      <input
                        type="number"
                        name="pending_fees"
                        value={formData.pending_fees}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount_paid*
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-500 font-semibold">
                        $
                      </span>
                      <input
                        type="number"
                        name="amount_paid"
                        value={formData.amount_paid}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  {/* Payment Mode */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Mode *
                    </label>
                    <select
                      name="payment_mode"
                      value={formData.payment_mode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                    >
                      <option value="">Select payment mode</option>
                      <option value="cash">Cash</option>
                      <option value="check">Check</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="online_payment">Online Payment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="partial">Partially Paid</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                      placeholder="Optional description or notes about this fee record..."
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 font-semibold transition-all duration-200"
                  >
                    Create Fee Record
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

export default Fees;
