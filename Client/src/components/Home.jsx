import React, { useState, useEffect } from 'react';
import SideBar from './sideBar';
import CalendarComponent from './Calender';
import PendingTasks from './PendingTasks';
import Headlines from './Headlines';
import axios from 'axios';
import { API_URL } from '../config/EnvConfig.js';

function Home() {
  const [caseStats, setCaseStats] = useState({
    casesHandled: 0,
    casesPending: 0,
    caseWon: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const stats = await fetchCaseStatistics();
      if (stats) {
        setCaseStats(stats);
      }
    };
    fetchData();
  }, []);

  const fetchCaseStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/cases/getcases`, {
        withCredentials: true,
      });
      console.log('Fetched Cases:', response.data);
      const cases = response.data;
      const casesHandled = cases.length;
      const casesPending = cases.filter(
        (c) => c.status.toLowerCase() === 'pending'
      ).length;
      const caseWon = cases.filter(
        (c) => c.status.toLowerCase() === 'won'
      ).length;
      return {
        casesHandled,
        casesPending,
        caseWon,
      };
    } catch (error) {
      console.error('Error fetching case statistics:', error);
    }
  };

  const activeCases = caseStats.casesHandled;
  const pendingCases = caseStats.casesPending;
  const WonCase = caseStats.caseWon;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar - Fixed width */}
      <div className="flex-shrink-0">
        <SideBar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header Bar */}
        <HeaderSection
          activeCases={activeCases}
          WonCase={WonCase}
          pendingCases={pendingCases}
        />

        {/* Main Content Grid - Fixed height containers */}
        <div className="flex-1 p-8 space-y-8 overflow-hidden">
          {/* Upper Row - Calendar and Headlines */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-96">
            {/* Calendar - Takes 3/4 of the width */}
            <div className="lg:col-span-3 h-full">
              <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <CalendarComponent />
              </div>
            </div>

            {/* Headlines - Takes 1/4 of the width */}
            <div className="lg:col-span-1 h-full">
              <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <Headlines />
              </div>
            </div>
          </div>

          {/* Lower Row - Pending Tasks */}
          <div className="flex-1 min-h-0">
            <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <PendingTasks />
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar />
      </div>
    </div>
  );
}

// Header Section Component
const HeaderSection = ({ activeCases, pendingCases, WonCase }) => (
  <div className="flex-shrink-0 bg-white shadow-sm border-b border-gray-200 px-8 py-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage your legal cases and schedule
        </p>
      </div>
      <div className="flex items-center space-x-6">
        {/* Quick Stats */}
        <QuickStats
          activeCases={activeCases}
          pendingCases={pendingCases}
          WonCase={WonCase}
        />

        {/* Date and Time */}
        <DateTimeDisplay />
      </div>
    </div>
  </div>
);

// Quick Stats Component
const QuickStats = ({ activeCases, WonCase, pendingCases }) => (
  <div className="flex items-center space-x-4">
    <StatItem value={activeCases} label="Active Cases" color="blue" />
    <StatItem value={WonCase} label="Won" color="green" />
    <StatItem value={pendingCases} label="Pending" color="purple" />
  </div>
);

// Individual Stat Item
const StatItem = ({ value, label, color }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
  };

  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
};

// Date Time Display Component
const DateTimeDisplay = () => (
  <div className="text-right border-l border-gray-200 pl-6">
    <p className="text-sm font-semibold text-gray-900">
      {new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </p>
    <p className="text-sm text-gray-500">
      {new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </p>
  </div>
);

// Status Bar Component
const StatusBar = () => (
  <div className="flex-shrink-0 bg-white border-t border-gray-200 px-8 py-4">
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center space-x-6 text-gray-600">
        <StatusIndicator color="green" text="System Online" animated />
        <StatusIndicator color="blue" text="Last sync: Just now" />
      </div>
      <div className="text-gray-500">
        © 2024 LawConnect - Legal Case Management
      </div>
    </div>
  </div>
);

// Status Indicator Component
const StatusIndicator = ({ color, text, animated = false }) => {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-2 h-2 ${colorClasses[color]} rounded-full ${
          animated ? 'animate-pulse' : ''
        }`}
      ></div>
      <span>{text}</span>
    </div>
  );
};

export default Home;
