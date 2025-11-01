import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Calendar, Clock, Star, User, Award, Image, Edit, X, Globe } from 'lucide-react';
import { appointmentsApi, Appointment } from '../api/appointments';
import { authApi } from '../api/auth';
import { useLanguage } from '../contexts/LanguageContext';

// Helper to parse datetime strings from backend without timezone conversion
const parseLocalDateTime = (dateTimeString: string): Date => {
  // Backend returns: "2025-11-03 09:00:00" or "2025-11-03T09:00:00"
  // Replace space with T for ISO format, then parse component-by-component
  const isoString = dateTimeString.replace(' ', 'T');
  const [datePart, timePart] = isoString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute, second || 0);
};

export const CustomerDashboardPage = () => {
  const { user, setUser } = useAuthStore();
  const { changeLanguage, language } = useLanguage();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // This component is only rendered by DashboardPage which is already protected
  // User data is guaranteed to be loaded by ProtectedRoute

  // Sync language preference on mount
  useEffect(() => {
    if (user?.languagePreference) {
      changeLanguage(user.languagePreference);
    }
  }, [user?.languagePreference, changeLanguage]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const data = await appointmentsApi.getMyAppointments();
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const upcomingAppointments = appointments.filter(
    apt => parseLocalDateTime(apt.startTime) >= new Date() && apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED'
  );

  const pastAppointments = appointments.filter(
    apt => apt.status === 'COMPLETED'
  );

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

  const firstName = user.fullName.split(' ')[0];
  const memberSinceYear = parseLocalDateTime(user.createdAt).getFullYear();

  // Format username: remove country code (1) from phone number username
  const displayUsername = user.username.startsWith('1') && user.username.length === 11
    ? user.username.substring(1)
    : user.username;

  const handleReschedule = (appointmentId: string) => {
    // Navigate to booking page with appointment ID to reschedule
    navigate(`/booking?reschedule=${appointmentId}`);
  };

  const handleCancel = async (appointmentId: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      setCancellingId(appointmentId);
      await appointmentsApi.cancelAppointment(appointmentId);

      // Refresh appointments list
      const data = await appointmentsApi.getMyAppointments();
      setAppointments(data.appointments || []);

      alert('Appointment cancelled successfully');
    } catch (error: any) {
      console.error('Failed to cancel appointment:', error);
      alert(error.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    try {
      // Update in database
      const response = await authApi.updateLanguagePreference(newLanguage);

      // Update local state
      setUser(response.user);

      // Change i18n language
      changeLanguage(newLanguage);
    } catch (error) {
      console.error('Failed to update language preference:', error);
    }
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
          {/* Language Selector - Top Right, moved left to avoid overlap */}
          <div className="absolute top-4 right-32 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
            <Globe className="h-4 w-4" />
            <select
              value={language.toLowerCase()}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer text-sm font-medium"
            >
              <option value="en" className="text-white">English</option>
              <option value="es" className="text-white">Español</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">Welcome back, {firstName}! 👋</h1>
              <p className="text-white/80 text-lg mb-4">Manage your appointments, photos, and rewards</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-white/90">
                  <User className="h-4 w-4" />
                  <span>{user.fullName}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <span>{displayUsername}</span>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                  Customer
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Award className="h-4 w-4" />
                  <span>Member Since {memberSinceYear}</span>
                </div>
              </div>
            </div>
            {/* User Avatar Circle - Lowered and visible on all screens */}
            <div className="ml-8 flex-shrink-0 self-end mb-2">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink/30 to-purple/30 backdrop-blur-sm border-4 border-white/20 shadow-2xl shadow-purple/50 flex items-center justify-center">
                <span className="text-5xl font-bold">{firstName.charAt(0).toUpperCase()}</span>
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
                <p className="text-sm font-medium text-white/70">Upcoming</p>
                <p className="text-2xl font-bold text-white">{upcomingAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Past Visits</p>
                <p className="text-2xl font-bold text-white">{pastAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Points</p>
                <p className="text-2xl font-bold text-white">{user.points}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-white/70">Photo Votes</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
            {/* Upcoming Appointments */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/10">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-white">Upcoming Appointments</h2>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-white/70">Loading appointments...</p>
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white/70">No upcoming appointments</p>
                    <button
                      onClick={() => navigate('/booking')}
                      className="mt-4 btn btn-primary"
                    >
                      Book Appointment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">{apt.service.name}</h3>
                            <div className="mt-2 space-y-1 text-sm text-white/70">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {parseLocalDateTime(apt.startTime).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                {parseLocalDateTime(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              {apt.teamMember && (
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2" />
                                  {apt.teamMember.user.fullName}
                                </div>
                              )}
                            </div>
                            {apt.notes && (
                              <p className="mt-2 text-sm text-white/70">Note: {apt.notes}</p>
                            )}
                          </div>
                          <div className="ml-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                              apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleReschedule(apt.id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md font-medium"
                          >
                            <Edit className="h-4 w-4" />
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(apt.id)}
                            disabled={cancellingId === apt.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="h-4 w-4" />
                            {cancellingId === apt.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => navigate('/booking')}
                      className="w-full bg-primary-500 text-white hover:bg-primary-600 py-3 px-6 rounded-lg font-medium transition-colors"
                    >
                      Book Another Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>

          {/* My Photos */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">My Gallery</h2>
              <button
                onClick={() => navigate('/upload-photo')}
                className="btn btn-outline btn-sm"
              >
                <Image className="h-4 w-4 mr-2" />
                Upload Photo
              </button>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-white/70">No photos uploaded yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Share your amazing results and get votes!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
