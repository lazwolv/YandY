import { Router } from 'express';
import authRoutes from './auth.routes';
import availabilityRoutes from './availability.routes';
import appointmentRoutes from './appointment.routes';
import serviceRoutes from './service.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/availability', availabilityRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/services', serviceRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API info endpoint
router.get('/', (_req, res) => {
  res.json({
    name: 'Y&Y Beauty Salon API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      auth: '/api/auth',
      availability: '/api/availability',
      appointments: '/api/appointments',
      services: '/api/services',
      health: '/health',
    },
  });
});

export default router;
