import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { appointmentAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getUserAppointments(user.id);
      setAppointments(response.data);
    } catch (err) {
      setError('Failed to load appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.startTime) > new Date() && apt.status !== 'cancelled'
  );

  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.startTime) <= new Date() || apt.status === 'cancelled'
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back{user?.fullName ? `, ${user.fullName}` : ''}!</h1>
        <p className="phone-display">Phone: {user?.phoneNumber}</p>
        {user?.points !== undefined && (
          <div className="points-badge">
            <span className="points-label">Reward Points:</span>
            <span className="points-value">{user.points}</span>
          </div>
        )}
      </div>

      <div className="appointments-section">
        <h2>Upcoming Appointments</h2>
        {loading ? (
          <p className="loading">Loading appointments...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : upcomingAppointments.length === 0 ? (
          <div className="empty-state">
            <p>No upcoming appointments</p>
            <a href="/book" className="book-now-btn">Book an Appointment</a>
          </div>
        ) : (
          <div className="appointments-grid">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card upcoming">
                <div className="appointment-service">{appointment.service}</div>
                <div className="appointment-date">{formatDate(appointment.startTime)}</div>
                <div className="appointment-time">{formatTime(appointment.startTime)}</div>
                {appointment.technician?.fullName && (
                  <div className="appointment-tech">
                    With: {appointment.technician.fullName}
                  </div>
                )}
                <span className={`status-badge ${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {pastAppointments.length > 0 && (
        <div className="appointments-section">
          <h2>Past Appointments</h2>
          <div className="appointments-grid">
            {pastAppointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card past">
                <div className="appointment-service">{appointment.service}</div>
                <div className="appointment-date">{formatDate(appointment.startTime)}</div>
                <div className="appointment-time">{formatTime(appointment.startTime)}</div>
                {appointment.technician?.fullName && (
                  <div className="appointment-tech">
                    With: {appointment.technician.fullName}
                  </div>
                )}
                <span className={`status-badge ${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
