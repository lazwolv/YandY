import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { appointmentsApi, Appointment } from '../api/appointments';
import { Calendar, Clock, Users, TrendingUp, Settings, Bell, CheckCircle, XCircle, AlertCircle, DollarSign, User } from 'lucide-react';
import { ScheduleManager } from '../components/ScheduleManager';

// Helper to parse datetime strings from backend without timezone conversion
const parseLocalDateTime = (dateTimeString: string): Date => {
  const isoString = dateTimeString.replace(' ', 'T');
  const [datePart, timePart] = isoString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute, second || 0);
};

export const EmployeeDashboardPage = () => {
  const { user } = useAuthStore();
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    todayCount: 0,
    upcomingCount: 0,
    totalCompleted: 0,
    thisMonthCompleted: 0,
  });
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // This component is only rendered by DashboardPage which is already protected
  // User data is guaranteed to be loaded by ProtectedRoute

  // Fetch employee dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoadingAppointments(true);
        const data = await appointmentsApi.getEmployeeDashboard();
        setTodayAppointments(data.todayAppointments || []);
        setUpcomingAppointments(data.upcomingAppointments || []);
        setStats(data.stats || {
          todayCount: 0,
          upcomingCount: 0,
          totalCompleted: 0,
          thisMonthCompleted: 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoadingAppointments(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Helper functions
  const getStatusBadge = (status: Appointment['status']) => {
    const badges = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, text: 'Pending' },
      CONFIRMED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Confirmed' },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Cancelled' },
      COMPLETED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, text: 'Completed' },
      NO_SHOW: { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'No Show' },
    };
    return badges[status];
  };

  const formatTime = (dateString: string) => {
    return parseLocalDateTime(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return parseLocalDateTime(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-24 pb-12 overflow-hidden">
      {/* Animated gradient overlay with purple accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink/10 pointer-events-none" />

      {/* Sparkle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-pink rounded-full animate-pulse opacity-60" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-pink-light rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-purple-light rounded-full animate-pulse opacity-60" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-10 w-1 h-1 bg-pink rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Dark theme card */}
        <div className="mb-8 bg-gradient-to-r from-purple/30 via-purple-dark/30 to-black/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-white relative border border-purple/20">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">Employee Dashboard 💼</h1>
              <p className="text-white/80 text-lg mb-4">Welcome, {user.fullName}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-white/90">
                  <User className="h-4 w-4" />
                  <span>{user.fullName}</span>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                  {user.teamMember?.specialty || 'Team Member'}
                </div>
              </div>
            </div>
            {/* User Avatar Circle - Lowered and visible on all screens */}
            <div className="ml-8 flex-shrink-0 self-end mb-2">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink/30 to-purple/30 backdrop-blur-sm border-4 border-white/20 shadow-2xl shadow-purple/50 flex items-center justify-center">
                <span className="text-5xl font-bold">{user.fullName.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Today's Appointments</p>
                <p className="text-2xl font-bold text-white">{stats.todayCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Next 7 Days</p>
                <p className="text-2xl font-bold text-white">{stats.upcomingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Total Completed</p>
                <p className="text-2xl font-bold text-white">{stats.totalCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">This Month</p>
                <p className="text-2xl font-bold text-white">{stats.thisMonthCompleted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Appointments & Schedule */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Today's Schedule</h2>
                <span className="text-sm text-white/70">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="p-6">
                {isLoadingAppointments ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-2 text-sm text-white/70">Loading appointments...</p>
                  </div>
                ) : todayAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white/70">No appointments scheduled for today</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Appointments will appear here once customers book with you
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments.map((apt) => {
                      const badge = getStatusBadge(apt.status);
                      const StatusIcon = badge.icon;
                      return (
                        <div key={apt.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{apt.user?.fullName}</h3>
                              <p className="text-sm text-white/70">{apt.service.name}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {badge.text}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-white/70 mt-2">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatTime(apt.startTime)}</span>
                            <span className="mx-2">•</span>
                            <span>{apt.service.duration} min</span>
                            <span className="mx-2">•</span>
                            <span className="font-medium text-white">${Number(apt.service.price).toFixed(2)}</span>
                          </div>
                          <div className="mt-2 text-sm text-white/70">
                            <span className="font-medium">Phone:</span> {apt.user?.phoneNumber}
                          </div>
                          {apt.reminderSent && (
                            <div className="mt-2 flex items-center text-xs text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              <span>Reminder sent via SMS</span>
                            </div>
                          )}
                          {apt.notes && (
                            <div className="mt-2 text-sm text-white/70">
                              <span className="font-medium">Note:</span> {apt.notes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-white">Upcoming This Week</h2>
              </div>
              <div className="p-6">
                {isLoadingAppointments ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white/70">No upcoming appointments this week</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.slice(0, 5).map((apt) => {
                      const badge = getStatusBadge(apt.status);
                      const StatusIcon = badge.icon;
                      return (
                        <div key={apt.id} className="border-l-4 border-primary-500 pl-4 py-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-white">{apt.user?.fullName}</h4>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                                  <StatusIcon className="h-3 w-3 mr-0.5" />
                                  {badge.text}
                                </span>
                              </div>
                              <p className="text-sm text-white/70">{apt.service.name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(apt.startTime)} at {formatTime(apt.startTime)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white/70">No recent activity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Availability */}
          <div className="space-y-6">
            {/* Availability Management */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-white">Availability</h2>
              </div>
              <div className="p-6 space-y-3">
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="w-full btn bg-primary-500 text-white hover:bg-primary-600 justify-start"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Manage Schedule
                </button>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="w-full btn bg-gray-100 text-gray-700 hover:bg-gray-200 justify-start"
                >
                  <Clock className="h-5 w-5 mr-2" />
                  Set Time Off
                </button>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-white">This Month</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-white/70">Appointments</span>
                  </div>
                  <span className="text-lg font-semibold text-white">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-white/70">New Clients</span>
                  </div>
                  <span className="text-lg font-semibold text-white">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-white/70">Revenue</span>
                  </div>
                  <span className="text-lg font-semibold text-white">$0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Management Modal */}
        {user.teamMember?.id && (
          <ScheduleManager
            teamMemberId={user.teamMember.id}
            isOpen={showScheduleModal}
            onClose={() => setShowScheduleModal(false)}
          />
        )}
      </div>
    </div>
  );
};
