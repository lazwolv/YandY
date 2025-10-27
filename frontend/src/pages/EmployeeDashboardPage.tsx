import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { appointmentsApi, Appointment } from '../api/appointments';
import { Calendar, Clock, Users, TrendingUp, Settings, Bell, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const EmployeeDashboardPage = () => {
  const { user, isAuthenticated, loadUser } = useAuthStore();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    loadUser();
  }, [isAuthenticated, navigate, loadUser]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoadingAppointments(true);
        const data = await appointmentsApi.getMyAppointments(true);
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setIsLoadingAppointments(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Helper functions
  const getTodayAppointments = () => {
    const today = new Date().toDateString();
    return appointments.filter(apt => new Date(apt.startTime).toDateString() === today);
  };

  const getWeekAppointments = () => {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startTime);
      return aptDate >= now && aptDate <= weekFromNow;
    });
  };

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
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const todayAppointments = getTodayAppointments();
  const weekAppointments = getWeekAppointments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/5 via-white to-pink/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Modern gradient card */}
        <div className="mb-8 bg-gradient-to-r from-purple-dark to-purple rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Employee Dashboard 💼</h1>
              <p className="text-white/90 text-lg">Welcome, {user.fullName} - {user.teamMember?.specialty || 'Team Member'}</p>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center">
                <span className="text-5xl font-bold">{user.fullName.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{weekAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => apt.status === 'CONFIRMED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Appointments & Schedule */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
                <span className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="p-6">
                {isLoadingAppointments ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading appointments...</p>
                  </div>
                ) : todayAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No appointments scheduled for today</p>
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
                              <h3 className="font-semibold text-gray-900">{apt.user.fullName}</h3>
                              <p className="text-sm text-gray-600">{apt.service.name}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {badge.text}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mt-2">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatTime(apt.startTime)}</span>
                            <span className="mx-2">•</span>
                            <span>{apt.service.duration} min</span>
                            <span className="mx-2">•</span>
                            <span className="font-medium text-gray-900">${apt.service.price}</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Phone:</span> {apt.user.phoneNumber}
                          </div>
                          {apt.reminderSent && (
                            <div className="mt-2 flex items-center text-xs text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              <span>Reminder sent via SMS</span>
                            </div>
                          )}
                          {apt.notes && (
                            <div className="mt-2 text-sm text-gray-600">
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
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming This Week</h2>
              </div>
              <div className="p-6">
                {isLoadingAppointments ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  </div>
                ) : weekAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No upcoming appointments this week</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {weekAppointments.slice(0, 5).map((apt) => {
                      const badge = getStatusBadge(apt.status);
                      const StatusIcon = badge.icon;
                      return (
                        <div key={apt.id} className="border-l-4 border-primary-500 pl-4 py-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900">{apt.user.fullName}</h4>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                                  <StatusIcon className="h-3 w-3 mr-0.5" />
                                  {badge.text}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{apt.service.name}</p>
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
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Availability */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-3">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
                  <p className="text-sm text-gray-600">{user.teamMember?.specialty || 'Team Member'}</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
                    Employee
                  </span>
                  {user.teamMember?.isAvailable !== undefined && (
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.teamMember.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.teamMember.isAvailable ? '● Available' : '● Unavailable'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{user.phoneNumber}</p>
                  </div>
                  {user.teamMember?.bio && (
                    <div>
                      <p className="text-gray-600">Bio</p>
                      <p className="font-medium text-gray-900">{user.teamMember.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Availability Management */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Availability</h2>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full btn bg-primary-500 text-white hover:bg-primary-600 justify-start">
                  <Settings className="h-5 w-5 mr-2" />
                  Manage Schedule
                </button>
                <button className="w-full btn bg-gray-100 text-gray-700 hover:bg-gray-200 justify-start">
                  <Clock className="h-5 w-5 mr-2" />
                  Set Time Off
                </button>
                <button className="w-full btn bg-gray-100 text-gray-700 hover:bg-gray-200 justify-start">
                  <Users className="h-5 w-5 mr-2" />
                  View Clients
                </button>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">This Month</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Appointments</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">New Clients</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Revenue</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">$0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
