import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/EnvConfig.js';

function PendingTasks() {
  const [pendingCases, setPendingCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingCases = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await axios.get(`${API_URL}/cases/pendingcases`, {
          withCredentials: true,
        });
        setPendingCases(response.data);
      } catch (error) {
        console.error('Error fetching pending cases:', error);
        setError('Failed to load pending cases. Please try again.');
        setPendingCases([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingCases();
  }, []);

  const handleRetry = () => {
    const fetchPendingCases = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await axios.get(`${API_URL}/pendingcases`, {
          withCredentials: true,
        });
        setPendingCases(response.data);
      } catch (error) {
        console.error('Error fetching pending cases:', error);
        setError('Failed to load pending cases. Please try again.');
        setPendingCases([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingCases();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white">
        <Header pendingCount={0} />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <Header
        pendingCount={Array.isArray(pendingCases) ? pendingCases.length : 0}
      />

      {error && <ErrorMessage error={error} onRetry={handleRetry} />}

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {Array.isArray(pendingCases) && pendingCases.length > 0 ? (
            <CasesList cases={pendingCases} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {Array.isArray(pendingCases) && pendingCases.length > 0 && (
        <Footer caseCount={pendingCases.length} />
      )}
    </div>
  );
}

// Header Component
const Header = ({ pendingCount }) => (
  <div className="flex-shrink-0 p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Pending Cases</h2>
        <p className="text-gray-600">Track your upcoming case activities</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 font-medium">
            {pendingCount} Pending
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Loading State Component
const LoadingState = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <svg
          className="animate-spin h-12 w-12 text-orange-600 mx-auto mb-4"
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
      </div>
      <p className="text-gray-600 font-medium">Loading pending cases...</p>
      <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
    </div>
  </div>
);

// Error Message Component
const ErrorMessage = ({ error, onRetry }) => (
  <div className="flex-shrink-0 p-4 bg-red-50 border-l-4 border-red-400">
    <div className="flex items-center justify-between">
      <div className="flex">
        <svg
          className="h-5 w-5 text-red-400 flex-shrink-0"
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
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      </div>
      <button
        onClick={onRetry}
        className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium rounded-md transition-colors duration-200"
      >
        Retry
      </button>
    </div>
  </div>
);

// Cases List Component
const CasesList = ({ cases }) => (
  <div className="space-y-4">
    {cases.map((caseItem, index) => (
      <CaseCard key={caseItem.id || index} caseItem={caseItem} index={index} />
    ))}
  </div>
);

// Individual Case Card Component
const CaseCard = ({ caseItem, index }) => (
  <div className="group p-6 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 mb-1">
              {caseItem.caseTitle || `Case #${index + 1}`}
            </h3>
            <p className="text-gray-600 font-medium">
              Client: {caseItem.clientName || 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="text-gray-600">Case #{index + 1}</span>
          </div>

          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-gray-400"
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
            <span className="text-gray-600">
              Next Hearing:{' '}
              <span className="font-semibold text-gray-900">
                {caseItem.nextHearing
                  ? new Date(caseItem.nextHearing).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Not Scheduled'}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
            Pending Action
          </span>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200">
              <svg
                className="w-5 h-5"
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
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      All caught up! 🎉
    </h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      You don't have any pending cases at the moment. All your cases are up to
      date.
    </p>
    <button className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200">
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      Add New Case
    </button>
  </div>
);

// Footer Component
const Footer = ({ caseCount }) => (
  <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-200">
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span className="font-medium">
        Showing {caseCount} pending case{caseCount !== 1 ? 's' : ''}
      </span>
      <button className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200">
        View All Cases →
      </button>
    </div>
  </div>
);

export default PendingTasks;
