import SideBar from './sideBar';
import CalendarComponent from './Calender';
import PendingTasks from './PendingTasks';
import Headlines from './Headlines';

function Home() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar - Fixed width */}
      <div className="flex-shrink-0">
        <SideBar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header Bar */}
        <HeaderSection />

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
const HeaderSection = () => (
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
        <QuickStats />

        {/* Date and Time */}
        <DateTimeDisplay />
      </div>
    </div>
  </div>
);

// Quick Stats Component
const QuickStats = () => (
  <div className="flex items-center space-x-4">
    <StatItem value="12" label="Active Cases" color="blue" />
    <StatItem value="5" label="This Week" color="green" />
    <StatItem value="3" label="Pending" color="purple" />
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
