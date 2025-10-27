import { Router } from 'express';
import {
  getAvailableSlots,
  getTeamMemberAvailability,
  updateAvailability,
  addBlockedSlot,
  getAllTeamMembers,
} from '../controllers/availability.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/slots', getAvailableSlots);
router.get('/team-members', getAllTeamMembers);
router.get('/team-member/:teamMemberId', getTeamMemberAvailability);

// Protected routes (require authentication)
router.put('/team-member/:teamMemberId', authenticate, updateAvailability);
router.post('/team-member/:teamMemberId/block', authenticate, addBlockedSlot);

export default router;
