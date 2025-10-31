import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, MessageSquare, Check, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { servicesApi, Service } from '../api/services';
import { teamMembersApi, TeamMember } from '../api/teamMembers';
import { appointmentsApi } from '../api/appointments';

export const BookingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [services, setServices] = useState<Service[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('');
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notes: '',
  });

  // Ensure page scrolls to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true);
        const data = await servicesApi.getAllServices();
        setServices(data.services || []);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setError('Failed to load services. Please refresh the page.');
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setIsLoadingTeamMembers(true);
        const data = await teamMembersApi.getAllTeamMembers();
        setTeamMembers(data.teamMembers || []);
        // Auto-select if only one team member
        if (data.teamMembers.length === 1) {
          setSelectedTeamMember(data.teamMembers[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch team members:', error);
        setError('Failed to load team members. Please refresh the page.');
      } finally {
        setIsLoadingTeamMembers(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const getTotalDuration = () => {
    return selectedServices.length * 30; // 30 minutes per service
  };

  const getTotalPrice = () => {
    if (!selectedServices || selectedServices.length === 0) return 0;
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (Number(service?.price) || 0);
    }, 0);
  };

  const getEndTime = (startTime: string, durationMinutes: number) => {
    if (!startTime) return '';

    const [time, period] = startTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;

    const startMinutes = hour24 * 60 + minutes;
    const endMinutes = startMinutes + durationMinutes;

    const endHour24 = Math.floor(endMinutes / 60) % 24;
    const endMin = endMinutes % 60;

    const endHour12 = endHour24 === 0 ? 12 : endHour24 > 12 ? endHour24 - 12 : endHour24;
    const endPeriod = endHour24 >= 12 ? 'PM' : 'AM';

    return `${endHour12}:${endMin.toString().padStart(2, '0')} ${endPeriod}`;
  };

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedTeamMember) {
      setError('Please select a team member');
      return;
    }

    if (selectedServices.length === 0) {
      setError('Please select at least one service');
      return;
    }

    if (!user) {
      setError('You must be logged in to book an appointment');
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert date and time to ISO string
      const [hours, minutes] = formData.time.split(':');
      const hour = parseInt(hours);
      const period = formData.time.includes('PM') ? 'PM' : 'AM';
      let hour24 = hour;
      if (period === 'PM' && hour !== 12) hour24 += 12;
      if (period === 'AM' && hour === 12) hour24 = 0;

      const appointmentDate = new Date(formData.date);
      appointmentDate.setHours(hour24, parseInt(minutes.replace(/\D/g, '')), 0, 0);

      // Create appointments for each selected service
      const createdAppointments = [];
      let currentStartTime = appointmentDate;

      for (const serviceId of selectedServices) {
        const appointment = await appointmentsApi.createAppointment({
          teamMemberId: selectedTeamMember,
          serviceId,
          startTime: currentStartTime.toISOString(),
          notes: formData.notes,
        });

        createdAppointments.push(appointment);

        // Add 30 minutes for next service
        currentStartTime = new Date(currentStartTime.getTime() + 30 * 60 * 1000);
      }

      // Success! Redirect to dashboard
      alert(`Success! ${selectedServices.length} appointment(s) created. Redirecting to your dashboard...`);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Booking error:', error);
      setError(error.response?.data?.error || 'Failed to create appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to book an appointment</p>
          <button
            onClick={() => navigate('/login')}
            className="btn bg-primary-500 text-white hover:bg-primary-600 px-8 py-3"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-purple/5 via-primary-100/10 to-purple/5 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple to-purple-dark text-white px-8 py-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Calendar className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Book Your Appointment</h1>
            <p className="text-white/90 text-lg">Hi {user.fullName}, select your services below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Your Information (Read-only) */}
            <div>
              <h2 className="text-2xl font-bold text-purple mb-4">Your Information</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4" />
                  <span><strong>Name:</strong> {user.fullName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4" />
                  <span><strong>Phone:</strong> {user.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Team Member Selection */}
            <div>
              <h2 className="text-2xl font-bold text-purple mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Choose Your Nail Technician
                {selectedTeamMember && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    (Selected)
                  </span>
                )}
              </h2>

              {isLoadingTeamMembers ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading team members...</p>
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                  No team members available at this time. Please try again later.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTeamMember(member.id)}
                      className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                        selectedTeamMember === member.id
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:border-primary-300 hover:shadow-sm'
                      }`}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selectedTeamMember === member.id}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedTeamMember(member.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-4">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                          {member.imageUrl ? (
                            <img
                              src={member.imageUrl}
                              alt={member.user.fullName}
                              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple to-primary-500 flex items-center justify-center">
                              <span className="text-white text-xl font-bold">
                                {member.user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Member Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {member.user.fullName}
                          </h3>
                          <p className="text-sm text-primary-600 font-medium mt-1">
                            {member.specialty}
                          </p>
                          {member.bio && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {member.bio}
                            </p>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedTeamMember === member.id
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedTeamMember === member.id && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Service Selection */}
            <div>
              <h2 className="text-2xl font-bold text-purple mb-4">
                Select Services
                {selectedServices.length > 0 && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    ({selectedServices.length} selected)
                  </span>
                )}
              </h2>

              {isLoadingServices ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading services...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                  No services available at this time. Please try again later.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => {
                    // Defensive programming: ensure service has required properties
                    if (!service || !service.id) {
                      console.error('Invalid service object:', service);
                      return null;
                    }

                    return (
                      <motion.div
                        key={service.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleService(service.id)}
                        className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                          selectedServices.includes(service.id)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {service.name || 'Unnamed Service'}
                            </h3>
                            {service.description && (
                              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
                              <span className="font-medium">
                                ${Number(service.price).toFixed(2)}
                              </span>
                              <span>•</span>
                              <span>{service.duration || 30} min</span>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedServices.includes(service.id)
                              ? 'border-primary-500 bg-primary-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedServices.includes(service.id) && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {selectedServices.length > 0 && (
                <div className="mt-4 bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">Total Duration:</span>
                    <span className="text-primary-700 font-bold">{getTotalDuration()} minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="font-medium text-gray-700">Total Price:</span>
                    <span className="text-primary-700 font-bold text-lg">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Date and Time */}
            <div>
              <h2 className="text-2xl font-bold text-purple mb-4">Select Date & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="date"
                      name="date"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      id="time"
                      name="time"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all appearance-none"
                      value={formData.time}
                      onChange={handleChange}
                    >
                      <option value="">Select start time...</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.time && selectedServices.length > 0 && (
                  <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Your appointment will run from:</strong> {formData.time} to{' '}
                      {getEndTime(formData.time, getTotalDuration())}
                    </p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
                      placeholder="Any special requests or preferences..."
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || selectedServices.length === 0 || !selectedTeamMember}
              className="w-full bg-gradient-to-r from-purple to-purple-dark text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Appointment...' : `Book ${selectedServices.length} Service${selectedServices.length !== 1 ? 's' : ''}`}
            </motion.button>

            <p className="text-sm text-gray-500 text-center">
              * You'll receive an SMS confirmation once your appointment is confirmed
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
