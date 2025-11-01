import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Plus, Check, AlertCircle } from 'lucide-react';
import { availabilityApi, Availability } from '../api/availability';

interface ScheduleManagerProps {
  teamMemberId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleManager = ({ teamMemberId, isOpen, onClose }: ScheduleManagerProps) => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // State for adding blocked time
  const [showBlockedForm, setShowBlockedForm] = useState(false);
  const [blockedSlotForm, setBlockedSlotForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    reason: '',
  });

  const daysOfWeek = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 0, label: 'Sunday' },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchAvailability();
    }
  }, [isOpen, teamMemberId]);

  const fetchAvailability = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await availabilityApi.getTeamMemberAvailability(teamMemberId);
      setAvailability(data.availability || []);
    } catch (err: any) {
      console.error('Failed to fetch availability:', err);
      setError('Failed to load schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailabilityForDay = (dayOfWeek: number): Availability | null => {
    return availability.find(a => a.dayOfWeek === dayOfWeek) || null;
  };

  const handleToggleDay = async (dayOfWeek: number, currentlyActive: boolean) => {
    try {
      setIsSaving(true);
      setError('');
      setSuccessMessage('');

      const existing = getAvailabilityForDay(dayOfWeek);
      const defaultStart = '09:00';
      const defaultEnd = '17:00';

      await availabilityApi.updateAvailability(teamMemberId, {
        dayOfWeek,
        startTime: existing?.startTime || defaultStart,
        endTime: existing?.endTime || defaultEnd,
        isActive: !currentlyActive,
      });

      setSuccessMessage(`${daysOfWeek.find(d => d.value === dayOfWeek)?.label} updated!`);
      await fetchAvailability();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update availability');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTime = async (
    dayOfWeek: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    try {
      setIsSaving(true);
      setError('');
      setSuccessMessage('');

      const existing = getAvailabilityForDay(dayOfWeek);
      if (!existing) return;

      const updatedData = {
        dayOfWeek,
        startTime: field === 'startTime' ? value : existing.startTime,
        endTime: field === 'endTime' ? value : existing.endTime,
        isActive: existing.isActive,
      };

      await availabilityApi.updateAvailability(teamMemberId, updatedData);

      setSuccessMessage('Time updated!');
      await fetchAvailability();

      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update time');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBlockedSlot = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!blockedSlotForm.date || !blockedSlotForm.startTime || !blockedSlotForm.endTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      // Convert date + time to ISO strings
      const startDateTime = new Date(`${blockedSlotForm.date}T${blockedSlotForm.startTime}`);
      const endDateTime = new Date(`${blockedSlotForm.date}T${blockedSlotForm.endTime}`);

      await availabilityApi.addBlockedSlot(teamMemberId, {
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        reason: blockedSlotForm.reason || undefined,
      });

      setSuccessMessage('Time blocked successfully!');
      setShowBlockedForm(false);
      setBlockedSlotForm({ date: '', startTime: '', endTime: '', reason: '' });

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add blocked time');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple to-purple-dark text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Manage Your Schedule</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Messages */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-start gap-2">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your schedule...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Weekly Availability */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Weekly Availability
                  </h3>
                  <div className="space-y-3">
                    {daysOfWeek.map(({ value, label }) => {
                      const dayAvailability = getAvailabilityForDay(value);
                      const isActive = dayAvailability?.isActive || false;

                      return (
                        <div
                          key={value}
                          className={`border-2 rounded-lg p-4 transition-all ${
                            isActive
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleToggleDay(value, isActive)}
                                disabled={isSaving}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                                  isActive ? 'bg-primary-500' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    isActive ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                              <span className="font-semibold text-gray-900">{label}</span>
                            </div>
                            {isActive && (
                              <span className="text-xs text-primary-600 font-medium">Available</span>
                            )}
                          </div>

                          {isActive && dayAvailability && (
                            <div className="grid grid-cols-2 gap-3 ml-14">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Start Time
                                </label>
                                <input
                                  type="time"
                                  value={dayAvailability.startTime}
                                  onChange={(e) => handleUpdateTime(value, 'startTime', e.target.value)}
                                  disabled={isSaving}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  End Time
                                </label>
                                <input
                                  type="time"
                                  value={dayAvailability.endTime}
                                  onChange={(e) => handleUpdateTime(value, 'endTime', e.target.value)}
                                  disabled={isSaving}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Blocked Time Slots */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Block Time Off
                    </h3>
                    <button
                      onClick={() => setShowBlockedForm(!showBlockedForm)}
                      className="btn bg-primary-500 text-white hover:bg-primary-600 text-sm px-4 py-2"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Blocked Time
                    </button>
                  </div>

                  {showBlockedForm && (
                    <form onSubmit={handleAddBlockedSlot} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date *
                          </label>
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={blockedSlotForm.date}
                            onChange={(e) => setBlockedSlotForm({ ...blockedSlotForm, date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time *
                          </label>
                          <input
                            type="time"
                            required
                            value={blockedSlotForm.startTime}
                            onChange={(e) => setBlockedSlotForm({ ...blockedSlotForm, startTime: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Time *
                          </label>
                          <input
                            type="time"
                            required
                            value={blockedSlotForm.endTime}
                            onChange={(e) => setBlockedSlotForm({ ...blockedSlotForm, endTime: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason (optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Lunch break, Personal appointment..."
                          value={blockedSlotForm.reason}
                          onChange={(e) => setBlockedSlotForm({ ...blockedSlotForm, reason: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="btn bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Block Time'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowBlockedForm(false);
                            setBlockedSlotForm({ date: '', startTime: '', endTime: '', reason: '' });
                          }}
                          className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <p className="text-sm text-gray-600 mt-4">
                    Use blocked time to prevent customers from booking during breaks, time off, or personal appointments.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
