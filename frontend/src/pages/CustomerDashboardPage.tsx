import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Calendar, Clock, Star, User, Award, Image } from 'lucide-react';
import { appointmentsApi, Appointment } from '../api/appointments';

export const CustomerDashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // This component is only rendered by DashboardPage which is already protected
  // User data is guaranteed to be loaded by ProtectedRoute
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
    apt => new Date(apt.startTime) >= new Date() && apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED'
  );

  const pastAppointments = appointments.filter(
    apt => apt.status === 'COMPLETED'
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/5 via-white to-pink/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Modern gradient card */}
        <div className="mb-8 bg-gradient-to-r from-purple to-purple-dark rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user.fullName}! 👋</h1>
              <p className="text-white/90 text-lg">Manage your appointments, photos, and rewards</p>
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
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Past Visits</p>
                <p className="text-2xl font-bold text-gray-900">{pastAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Points</p>
                <p className="text-2xl font-bold text-gray-900">{user.points}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-primary-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Photo Votes</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Appointments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading appointments...</p>
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No upcoming appointments</p>
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
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{apt.service.name}</h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(apt.startTime).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              {apt.teamMember && (
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2" />
                                  {apt.teamMember.user.fullName}
                                </div>
                              )}
                            </div>
                            {apt.notes && (
                              <p className="mt-2 text-sm text-gray-600">Note: {apt.notes}</p>
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
                      </div>
                    ))}
                    <button
                      onClick={() => navigate('/booking')}
                      className="w-full btn btn-outline"
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
                <h2 className="text-lg font-semibold text-gray-900">My Gallery</h2>
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
                  <p className="text-gray-600">No photos uploaded yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Share your amazing results and get votes!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Quick Actions */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-3">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-2">
                    <User className="h-3 w-3 mr-1" />
                    Customer
                  </span>
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
                  <div>
                    <p className="text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <button
                  onClick={() => navigate('/booking')}
                  className="w-full btn bg-primary-500 text-white hover:bg-primary-600 justify-start"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Appointment
                </button>
                <button
                  onClick={() => navigate('/upload-photo')}
                  className="w-full btn bg-gray-100 text-gray-700 hover:bg-gray-200 justify-start"
                >
                  <Image className="h-5 w-5 mr-2" />
                  Upload Photo
                </button>
                <button className="w-full btn bg-gray-100 text-gray-700 hover:bg-gray-200 justify-start">
                  <Star className="h-5 w-5 mr-2" />
                  View Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
