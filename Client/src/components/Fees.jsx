import { useState, useEffect } from 'react';
import axios from 'axios';

function Fees() {
  const [formData, setFormData] = useState({
    case_ref_no: '',
    clientName: '',
    fees: '',
    pending_fees: '',
    payment_mode: '',
    due_date: '',
    status: 'pending',
    description: '',
  });
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields based on backend requirements
    const requiredFields = [
      'case_ref_no',
      'clientName',
      'fees',
      'pending_fees',
      'payment_mode',
      'due_date',
    ];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].toString().trim() === ''
    );

    if (emptyFields.length > 0) {
      setError(`Please fill in required fields: ${emptyFields.join(', ')}`);
      console.error('Validation Error - Empty fields:', emptyFields);
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

    // Prepare the data to send (matching backend field names exactly)
    const dataToSend = {
      case_ref_no: formData.case_ref_no.trim(),
      clientName: formData.clientName.trim(),
      fees: parseFloat(formData.fees),
      pending_fees: parseFloat(formData.pending_fees),
      payment_mode: formData.payment_mode.trim(),
      due_date: formData.due_date,
      status: formData.status || 'pending',
      description: formData.description?.trim() || '',
    };

    console.log('=== DATA BEING SENT TO API ===');
    console.log('Processed data:', dataToSend);
    console.log('============================');

    try {
      setLoading(true);
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

      fetchFees(); // Refresh the fees list
    } catch (error) {
      console.error('❌ Full Error Object:', error);
      console.error('❌ Error Response:', error.response?.data);

      // Set user-friendly error message
      if (error.response?.data?.message) {
        setError(`Server Error: ${error.response.data.message}`);
      } else if (error.response?.data?.error) {
        setError(`Server Error: ${error.response.data.error}`);
      } else {
        setError('Failed to create fee record. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/fees', {
        withCredentials: true,
      });
      setFees(response.data);
    } catch (error) {
      console.error('Error fetching fees:', error);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Auto-calculate pending fees when total fees change
  const handleFeesChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // If total fees is being updated and pending fees is empty, set it to total fees
      if (name === 'fees' && !prev.pending_fees) {
        updated.pending_fees = value;
      }

      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Fee Management</h1>
            <p className="text-blue-100 mt-1">
              Create and manage client fee records
            </p>
          </div>

          <div className="p-6">
            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-md">
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
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-400"
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
                  <p className="ml-3 text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Case Reference Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Case Reference Number *
                  </label>
                  <input
                    type="text"
                    name="case_ref_no"
                    value={formData.case_ref_no}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., CASE-2024-001"
                    required
                  />
                </div>

                {/* Client Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter client name"
                    required
                  />
                </div>

                {/* Total Fees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Fees *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="fees"
                      value={formData.fees}
                      onChange={handleFeesChange}
                      step="0.01"
                      min="0"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Pending Fees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pending Fees *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="pending_fees"
                      value={formData.pending_fees}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Mode *
                  </label>
                  <select
                    name="payment_mode"
                    value={formData.payment_mode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="partial">Partially Paid</option>
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional description or notes..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        fill="none"
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
                      Creating...
                    </div>
                  ) : (
                    'Create Fee Record'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Fees List */}
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Fee Records</h2>
          </div>

          <div className="p-6">
            {fees.length > 0 ? (
              <div className="space-y-4">
                {fees.map((fee, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {fee.clientName}
                          </h3>
                          <span className="text-sm text-gray-500">
                            #{fee.case_ref_no}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Payment Mode: {fee.payment_mode}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(fee.due_date).toLocaleDateString()}
                        </p>
                        {fee.description && (
                          <p className="text-sm text-gray-600 mt-2">
                            {fee.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          ${fee.fees}
                        </p>
                        <p className="text-sm text-orange-600">
                          Pending: ${fee.pending_fees}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            fee.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : fee.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : fee.status === 'partial'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {fee.status.charAt(0).toUpperCase() +
                            fee.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No fee records
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new fee record.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fees;
