import { Router } from 'express';
import {
  createAppointment,
  getUserAppointments,
  updateAppointmentStatus,
  getEmployeeAppointments,
  getEmployeeDashboard,
  rescheduleAppointment,
  cancelAppointment,
} from '../controllers/appointment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Customer routes
router.post('/', createAppointment);
router.get('/my-appointments', getUserAppointments);
router.patch('/:id/reschedule', rescheduleAppointment);
router.patch('/:id/cancel', cancelAppointment);

// Employee routes
router.get('/employee/dashboard', getEmployeeDashboard);
router.get('/employee/appointments', getEmployeeAppointments);

// Admin/Employee routes
router.patch('/:id/status', updateAppointmentStatus);

export default router;
