import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = (await Auth.currentSession()).getIdToken().getJwtToken();
      const response = await fetch('YOUR_API_GATEWAY_URL/appointments', {
        headers: {
          Authorization: token
        }
      });
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  return (
    <div>
      <h2>Appointments</h2>
      <ul>
        {appointments.map(appointment => (
          <li key={appointment.id}>
            {appointment.client_name} - {appointment.appointment_time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
