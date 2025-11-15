import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MessageSquare, Check, Users, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { servicesApi, Service } from '../api/services';
import { teamMembersApi, TeamMember } from '../api/teamMembers';
import { appointmentsApi } from '../api/appointments';
import { availabilityApi, TimeSlot } from '../api/availability';

// Type for grouped slots by date
interface GroupedSlots {
  date: string;
  dateFormatted: string;
  slots: TimeSlot[];
}

export const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();

  // Data loading states
  const [services, setServices] = useState<Service[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [groupedSlots, setGroupedSlots] = useState<GroupedSlots[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selection states (in order of new flow)
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(''); // Now optional - used as filter
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedSlotDate, setSelectedSlotDate] = useState<string>(''); // Track which date the selected slot belongs to
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setIsLoadingTeamMembers(true);
        const data = await teamMembersApi.getAllTeamMembers();
        setTeamMembers(data.teamMembers || []);

        // Check if team member is pre-selected via URL param
        const preSelectedTeamMember = searchParams.get('teamMember');
        if (preSelectedTeamMember) {
          setSelectedTeamMember(preSelectedTeamMember);
        } else if (data.teamMembers.length === 1) {
          // Auto-select if only one team member
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
  }, [searchParams]);

  // Fetch services
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

  // Fetch available slots when employee and services are selected
  // Date is now optional - if not selected, fetch next 7 days
  useEffect(() => {
    if (!selectedTeamMember || selectedServices.length === 0) {
      setGroupedSlots([]);
      setSelectedSlot('');
      setSelectedSlotDate('');
      return;
    }

    const fetchAvailableSlots = async () => {
      try {
        setIsLoadingSlots(true);
        setError('');

        const totalDuration = getTotalDuration();

        // Determine which dates to fetch
        const datesToFetch = selectedDate ? [selectedDate] : getNext7Days();

        // Fetch slots for all dates in parallel
        const slotPromises = datesToFetch.map(async (date) => {
          try {
            const data = await availabilityApi.getAvailableSlots(
              selectedTeamMember,
              date,
              totalDuration
            );
            return { date, slots: data.slots || [] };
          } catch (error) {
            console.error(`Failed to fetch slots for ${date}:`, error);
            return { date, slots: [] };
          }
        });

        const results = await Promise.all(slotPromises);

        // Group slots by date with formatted headers
        const grouped: GroupedSlots[] = results
          .filter(({ slots }) => slots.length > 0) // Only include dates with available slots
          .map(({ date, slots }) => ({
            date,
            dateFormatted: formatDateHeader(date),
            slots,
          }));

        setGroupedSlots(grouped);

        // Reset slot selection when slots change
        setSelectedSlot('');
        setSelectedSlotDate('');

        // Show message if no slots available at all
        if (grouped.length === 0) {
          if (selectedDate) {
            setError(`No ${totalDuration}-minute slots available on this day. Try selecting a different date.`);
          } else {
            setError(`No ${totalDuration}-minute slots available in the next 7 days. Try different services or check back later.`);
          }
        }
      } catch (error: any) {
        console.error('Failed to fetch available slots:', error);
        setError('Failed to load available time slots. Please try again.');
        setGroupedSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedTeamMember, selectedServices, selectedDate]);

  // Helper: Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
    // Reset slot when services change (slots will auto-refetch)
    setSelectedSlot('');
    setSelectedSlotDate('');
  };

  // Helper: Calculate total duration from selected services
  const getTotalDuration = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.duration || 0);
    }, 0);
  };

  // Helper: Calculate total price from selected services
  const getTotalPrice = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (Number(service?.price) || 0);
    }, 0);
  };

  // Helper: Get selected team member name
  const getSelectedTeamMemberName = () => {
    const member = teamMembers.find(m => m.id === selectedTeamMember);
    return member?.user.fullName.split(' ')[0] || 'Employee';
  };

  // Helper: Generate next 7 days (YYYY-MM-DD format)
  const getNext7Days = (): string[] => {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }

    return dates;
  };

  // Helper: Format date for display (e.g., "Monday, November 15")
  const formatDateHeader = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(year, month - 1, day);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return 'Today, ' + date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      });
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (compareDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow, ' + date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      });
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle form submission
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

    if (!selectedSlot || !selectedSlotDate) {
      setError('Please select a time slot');
      return;
    }

    if (!user) {
      setError('You must be logged in to book an appointment');
      return;
    }

    try {
      setIsSubmitting(true);

      // Parse selected slot time to ISO string
      const [time, period] = selectedSlot.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) hour24 += 12;
      if (period === 'AM' && hours === 12) hour24 = 0;

      // Parse date correctly to avoid timezone issues
      // selectedSlotDate format: "YYYY-MM-DD"
      const [year, month, day] = selectedSlotDate.split('-').map(Number);

      // Format as ISO string WITHOUT timezone conversion
      // Format: YYYY-MM-DDTHH:MM:SS (no Z suffix)
      const startTimeString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

      // Use bulk appointment endpoint (atomic creation)
      const result = await appointmentsApi.createBulkAppointment({
        teamMemberId: selectedTeamMember,
        serviceIds: selectedServices,
        startTime: startTimeString,
        notes: notes || undefined,
      });

      // Success! Show message and redirect
      alert(result.message || `Successfully booked ${result.appointments.length} appointment(s)!`);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Booking error:', error);
      setError(error.response?.data?.error || 'Failed to create appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progressive disclosure: Calculate what steps are complete (now 3 steps instead of 4)
  const isStep1Complete = selectedTeamMember !== '';
  const isStep2Complete = isStep1Complete && selectedServices.length > 0;
  const isStep3Complete = isStep2Complete && selectedSlot !== '' && selectedSlotDate !== '';

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
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white px-8 py-12 text-center border-b border-white/10">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20">
                <Calendar className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">Book Your Appointment</h1>
            <p className="text-white/90 text-lg">Hi {user.fullName}, let's find the perfect time for you</p>
          </div>

          {/* Progress Steps */}
          <div className="bg-white/5 px-8 py-4 border-b border-white/10">
            <div className="flex items-center justify-center gap-4 max-w-xl mx-auto">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isStep1Complete ? 'bg-white/10 text-white border-white/30' : 'bg-white/5 text-white/50 border-white/10'}`}>
                  {isStep1Complete ? <Check className="w-5 h-5" /> : '1'}
                </div>
                <span className={`text-sm font-medium ${isStep1Complete ? 'text-white' : 'text-white/50'}`}>Employee</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isStep2Complete ? 'bg-white/10 text-white border-white/30' : 'bg-white/5 text-white/50 border-white/10'}`}>
                  {isStep2Complete ? <Check className="w-5 h-5" /> : '2'}
                </div>
                <span className={`text-sm font-medium ${isStep2Complete ? 'text-white' : 'text-white/50'}`}>Services</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30" />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isStep3Complete ? 'bg-white/10 text-white border-white/30' : 'bg-white/5 text-white/50 border-white/10'}`}>
                  {isStep3Complete ? <Check className="w-5 h-5" /> : '3'}
                </div>
                <span className={`text-sm font-medium ${isStep3Complete ? 'text-white' : 'text-white/50'}`}>Time</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-transparent">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Team Member Selection */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Step 1: Choose Your Nail Technician
              </h2>

              {isLoadingTeamMembers ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="mt-2 text-white/70">Loading team members...</p>
                </div>
              ) : teamMembers.length === 0 ? (
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 px-4 py-3 rounded-lg">
                  No team members available at this time. Please try again later.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedTeamMember(member.id);
                        // Reset subsequent steps when employee changes
                        setSelectedServices([]);
                        setSelectedSlot('');
                        setSelectedSlotDate('');
                      }}
                      className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                        selectedTeamMember === member.id
                          ? 'border-white/30 bg-white/10 shadow-md'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                      }`}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selectedTeamMember === member.id}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedTeamMember(member.id);
                          setSelectedServices([]);
                          setSelectedSlot('');
                          setSelectedSlotDate('');
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
                              className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center">
                              <span className="text-white text-xl font-bold">
                                {member.user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Member Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-lg">
                            {member.user.fullName}
                          </h3>
                          <p className="text-sm text-white/80 font-medium mt-1">
                            {member.specialty}
                          </p>
                          {member.bio && (
                            <p className="text-sm text-white/70 mt-2 line-clamp-2">
                              {member.bio}
                            </p>
                          )}
                        </div>

                        {/* Selection Indicator */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedTeamMember === member.id
                            ? 'border-white/50 bg-white/20'
                            : 'border-white/30'
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

            {/* STEP 2: Service Selection (only show if step 1 complete) */}
            {isStep1Complete && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  Step 2: Select Services
                  {selectedServices.length > 0 && (
                    <span className="text-sm font-normal text-white/70 ml-2">
                      ({selectedServices.length} selected)
                    </span>
                  )}
                </h2>

                {isLoadingServices ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-2 text-white/70">Loading services...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 px-4 py-3 rounded-lg">
                    No services available at this time. Please try again later.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => {
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
                                ? 'border-white/30 bg-white/10'
                                : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-white">
                                  {service.name || 'Unnamed Service'}
                                </h3>
                                {service.description && (
                                  <p className="text-sm text-white/70 mt-1">{service.description}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <span className="font-medium text-white">
                                    ${Number(service.price).toFixed(2)}
                                  </span>
                                  <span className="text-white/80">•</span>
                                  <span className="text-white/80">{service.duration} min</span>
                                </div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedServices.includes(service.id)
                                  ? 'border-white/50 bg-white/20'
                                  : 'border-white/30'
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

                    {selectedServices.length > 0 && (
                      <div className="mt-4 bg-white/10 border border-white/20 rounded-lg p-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-white/90">Total Duration:</span>
                          <span className="text-white font-bold">{getTotalDuration()} minutes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="font-medium text-white/90">Total Price:</span>
                          <span className="text-white font-bold text-lg">${getTotalPrice().toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* STEP 3: Time Slot Selection (auto-shows after step 2, with optional date filter) */}
            {isStep2Complete && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  Step 3: Select Time Slot
                </h2>

                {/* Context Banner */}
                <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-white/90">
                    <strong>Looking for {getTotalDuration()}-minute slots</strong> with {getSelectedTeamMemberName()}
                    {selectedDate && (
                      <> on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}</>
                    )}
                  </p>
                </div>

                {/* Optional Date Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Filter by Date (optional)
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1 max-w-md">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        max={getNext7Days()[6]}
                        className="w-full pl-10 pr-4 py-3 border border-white/20 bg-white/5 text-white rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedSlot(''); // Reset slot when filter changes
                          setSelectedSlotDate('');
                        }}
                      />
                    </div>
                    {selectedDate && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDate('');
                          setSelectedSlot('');
                          setSelectedSlotDate('');
                        }}
                        className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white rounded-lg border border-white/20 transition-all text-sm font-medium"
                      >
                        Show All Dates
                      </button>
                    )}
                  </div>
                  {!selectedDate && (
                    <p className="text-xs text-white/60 mt-2">
                      Showing all available slots for the next 7 days
                    </p>
                  )}
                </div>

                {/* Loading State */}
                {isLoadingSlots ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white/50 mx-auto mb-4"></div>
                    <p className="text-white/70 text-lg">Finding available slots...</p>
                    <p className="text-white/50 text-sm mt-2">
                      {selectedDate ? 'Checking this date' : 'Checking the next 7 days'}
                    </p>
                  </div>
                ) : groupedSlots.length === 0 ? (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 px-6 py-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">No slots available</p>
                        <p className="text-sm">
                          {selectedDate
                            ? `No ${getTotalDuration()}-minute slots available on this day. Try selecting a different date.`
                            : `No ${getTotalDuration()}-minute slots available in the next 7 days. Try selecting different services or check back later.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {groupedSlots.map(({ date, dateFormatted, slots }) => (
                      <div key={date} className="space-y-3">
                        {/* Date Header */}
                        <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          {dateFormatted}
                          <span className="text-sm font-normal text-white/60">
                            ({slots.length} slot{slots.length !== 1 ? 's' : ''})
                          </span>
                        </h3>

                        {/* Time Slots Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {slots.map((slot, index) => (
                            <motion.button
                              key={`${date}-${index}`}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedSlot(slot.time);
                                setSelectedSlotDate(date);
                              }}
                              className={`p-3 rounded-lg border-2 transition-all text-center ${
                                selectedSlot === slot.time && selectedSlotDate === date
                                  ? 'border-white/50 bg-white/20 text-white shadow-lg ring-2 ring-white/30'
                                  : 'border-white/20 hover:border-white/30 bg-white/5 text-white hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="font-semibold text-sm">{slot.time}</span>
                              </div>
                              <div className="text-xs opacity-80">
                                to {slot.endTime}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Additional Notes (show if step 3 complete) */}
            {isStep3Complete && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="notes" className="block text-sm font-medium text-white/90 mb-1">
                  Additional Notes (optional)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-white/50" />
                  <textarea
                    id="notes"
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 border border-white/20 bg-white/5 text-white rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all placeholder:text-white/40"
                    placeholder="Any special requests or preferences..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || !isStep3Complete}
              className="w-full bg-white/10 text-white font-bold py-4 rounded-lg border border-white/20 hover:bg-white/15 hover:border-white/30 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Creating Appointment...'
                : `Book ${selectedServices.length} Service${selectedServices.length !== 1 ? 's' : ''} with ${getSelectedTeamMemberName()}`
              }
            </motion.button>

            <p className="text-sm text-white/70 text-center">
              * You'll receive an SMS confirmation once your appointment is confirmed
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
