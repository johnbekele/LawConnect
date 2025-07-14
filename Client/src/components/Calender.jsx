import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import { API_URL } from '../config/EnvConfig.js';

function CalendarComponent() {
  const [hearingDates, setHearingDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hearingsForSelectedDate, setHearingsForSelectedDate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHearingDates = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await axios.get(`${API_URL}/cases/hearings`, {
          withCredentials: true,
        });

        console.log('Fetched hearing dates:', response.data);

        // Format dates for calendar highlighting
        const formattedDates = response.data.map((date) => {
          const localDate = new Date(date);
          localDate.setDate(localDate.getDate() - 1); // Subtract 1 day
          return localDate.toISOString().split('T')[0];
        });

        console.log('Formatted hearing dates:', formattedDates);
        setHearingDates(formattedDates);
      } catch (error) {
        console.error('Error fetching hearing dates:', error);
        setError('Failed to load hearing dates. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHearingDates();
  }, []);

  // Update hearings for selected date when date changes
  useEffect(() => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const hearingsOnDate = hearingDates.filter(
      (date) => date === selectedDateString
    );
    setHearingsForSelectedDate(hearingsOnDate);
  }, [selectedDate, hearingDates]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getTileClassName = ({ date }) => {
    const formattedDate = date.toISOString().split('T')[0];
    const isToday = new Date().toISOString().split('T')[0] === formattedDate;
    const hasHearing = hearingDates.includes(formattedDate);

    let className = '';

    if (isToday) {
      className += 'today-tile ';
    }

    if (hasHearing) {
      className += 'hearing-tile ';
    }

    return className.trim() || null;
  };

  const formatSelectedDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
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
          <p className="text-gray-600 font-medium">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-full overflow-hidden flex flex-col">
      {/* Custom Styles for Calendar */}
      <style>{`
        .react-calendar {
          width: 100% !important;
          background: white !important;
          border: none !important;
          font-family: inherit !important;
          line-height: 1.125em !important;
          height: 100% !important;
        }
        
        .react-calendar--doubleView {
          width: 100% !important;
        }
        
        .react-calendar--doubleView .react-calendar__viewContainer {
          display: flex !important;
          margin: -0.5em !important;
        }
        
        .react-calendar--doubleView .react-calendar__viewContainer > * {
          width: 50% !important;
          margin: 0.5em !important;
        }
        
        .react-calendar *,
        .react-calendar *:before,
        .react-calendar *:after {
          -moz-box-sizing: border-box !important;
          -webkit-box-sizing: border-box !important;
          box-sizing: border-box !important;
        }
        
        .react-calendar button {
          margin: 0 !important;
          border: 0 !important;
          outline: none !important;
        }
        
        .react-calendar button:enabled:hover,
        .react-calendar button:enabled:focus {
          background-color: #f3f4f6 !important;
        }
        
        .react-calendar__navigation {
          display: flex !important;
          height: 50px !important;
          margin-bottom: 0.5em !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          border-radius: 0 !important;
        }
        
        .react-calendar__navigation button {
          min-width: 44px !important;
          background: none !important;
          color: white !important;
          font-size: 14px !important;
          font-weight: 600 !important;
        }
        
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .react-calendar__navigation button[disabled] {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .react-calendar__month-view__weekdays {
          text-align: center !important;
          text-transform: uppercase !important;
          font-weight: bold !important;
          font-size: 0.7em !important;
          color: #6b7280 !important;
          padding: 0.5em 0 !important;
        }
        
        .react-calendar__month-view__weekdays__weekday {
          padding: 0.3em !important;
        }
        
        .react-calendar__month-view__weekNumbers .react-calendar__tile {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 0.75em !important;
          font-weight: bold !important;
        }
        
        .react-calendar__month-view__days__day--weekend {
          color: #ef4444 !important;
        }
        
        .react-calendar__month-view__days__day--neighboringMonth {
          color: #d1d5db !important;
        }
        
        .react-calendar__year-view .react-calendar__tile,
        .react-calendar__decade-view .react-calendar__tile,
        .react-calendar__century-view .react-calendar__tile {
          padding: 1em 0.5em !important;
        }
        
        .react-calendar__tile {
          max-width: 100% !important;
          padding: 8px 4px !important;
          background: none !important;
          text-align: center !important;
          line-height: 14px !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          position: relative !important;
          border-radius: 6px !important;
          margin: 1px !important;
          transition: all 0.2s ease !important;
        }
        
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #f3f4f6 !important;
          transform: scale(1.05) !important;
        }
        
        .react-calendar__tile--now {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
          color: white !important;
          font-weight: 700 !important;
        }
        
        .react-calendar__tile--now:enabled:hover,
        .react-calendar__tile--now:enabled:focus {
          background: linear-gradient(135deg, #2563eb, #1e40af) !important;
        }
        
        .react-calendar__tile--hasActive {
          background: #f3f4f6 !important;
        }
        
        .react-calendar__tile--hasActive:enabled:hover,
        .react-calendar__tile--hasActive:enabled:focus {
          background: #e5e7eb !important;
        }
        
        .react-calendar__tile--active {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
          color: white !important;
          font-weight: 700 !important;
        }
        
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: linear-gradient(135deg, #7c3aed, #6d28d9) !important;
        }
        
        .hearing-tile {
          background: linear-gradient(135deg, #10b981, #059669) !important;
          color: white !important;
          font-weight: 700 !important;
        }
        
        .hearing-tile:enabled:hover,
        .hearing-tile:enabled:focus {
          background: linear-gradient(135deg, #059669, #047857) !important;
          transform: scale(1.05) !important;
        }
        
        .hearing-tile::after {
          content: '⚖️' !important;
          position: absolute !important;
          bottom: 1px !important;
          right: 1px !important;
          font-size: 8px !important;
        }
      `}</style>

      {/* Header - Compact for dashboard integration */}
      <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Court Calendar</h2>
            <p className="text-xs text-gray-600">Hearing dates & schedules</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
              <span className="text-xs text-gray-600">Hearings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-400 flex-shrink-0">
          <div className="flex">
            <svg
              className="h-4 w-4 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-2">
              <p className="text-xs text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Calendar - Takes remaining space */}
      <div className="flex-1 p-3 overflow-hidden">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={getTileClassName}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

export default CalendarComponent;
